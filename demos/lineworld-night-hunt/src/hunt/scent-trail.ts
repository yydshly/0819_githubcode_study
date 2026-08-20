import * as THREE from 'three'
import { getScentMaterial } from '../scent'

const MAX_SAMPLES = 72

export class DynamicScentTrail {
  readonly points: THREE.Points
  private history: THREE.Vector3[] = []
  private sampleTimer = 0
  private positions = new Float32Array(MAX_SAMPLES * 2 * 3)
  private ts = new Float32Array(MAX_SAMPLES * 2)
  private seeds = new Float32Array(MAX_SAMPLES * 2)
  private geometry = new THREE.BufferGeometry()

  constructor(scene: THREE.Scene, initial: THREE.Vector3) {
    this.history.push(initial.clone())
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    this.geometry.setAttribute('aT', new THREE.BufferAttribute(this.ts, 1))
    this.geometry.setAttribute('aSeed', new THREE.BufferAttribute(this.seeds, 1))
    this.geometry.setDrawRange(0, 0)
    this.points = new THREE.Points(this.geometry, getScentMaterial())
    this.points.frustumCulled = false
    scene.add(this.points)
  }

  update(dt: number, position: THREE.Vector3, active: boolean) {
    if (!active) return
    this.sampleTimer -= dt
    const last = this.history[this.history.length - 1]
    if (this.sampleTimer > 0 && last.distanceToSquared(position) < 0.3 * 0.3) return
    this.sampleTimer = 0.14
    this.history.push(position.clone())
    if (this.history.length > MAX_SAMPLES) this.history.shift()
    this.rebuild()
  }

  reset(position: THREE.Vector3) {
    this.history = [position.clone()]
    this.sampleTimer = 0
    this.rebuild()
  }

  private rebuild() {
    let cursor = 0
    const denom = Math.max(1, this.history.length - 1)
    for (let i = 0; i < this.history.length; i++) {
      const p = this.history[i]
      const t = i / denom
      for (let k = 0; k < 2; k++) {
        const seed = ((i * 7919 + k * 104729) % 997) / 997
        const seed2 = ((i * 6271 + k * 31337) % 991) / 991
        const pi = cursor * 3
        this.positions[pi] = p.x + (seed - 0.5) * 0.28
        this.positions[pi + 1] = 0.42 + (seed2 - 0.5) * 0.16
        this.positions[pi + 2] = p.z + (seed2 - 0.5) * 0.28
        this.ts[cursor] = t
        this.seeds[cursor] = seed
        cursor++
      }
    }
    this.geometry.setDrawRange(0, cursor)
    ;(this.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true
    ;(this.geometry.getAttribute('aT') as THREE.BufferAttribute).needsUpdate = true
    ;(this.geometry.getAttribute('aSeed') as THREE.BufferAttribute).needsUpdate = true
    this.geometry.computeBoundingSphere()
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.points)
    this.geometry.dispose()
  }
}
