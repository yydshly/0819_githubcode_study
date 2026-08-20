import * as THREE from 'three'

const clamp = (x: number, a: number, b: number) => Math.min(Math.max(x, a), b)

function dampAngle(cur: number, target: number, lambda: number, dt: number): number {
  let d = target - cur
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return cur + d * (1 - Math.exp(-lambda * dt))
}

// dinamik line buffer'lı minik rig
class LineRig {
  arr: Float32Array
  attr: THREE.BufferAttribute
  geo: THREE.BufferGeometry
  mat: THREE.LineBasicMaterial
  line: THREE.LineSegments
  private i = 0

  constructor(maxSegs: number) {
    this.arr = new Float32Array(maxSegs * 6)
    this.attr = new THREE.BufferAttribute(this.arr, 3)
    this.attr.setUsage(THREE.DynamicDrawUsage)
    this.geo = new THREE.BufferGeometry()
    this.geo.setAttribute('position', this.attr)
    this.mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1, fog: false })
    this.line = new THREE.LineSegments(this.geo, this.mat)
    this.line.frustumCulled = false
  }

  begin() { this.i = 0 }
  seg(ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
    const a = this.arr
    let i = this.i
    a[i++] = ax; a[i++] = ay; a[i++] = az
    a[i++] = bx; a[i++] = by; a[i++] = bz
    this.i = i
  }
  end() {
    this.attr.needsUpdate = true
    this.geo.setDrawRange(0, this.i / 3)
  }
  dispose() {
    this.geo.dispose()
    this.mat.dispose()
  }
}

interface Critter {
  group: THREE.Group
  pos: THREE.Vector3
  update(dt: number, player: THREE.Vector3, radius: number, perches: THREE.Vector3[], time: number): void
  dispose(): void
}

function poolOpacity(d: number, radius: number): number {
  return clamp(1.25 - d / (radius * 1.4), 0, 1)
}

// --- KUŞ ---
class Bird implements Critter {
  group = new THREE.Group()
  pos: THREE.Vector3
  private rig = new LineRig(12)
  private vel = new THREE.Vector3()
  private heading = 0
  private flap = 0
  private state: 'perched' | 'flying' = 'perched'
  private target: THREE.Vector3 | null = null
  private timer = 3 + Math.random() * 15

  constructor(scene: THREE.Scene, perch: THREE.Vector3) {
    this.pos = perch.clone()
    this.group.add(this.rig.line)
    scene.add(this.group)
  }

  startle() {
    if (this.state === 'perched') this.timer = 0
  }

  update(dt: number, player: THREE.Vector3, radius: number, perches: THREE.Vector3[]) {
    if (this.state === 'perched') {
      this.timer -= dt
      const startled = Math.hypot(player.x - this.pos.x, player.z - this.pos.z) < 4.5
      if (this.timer <= 0 || startled) {
        const cands = perches.filter(p => {
          const d = p.distanceTo(this.pos)
          return d > 8 && d < 45
        })
        this.target = cands.length > 0
          ? cands[Math.floor(Math.random() * cands.length)]
          : this.pos.clone().add(new THREE.Vector3((Math.random() - 0.5) * 30, 3 + Math.random() * 3, (Math.random() - 0.5) * 30))
        this.state = 'flying'
        this.vel.set((Math.random() - 0.5) * 2, 2.5, (Math.random() - 0.5) * 2)
      }
    } else {
      const t = this.target!
      const dist = this.pos.distanceTo(t)
      const wp = t.clone()
      if (dist > 5) wp.y = Math.max(t.y + 2, this.pos.y)
      const dir = wp.sub(this.pos).normalize().multiplyScalar(6)
      this.vel.lerp(dir, 1 - Math.exp(-2.5 * dt))
      this.pos.addScaledVector(this.vel, dt)
      this.heading = Math.atan2(this.vel.x, this.vel.z)
      this.flap += dt * 14
      if (dist < 0.5) {
        this.state = 'perched'
        this.pos.copy(t)
        this.vel.set(0, 0, 0)
        this.timer = 4 + Math.random() * 16
      }
    }

    const d = Math.hypot(player.x - this.pos.x, player.z - this.pos.z)
    this.rig.mat.opacity = poolOpacity(d, radius)
    this.group.position.copy(this.pos)
    this.group.rotation.y = this.heading
    this.pose()
  }

  private pose() {
    const r = this.rig
    r.begin()
    r.seg(0, 0, -0.1, 0, 0, 0.1)                 // gövde
    r.seg(0, 0.02, 0.1, 0, 0.055, 0.17)          // baş
    r.seg(0, 0, -0.1, 0.045, 0.01, -0.19)        // kuyruk V
    r.seg(0, 0, -0.1, -0.045, 0.01, -0.19)
    const flying = this.state === 'flying'
    const fa = flying ? Math.sin(this.flap) : 0
    for (const s of [-1, 1]) {
      if (flying) {
        r.seg(s * 0.03, 0.02, 0.02, s * 0.16, fa * 0.1, 0)
        r.seg(s * 0.16, fa * 0.1, 0, s * 0.31, fa * 0.24, -0.04)
      } else {
        r.seg(s * 0.03, 0.02, 0.02, s * 0.06, 0.015, -0.07)
        r.seg(s * 0.06, 0.015, -0.07, s * 0.075, 0.03, -0.16)
      }
    }
    r.end()
  }

  dispose() { this.rig.dispose() }
}

// --- TAVŞAN ---
class Rabbit implements Critter {
  group = new THREE.Group()
  pos: THREE.Vector3
  private rig = new LineRig(24)
  private heading = 0
  private state: 'idle' | 'hop' = 'idle'
  private idleT = 1 + Math.random() * 2
  private hopPhase = 0
  private fleeing = false
  private target = new THREE.Vector3()

  constructor(scene: THREE.Scene, pos: THREE.Vector3) {
    this.pos = pos.clone()
    this.group.add(this.rig.line)
    scene.add(this.group)
  }

  scare(from: THREE.Vector3) {
    this.fleeing = true
    this.state = 'hop'
    const away = new THREE.Vector3(this.pos.x - from.x, 0, this.pos.z - from.z).normalize()
    this.target.copy(this.pos).addScaledVector(away, 9 + Math.random() * 4)
  }

  update(dt: number, player: THREE.Vector3, radius: number) {
    const dPlayer = Math.hypot(player.x - this.pos.x, player.z - this.pos.z)
    if (dPlayer < 5 && !this.fleeing) this.scare(player)

    let hopY = 0
    if (this.state === 'idle') {
      this.idleT -= dt
      if (this.idleT <= 0) {
        this.state = 'hop'
        const a = Math.random() * Math.PI * 2
        this.target.copy(this.pos).add(new THREE.Vector3(Math.cos(a) * (2 + Math.random() * 6), 0, Math.sin(a) * (2 + Math.random() * 6)))
      }
    } else {
      this.hopPhase += dt * (this.fleeing ? 6.5 : 4)
      const dir = new THREE.Vector3(this.target.x - this.pos.x, 0, this.target.z - this.pos.z)
      const dist = dir.length()
      if (dist < 0.4) {
        this.state = 'idle'
        this.idleT = this.fleeing ? 0.4 : 1 + Math.random() * 3
        this.fleeing = false
        this.hopPhase = 0
      } else {
        dir.normalize()
        this.heading = dampAngle(this.heading, Math.atan2(dir.x, dir.z), 8, dt)
        this.pos.addScaledVector(dir, (this.fleeing ? 4.2 : 1.9) * dt)
        hopY = Math.abs(Math.sin((this.hopPhase % 1) * Math.PI)) * 0.22
      }
    }

    const d = Math.hypot(player.x - this.pos.x, player.z - this.pos.z)
    this.rig.mat.opacity = poolOpacity(d, radius)
    this.group.position.copy(this.pos)
    this.group.rotation.y = this.heading
    this.pose(hopY)
  }

  private pose(y: number) {
    const r = this.rig
    r.begin()
    // gövde: dikey düzlemde altıgen
    const cy = 0.17 + y
    const pts: [number, number][] = []
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      pts.push([cy + Math.sin(a) * 0.11, Math.cos(a) * 0.15 - 0.02])
    }
    for (let i = 0; i < 6; i++) {
      const [y1, z1] = pts[i]
      const [y2, z2] = pts[(i + 1) % 6]
      r.seg(0, y1, z1, 0, y2, z2)
    }
    // kafa
    const hy = 0.28 + y, hz = 0.15
    for (let i = 0; i < 5; i++) {
      const a1 = (i / 5) * Math.PI * 2
      const a2 = ((i + 1) / 5) * Math.PI * 2
      r.seg(0, hy + Math.sin(a1) * 0.055, hz + Math.cos(a1) * 0.055, 0, hy + Math.sin(a2) * 0.055, hz + Math.cos(a2) * 0.055)
    }
    // kulaklar
    r.seg(0.015, hy + 0.05, hz - 0.02, 0.03, hy + 0.19, hz - 0.08)
    r.seg(-0.015, hy + 0.05, hz - 0.02, -0.03, hy + 0.19, hz - 0.08)
    // kuyruk
    r.seg(0, cy + 0.03, -0.17, 0, cy + 0.07, -0.21)
    // bacak imaları (ziplarken toplanır)
    const footY = y > 0.02 ? cy - 0.13 : 0
    r.seg(0.04, cy - 0.1, 0.09, 0.04, footY, 0.11)
    r.seg(-0.04, cy - 0.1, 0.09, -0.04, footY, 0.11)
    r.seg(0.05, cy - 0.09, -0.1, 0.05, footY, -0.14)
    r.seg(-0.05, cy - 0.09, -0.1, -0.05, footY, -0.14)
    r.end()
  }

  dispose() { this.rig.dispose() }
}

// --- TİLKİ ---
class Fox implements Critter {
  group = new THREE.Group()
  pos: THREE.Vector3
  private rig = new LineRig(20)
  private heading = 0
  private phase = 0
  private amp = 0
  private idleT = 0
  private target = new THREE.Vector3()
  private hasTarget = false

  constructor(scene: THREE.Scene, pos: THREE.Vector3) {
    this.pos = pos.clone()
    this.group.add(this.rig.line)
    scene.add(this.group)
  }

  scare(from: THREE.Vector3) {
    const away = new THREE.Vector3(this.pos.x - from.x, 0, this.pos.z - from.z).normalize()
    this.target.copy(this.pos).addScaledVector(away, 14)
    this.hasTarget = true
  }

  update(dt: number, player: THREE.Vector3, radius: number, _p: THREE.Vector3[], time: number) {
    const dPlayer = Math.hypot(player.x - this.pos.x, player.z - this.pos.z)
    let speed = 0
    if (dPlayer < 6) {
      const away = new THREE.Vector3(this.pos.x - player.x, 0, this.pos.z - player.z).normalize()
      this.target.copy(this.pos).addScaledVector(away, 12)
      this.hasTarget = true
      speed = 2.8
    }
    if (!this.hasTarget) {
      this.idleT -= dt
      if (this.idleT <= 0) {
        const a = Math.random() * Math.PI * 2
        this.target.copy(this.pos).add(new THREE.Vector3(Math.cos(a) * (5 + Math.random() * 9), 0, Math.sin(a) * (5 + Math.random() * 9)))
        this.hasTarget = true
      }
    }
    if (this.hasTarget) {
      const dir = new THREE.Vector3(this.target.x - this.pos.x, 0, this.target.z - this.pos.z)
      const dist = dir.length()
      if (dist < 0.5) {
        this.hasTarget = false
        this.idleT = 2 + Math.random() * 4
      } else {
        dir.normalize()
        if (speed === 0) speed = 1.6
        this.heading = dampAngle(this.heading, Math.atan2(dir.x, dir.z), 6, dt)
        this.pos.addScaledVector(dir, speed * dt)
      }
    }
    this.amp += ((speed > 0 ? 1 : 0) - this.amp) * (1 - Math.exp(-8 * dt))
    this.phase += dt * speed * 3.2

    const d = Math.hypot(player.x - this.pos.x, player.z - this.pos.z)
    this.rig.mat.opacity = poolOpacity(d, radius)
    this.group.position.copy(this.pos)
    this.group.rotation.y = this.heading
    this.pose(time)
  }

  private pose(time: number) {
    const r = this.rig
    r.begin()
    const bob = Math.abs(Math.cos(this.phase)) * 0.03 * this.amp
    const sy = 0.35 + bob, hy = 0.33 + bob
    r.seg(0, sy, 0.22, 0, hy, -0.2)              // omurga
    r.seg(0, sy, 0.22, 0, 0.48, 0.38)            // boyun
    r.seg(0, 0.48, 0.38, 0, 0.46, 0.5)           // burun
    r.seg(0.02, 0.5, 0.36, 0.05, 0.58, 0.32)     // kulaklar
    r.seg(-0.02, 0.5, 0.36, -0.05, 0.58, 0.32)
    const sw = Math.sin(time * 2.2) * 0.05
    r.seg(0, hy, -0.2, sw, 0.42, -0.4)           // kuyruk
    r.seg(sw, 0.42, -0.4, sw * 2, 0.3, -0.58)
    // bacaklar: diyagonal tırıs
    const legs: [number, number, number, number][] = [
      [0.06, sy, 0.22, 0], [-0.06, sy, 0.22, Math.PI],
      [0.06, hy, -0.2, Math.PI], [-0.06, hy, -0.2, 0],
    ]
    for (const [lx, ly, lz, ph] of legs) {
      const swing = Math.sin(this.phase + ph) * 0.45 * this.amp
      const ky = ly - 0.17
      const kz = lz + Math.sin(swing) * 0.09
      const fy = Math.max(ky - 0.16, 0)
      const fz = kz + Math.sin(swing) * 0.13
      r.seg(lx, ly, lz, lx, ky, kz)
      r.seg(lx, ky, kz, lx, fy, fz)
    }
    r.end()
  }

  dispose() { this.rig.dispose() }
}

// --- YÖNETİCİ ---
export class Critters {
  private birds: Bird[] = []
  private rabbits: Rabbit[] = []
  private foxes: Fox[] = []

  constructor(private scene: THREE.Scene, private spawnAmbientRabbits = true) {}

  update(dt: number, player: THREE.Vector3, radius: number, perches: THREE.Vector3[], time: number) {
    // popülasyonu doldur
    if (this.birds.length < 12 && perches.length > 0) {
      const p = perches[Math.floor(Math.random() * perches.length)]
      const d = Math.hypot(p.x - player.x, p.z - player.z)
      if (d > 10 && d < 55) this.birds.push(new Bird(this.scene, p))
    }
    if (this.spawnAmbientRabbits && this.rabbits.length < 4) this.spawnGround(this.rabbits, Rabbit, player)
    if (this.foxes.length < 2) this.spawnGround(this.foxes, Fox, player)

    // güncelle + uzaktakileri sil
    for (const list of [this.birds, this.rabbits, this.foxes] as Critter[][]) {
      for (let i = list.length - 1; i >= 0; i--) {
        const c = list[i]
        c.update(dt, player, radius, perches, time)
        if (Math.hypot(c.pos.x - player.x, c.pos.z - player.z) > 75) {
          this.scene.remove(c.group)
          c.dispose()
          list.splice(i, 1)
        }
      }
    }
  }

  // havlama: yakındaki her şey ürker
  bark(pos: THREE.Vector3) {
    for (const b of this.birds) {
      if (Math.hypot(b.pos.x - pos.x, b.pos.z - pos.z) < 28) b.startle()
    }
    for (const r of this.rabbits) {
      if (Math.hypot(r.pos.x - pos.x, r.pos.z - pos.z) < 22) r.scare(pos)
    }
    for (const f of this.foxes) {
      if (Math.hypot(f.pos.x - pos.x, f.pos.z - pos.z) < 25) f.scare(pos)
    }
  }

  private spawnGround<T extends Critter>(list: T[], Ctor: new (s: THREE.Scene, p: THREE.Vector3) => T, player: THREE.Vector3) {
    const a = Math.random() * Math.PI * 2
    const d = 18 + Math.random() * 25
    list.push(new Ctor(this.scene, new THREE.Vector3(player.x + Math.cos(a) * d, 0, player.z + Math.sin(a) * d)))
  }
}
