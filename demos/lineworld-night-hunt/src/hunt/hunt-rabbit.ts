import * as THREE from 'three'
import { decideRabbitState, selectFleeDirection, threatScore } from './ai'
import type { RabbitPerception, RabbitState } from './ai'
import { HuntCollisionField } from './collision'

function dampAngle(cur: number, target: number, lambda: number, dt: number): number {
  let d = target - cur
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return cur + d * (1 - Math.exp(-lambda * dt))
}

class RabbitRig {
  readonly geometry: THREE.BufferGeometry
  readonly material: THREE.LineBasicMaterial
  readonly line: THREE.LineSegments
  private positions: Float32Array
  private i = 0

  constructor(maxSegments = 28) {
    this.positions = new Float32Array(maxSegments * 6)
    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    this.geometry.setDrawRange(0, 0)
    this.material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, fog: false })
    this.line = new THREE.LineSegments(this.geometry, this.material)
    this.line.frustumCulled = false
  }

  begin() { this.i = 0 }

  segment(ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
    const o = this.i * 6
    this.positions[o] = ax; this.positions[o + 1] = ay; this.positions[o + 2] = az
    this.positions[o + 3] = bx; this.positions[o + 4] = by; this.positions[o + 5] = bz
    this.i++
  }

  end() {
    this.geometry.setDrawRange(0, this.i * 2)
    ;(this.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
  }
}

export interface RabbitSnapshot {
  state: RabbitState
  role: 'prey' | 'guide'
  x: number
  z: number
  distanceToDog: number
  distanceToBurrow: number
  threat: number
  stamina: number
}

export class HuntRabbit {
  readonly group = new THREE.Group()
  readonly position: THREE.Vector3
  state: RabbitState = 'calm'
  stamina = 1
  threat = 0
  private rig = new RabbitRig()
  private heading = Math.PI
  private stateTime = 0
  private jukeCooldown = 1.1
  private jukeSign = 1
  private hopPhase = 0
  private wanderPhase = 0
  private lastSnapshot: RabbitSnapshot
  private role: 'prey' | 'guide' = 'prey'
  private guideTarget: THREE.Vector3 | null = null

  constructor(
    private scene: THREE.Scene,
    start: THREE.Vector3,
    private burrow: THREE.Vector3,
    private random: () => number,
    private collision: HuntCollisionField
  ) {
    this.position = start.clone()
    this.group.add(this.rig.line)
    this.scene.add(this.group)
    this.lastSnapshot = this.makeSnapshot(start)
    this.pose(0)
  }

  get catchable() {
    return this.role === 'prey' && (this.state === 'fleeing' || this.state === 'juking' || this.state === 'burrowing')
  }

  get terminal() {
    return this.state === 'caught' || this.state === 'escaped' || this.state === 'guided'
  }

  snapshot(): RabbitSnapshot {
    return {
      ...this.lastSnapshot,
      state: this.state,
      role: this.role,
      x: this.position.x,
      z: this.position.z,
      stamina: this.stamina,
    }
  }

  update(
    dt: number,
    dog: THREE.Vector3,
    dogSpeed: number,
    dogHeading: number,
    radius: number,
    barkPulse: boolean
  ): RabbitSnapshot {
    if (this.role === 'guide') return this.updateGuide(dt, dog)
    if (this.terminal) {
      if (this.state === 'caught') this.rig.material.opacity = 1
      this.lastSnapshot = this.makeSnapshot(dog)
      return this.lastSnapshot
    }

    this.stateTime += dt
    this.jukeCooldown -= dt
    const toRabbit = new THREE.Vector3(this.position.x - dog.x, 0, this.position.z - dog.z)
    const dogForward = new THREE.Vector3(Math.sin(dogHeading), 0, Math.cos(dogHeading))
    const dogFacing = toRabbit.lengthSq() > 0.001 ? dogForward.dot(toRabbit.normalize()) : 1
    const perception: RabbitPerception = {
      distanceToDog: Math.hypot(dog.x - this.position.x, dog.z - this.position.z),
      distanceToBurrow: Math.hypot(this.burrow.x - this.position.x, this.burrow.z - this.position.z),
      dogSpeed,
      dogFacing,
      barkPulse,
    }
    this.threat = threatScore(perception)
    const next = decideRabbitState({
      state: this.state,
      stateTime: this.stateTime,
      jukeCooldown: this.jukeCooldown,
      perception,
    })
    if (next !== this.state) this.enterState(next)

    let hopY = 0
    if (this.state === 'calm') {
      this.wanderPhase += dt
      this.hopPhase += dt * 2.4
      hopY = Math.max(0, Math.sin(this.hopPhase * Math.PI)) * 0.045
      this.heading += Math.sin(this.wanderPhase * 0.7) * dt * 0.18
      this.move(Math.sin(this.heading) * dt * 0.18, Math.cos(this.heading) * dt * 0.18, 0.38)
      this.stamina = Math.min(1, this.stamina + dt * 0.12)
    } else if (this.state === 'listening' || this.state === 'alert') {
      this.heading = dampAngle(this.heading, Math.atan2(dog.x - this.position.x, dog.z - this.position.z), 7, dt)
      this.stamina = Math.min(1, this.stamina + dt * 0.08)
    } else if (this.state === 'fleeing' || this.state === 'juking' || this.state === 'burrowing') {
      const pressure = 1 - Math.min(perception.distanceToDog / 12, 1)
      const intent = selectFleeDirection(this.position, dog, this.burrow, this.state, this.jukeSign, pressure)
      const desired = this.collision.steer(this.position, intent, 0.42)
      const desiredHeading = Math.atan2(desired.x, desired.z)
      this.heading = dampAngle(this.heading, desiredHeading, this.state === 'juking' ? 14 : 8, dt)
      const burst = perception.distanceToDog < 2.8 && this.stamina > 0.12
      const speed = this.state === 'burrowing' ? 5.8 : burst ? 5.45 : 4.5 + this.stamina * 0.35
      this.move(Math.sin(this.heading) * speed * dt, Math.cos(this.heading) * speed * dt, 0.42)
      this.stamina = Math.max(0, this.stamina - dt * (burst ? 0.28 : 0.12))
      this.hopPhase += dt * (burst ? 7.5 : 6.2)
      hopY = Math.abs(Math.sin((this.hopPhase % 1) * Math.PI)) * 0.24
    }

    const d = Math.hypot(dog.x - this.position.x, dog.z - this.position.z)
    const pool = 1 - Math.min(Math.max((d - radius * 0.18) / Math.max(1, radius * 0.82), 0), 1)
    this.rig.material.opacity = 0.08 + pool * 0.92
    this.rig.material.color.setHex(
      this.state === 'alert' ? 0xffb36b : this.state === 'listening' ? 0xffe0a3 : 0xffffff
    )
    this.group.position.copy(this.position)
    this.group.rotation.y = this.heading
    this.pose(hopY)
    this.lastSnapshot = this.makeSnapshot(dog)
    return this.lastSnapshot
  }

  catch() {
    if (!this.catchable) return false
    this.enterState('caught')
    this.rig.material.color.setHex(0xffd7a1)
    this.rig.material.opacity = 1
    return true
  }

  forceCaught() {
    this.enterState('caught')
    this.group.visible = true
    this.rig.material.color.setHex(0xffd7a1)
    this.rig.material.opacity = 1
  }

  forceFleeingAt(position: THREE.Vector3) {
    this.position.copy(position)
    this.group.visible = true
    this.stamina = 1
    this.jukeCooldown = 2
    this.enterState('fleeing')
  }

  startGuideAt(position: THREE.Vector3, target: THREE.Vector3) {
    this.role = 'guide'
    this.guideTarget = target.clone()
    this.position.copy(position)
    this.group.visible = true
    this.enterState('waiting')
    this.rig.material.color.setHex(0x79d8ff)
    this.rig.material.opacity = 1
  }

  release(directionFrom: THREE.Vector3) {
    const away = this.position.clone().sub(directionFrom).setY(0).normalize()
    this.position.addScaledVector(away, 2.5)
    this.enterState('fleeing')
    this.stamina = 1
    this.group.visible = true
  }

  hide() { this.group.visible = false }

  private enterState(next: RabbitState) {
    this.state = next
    this.stateTime = 0
    if (next === 'juking') {
      this.jukeSign = this.random() < 0.5 ? -1 : 1
      this.jukeCooldown = 1.4 + this.random() * 1.2
    }
    if (next === 'escaped') this.group.visible = false
  }

  private makeSnapshot(dog: THREE.Vector3): RabbitSnapshot {
    return {
      state: this.state,
      role: this.role,
      x: this.position.x,
      z: this.position.z,
      distanceToDog: Math.hypot(dog.x - this.position.x, dog.z - this.position.z),
      distanceToBurrow: Math.hypot(this.burrow.x - this.position.x, this.burrow.z - this.position.z),
      threat: this.threat,
      stamina: this.stamina,
    }
  }

  private updateGuide(dt: number, dog: THREE.Vector3): RabbitSnapshot {
    if (!this.guideTarget || this.state === 'guided') {
      this.lastSnapshot = this.makeSnapshot(dog)
      return this.lastSnapshot
    }
    this.stateTime += dt
    const dogDistance = Math.hypot(dog.x - this.position.x, dog.z - this.position.z)
    const targetDistance = Math.hypot(this.guideTarget.x - this.position.x, this.guideTarget.z - this.position.z)
    const reachedTarget = targetDistance < 0.75
    if (reachedTarget) {
      this.enterState('guided')
    } else if (dogDistance > 8.5) {
      if (this.state !== 'waiting') this.enterState('waiting')
      this.heading = dampAngle(this.heading, Math.atan2(dog.x - this.position.x, dog.z - this.position.z), 5, dt)
    } else {
      if (this.state !== 'guiding') this.enterState('guiding')
      const intent = {
        x: this.guideTarget.x - this.position.x,
        z: this.guideTarget.z - this.position.z,
      }
      const desired = this.collision.steer(this.position, intent, 0.42)
      this.heading = dampAngle(this.heading, Math.atan2(desired.x, desired.z), 7, dt)
      this.move(Math.sin(this.heading) * 2.65 * dt, Math.cos(this.heading) * 2.65 * dt, 0.42)
      this.hopPhase += dt * 4.2
    }
    const hopY = this.state === 'guiding' ? Math.abs(Math.sin((this.hopPhase % 1) * Math.PI)) * 0.16 : 0
    this.rig.material.color.setHex(reachedTarget ? 0xffd27a : 0x79d8ff)
    this.rig.material.opacity = 1
    this.group.position.copy(this.position)
    this.group.rotation.y = this.heading
    this.pose(hopY)
    this.lastSnapshot = this.makeSnapshot(dog)
    return this.lastSnapshot
  }

  private move(dx: number, dz: number, radius: number) {
    const resolved = this.collision.resolveMovement(
      this.position,
      { x: this.position.x + dx, z: this.position.z + dz },
      radius
    )
    this.position.set(resolved.x, 0, resolved.z)
  }

  private pose(y: number) {
    const r = this.rig
    r.begin()
    const cy = 0.17 + y
    const pts: [number, number][] = []
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      pts.push([cy + Math.sin(a) * 0.11, Math.cos(a) * 0.15 - 0.02])
    }
    for (let i = 0; i < 6; i++) {
      const [y1, z1] = pts[i]
      const [y2, z2] = pts[(i + 1) % 6]
      r.segment(0, y1, z1, 0, y2, z2)
    }
    const hy = 0.28 + y, hz = 0.15
    for (let i = 0; i < 5; i++) {
      const a1 = (i / 5) * Math.PI * 2
      const a2 = ((i + 1) / 5) * Math.PI * 2
      r.segment(0, hy + Math.sin(a1) * 0.055, hz + Math.cos(a1) * 0.055, 0, hy + Math.sin(a2) * 0.055, hz + Math.cos(a2) * 0.055)
    }
    r.segment(0.015, hy + 0.05, hz - 0.02, 0.03, hy + 0.19, hz - 0.08)
    r.segment(-0.015, hy + 0.05, hz - 0.02, -0.03, hy + 0.19, hz - 0.08)
    r.segment(0, cy + 0.03, -0.17, 0, cy + 0.07, -0.21)
    const footY = y > 0.02 ? cy - 0.13 : 0
    r.segment(0.04, cy - 0.1, 0.09, 0.04, footY, 0.11)
    r.segment(-0.04, cy - 0.1, 0.09, -0.04, footY, 0.11)
    r.segment(0.05, cy - 0.09, -0.1, 0.05, footY, -0.14)
    r.segment(-0.05, cy - 0.09, -0.1, -0.05, footY, -0.14)
    r.end()
  }

  dispose() {
    this.scene.remove(this.group)
    this.rig.dispose()
  }
}
