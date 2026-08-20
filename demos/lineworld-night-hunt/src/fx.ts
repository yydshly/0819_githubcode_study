import * as THREE from 'three'

let glowTex: THREE.CanvasTexture | null = null

export function makeGlowTexture(): THREE.CanvasTexture {
  if (glowTex) return glowTex
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,.45)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  glowTex = new THREE.CanvasTexture(c)
  return glowTex
}

export function makeStars(): THREE.Points {
  const n = 420
  const pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2
    const y = 0.15 + Math.random() * 0.85
    const rh = Math.sqrt(1 - y * y)
    pos[i * 3] = Math.cos(t) * rh * 260
    pos[i * 3 + 1] = y * 260
    pos[i * 3 + 2] = Math.sin(t) * rh * 260
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const m = new THREE.PointsMaterial({
    color: 0xffffff, size: 1.6, sizeAttenuation: false,
    transparent: true, opacity: 0.5, fog: false, depthWrite: false,
  })
  const p = new THREE.Points(g, m)
  p.frustumCulled = false
  return p
}

// havlama: yerde genişleyen çizgi halkaları
export class BarkRings {
  private rings: { line: THREE.LineLoop; mat: THREE.LineBasicMaterial; t: number; active: boolean }[] = []

  constructor(private scene: THREE.Scene) {
    const pts: number[] = []
    const n = 56
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      pts.push(Math.cos(a), 0, Math.sin(a))
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    for (let i = 0; i < 4; i++) {
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, fog: false })
      const line = new THREE.LineLoop(geo, mat)
      line.visible = false
      line.frustumCulled = false
      scene.add(line)
      this.rings.push({ line, mat, t: 0, active: false })
    }
  }

  spawn(pos: THREE.Vector3) {
    let delay = 0
    for (const r of this.rings) {
      if (r.active) continue
      r.active = true
      r.t = -delay
      r.line.position.set(pos.x, 0.06, pos.z)
      r.line.visible = true
      delay += 0.14
      if (delay > 0.15) break
    }
  }

  update(dt: number) {
    for (const r of this.rings) {
      if (!r.active) continue
      r.t += dt
      if (r.t < 0) continue
      const rad = 3 + r.t * 36
      r.line.scale.set(rad, 1, rad)
      r.mat.opacity = 0.5 * Math.max(0, 1 - r.t / 1.25)
      if (r.t > 1.25) { r.active = false; r.line.visible = false }
    }
  }
}

// kazı toprağı: geriye savrulan minik parçacıklar
export class Dirt {
  private n = 64
  private pos: Float32Array
  private vel: Float32Array
  private life: Float32Array
  private attr: THREE.BufferAttribute

  constructor(scene: THREE.Scene) {
    this.pos = new Float32Array(this.n * 3).fill(-999)
    this.vel = new Float32Array(this.n * 3)
    this.life = new Float32Array(this.n)
    const g = new THREE.BufferGeometry()
    this.attr = new THREE.BufferAttribute(this.pos, 3)
    g.setAttribute('position', this.attr)
    const m = new THREE.PointsMaterial({
      map: makeGlowTexture(), color: 0xffffff, size: 0.07,
      transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const points = new THREE.Points(g, m)
    points.frustumCulled = false
    scene.add(points)
  }

  spawn(origin: THREE.Vector3, back: THREE.Vector3) {
    let spawned = 0
    for (let i = 0; i < this.n && spawned < 5; i++) {
      if (this.life[i] > 0) continue
      this.life[i] = 0.45 + Math.random() * 0.25
      this.pos[i * 3] = origin.x + (Math.random() - 0.5) * 0.15
      this.pos[i * 3 + 1] = 0.12
      this.pos[i * 3 + 2] = origin.z + (Math.random() - 0.5) * 0.15
      const side = (Math.random() - 0.5) * 0.8
      this.vel[i * 3] = back.x * (1.2 + Math.random()) - back.z * side
      this.vel[i * 3 + 1] = 1.2 + Math.random() * 1.4
      this.vel[i * 3 + 2] = back.z * (1.2 + Math.random()) + back.x * side
      spawned++
    }
  }

  update(dt: number) {
    for (let i = 0; i < this.n; i++) {
      if (this.life[i] <= 0) continue
      this.life[i] -= dt
      this.vel[i * 3 + 1] -= 7.5 * dt
      this.pos[i * 3] += this.vel[i * 3] * dt
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt
      if (this.life[i] <= 0 || this.pos[i * 3 + 1] < 0) {
        this.life[i] = 0
        this.pos[i * 3 + 1] = -999
      }
    }
    this.attr.needsUpdate = true
  }
}

export function makeFireflies() {
  const n = 36
  const BOX = 46
  const base = new Float32Array(n * 3)
  const phases = new Float32Array(n * 3)
  const pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    base[i * 3] = (Math.random() - 0.5) * BOX
    base[i * 3 + 1] = 0.4 + Math.random() * 1.8
    base[i * 3 + 2] = (Math.random() - 0.5) * BOX
    phases[i * 3] = Math.random() * Math.PI * 2
    phases[i * 3 + 1] = Math.random() * Math.PI * 2
    phases[i * 3 + 2] = Math.random() * Math.PI * 2
  }
  const g = new THREE.BufferGeometry()
  const attr = new THREE.BufferAttribute(pos, 3)
  g.setAttribute('position', attr)
  const m = new THREE.PointsMaterial({
    map: makeGlowTexture(), color: 0xffffff, size: 0.16,
    transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const points = new THREE.Points(g, m)
  points.frustumCulled = false
  function update(time: number, center: THREE.Vector3) {
    const half = BOX / 2
    for (let i = 0; i < n; i++) {
      let bx = base[i * 3], bz = base[i * 3 + 2]
      if (bx < center.x - half) { bx += BOX; base[i * 3] = bx }
      else if (bx > center.x + half) { bx -= BOX; base[i * 3] = bx }
      if (bz < center.z - half) { bz += BOX; base[i * 3 + 2] = bz }
      else if (bz > center.z + half) { bz -= BOX; base[i * 3 + 2] = bz }
      pos[i * 3] = bx + Math.sin(time * 0.5 + phases[i * 3]) * 2.2
      pos[i * 3 + 1] = base[i * 3 + 1] + Math.sin(time * 0.7 + phases[i * 3 + 1]) * 0.5
      pos[i * 3 + 2] = bz + Math.cos(time * 0.4 + phases[i * 3 + 2]) * 2.2
    }
    m.size = 0.14 + 0.05 * (1 + Math.sin(time * 3)) * 0.5
    attr.needsUpdate = true
  }
  return { points, update }
}

export function makeDust() {
  const n = 220
  const BOX = 36
  const pos = new Float32Array(n * 3)
  const vel = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * BOX
    pos[i * 3 + 1] = Math.random() * 6
    pos[i * 3 + 2] = (Math.random() - 0.5) * BOX
    vel[i * 3] = (Math.random() - 0.5) * 0.2
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.08
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.2
  }
  const g = new THREE.BufferGeometry()
  const attr = new THREE.BufferAttribute(pos, 3)
  g.setAttribute('position', attr)
  const m = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.045, transparent: true, opacity: 0.4,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  const points = new THREE.Points(g, m)
  points.frustumCulled = false
  function update(dt: number, center: THREE.Vector3) {
    const half = BOX / 2
    for (let i = 0; i < n; i++) {
      let x = pos[i * 3] + vel[i * 3] * dt
      let y = pos[i * 3 + 1] + vel[i * 3 + 1] * dt
      let z = pos[i * 3 + 2] + vel[i * 3 + 2] * dt
      if (x < center.x - half) x += BOX; else if (x > center.x + half) x -= BOX
      if (z < center.z - half) z += BOX; else if (z > center.z + half) z -= BOX
      if (y < 0) y += 6.5; else if (y > 6.5) y -= 6.5
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z
    }
    attr.needsUpdate = true
  }
  return { points, update }
}
