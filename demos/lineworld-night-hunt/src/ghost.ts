import * as THREE from 'three'
import { loftY, wirePart, gait } from './character'
import { mulberry32 } from './gen'

// hayalet sahip: anıt uyanınca belirir, köpeğe doğru yürür,
// eğilip başını okşar, sonra parçacıklara dağılır.

const damp = (cur: number, target: number, lambda: number, dt: number) =>
  cur + (target - cur) * (1 - Math.exp(-lambda * dt))

function dampAngle(cur: number, target: number, lambda: number, dt: number): number {
  let d = target - cur
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return cur + d * (1 - Math.exp(-lambda * dt))
}

interface Joints {
  pelvis: THREE.Group
  chest: THREE.Group
  neck: THREE.Group
  shL: THREE.Group
  shR: THREE.Group
  elL: THREE.Group
  elR: THREE.Group
  hipL: THREE.Group
  hipR: THREE.Group
  kneeL: THREE.Group
  kneeR: THREE.Group
}

function buildGhost(mat: THREE.LineBasicMaterial): { root: THREE.Group; parts: THREE.LineSegments[]; j: Joints } {
  const rng = mulberry32(11)
  const J = 0.012
  const parts: THREE.LineSegments[] = []
  const add = (geo: THREE.BufferGeometry, parent: THREE.Object3D, x = 0, y = 0, z = 0) => {
    const l = wirePart(geo, mat)
    l.position.set(x, y, z)
    parent.add(l)
    parts.push(l)
    return l
  }

  const root = new THREE.Group()
  const pelvis = new THREE.Group()
  pelvis.position.y = 1.0
  root.add(pelvis)

  // bacaklar (çizim sırası: alttan yukarı)
  const mkLeg = (s: number) => {
    const hip = new THREE.Group()
    hip.position.set(s * 0.1, -0.02, 0)
    pelvis.add(hip)
    add(loftY([
      { y: 0.02, rx: 0.08, rz: 0.09 },
      { y: -0.25, rx: 0.068, rz: 0.072 },
      { y: -0.5, rx: 0.048, rz: 0.05 },
    ], 6, rng, J), hip)
    const knee = new THREE.Group()
    knee.position.y = -0.5
    hip.add(knee)
    add(loftY([
      { y: 0.02, rx: 0.05, rz: 0.05 },
      { y: -0.16, rx: 0.056, rz: 0.058 },
      { y: -0.46, rx: 0.03, rz: 0.032 },
    ], 6, rng, J), knee)
    const fg = new THREE.IcosahedronGeometry(0.06, 0)
    fg.scale(0.72, 0.5, 2.0)
    add(fg, knee, 0, -0.475, 0.045)
    return { hip, knee }
  }
  const legL = mkLeg(-1)
  const legR = mkLeg(1)

  // gövde
  add(loftY([
    { y: 0.0, rx: 0.13, rz: 0.085 },
    { y: 0.08, rx: 0.125, rz: 0.08 },
    { y: 0.2, rx: 0.1, rz: 0.07 },
    { y: 0.32, rx: 0.115, rz: 0.08 },
    { y: 0.42, rx: 0.13, rz: 0.088 },
    { y: 0.5, rx: 0.145, rz: 0.075 },
    { y: 0.55, rx: 0.06, rz: 0.055 },
  ], 8, rng, J), pelvis)

  const chest = new THREE.Group()
  chest.position.set(0, 0.5, 0)
  pelvis.add(chest)

  const mkArm = (s: number) => {
    const shoulder = new THREE.Group()
    shoulder.position.set(s * 0.2, 0, 0)
    chest.add(shoulder)
    add(loftY([
      { y: 0.02, rx: 0.052, rz: 0.052 },
      { y: -0.1, rx: 0.056, rz: 0.055 },
      { y: -0.32, rx: 0.04, rz: 0.04 },
    ], 6, rng, J), shoulder)
    const elbow = new THREE.Group()
    elbow.position.y = -0.32
    shoulder.add(elbow)
    add(loftY([
      { y: 0.02, rx: 0.044, rz: 0.044 },
      { y: -0.14, rx: 0.046, rz: 0.044 },
      { y: -0.34, rx: 0.02, rz: 0.016 },
    ], 6, rng, J), elbow)
    return { shoulder, elbow }
  }
  const armL = mkArm(-1)
  const armR = mkArm(1)

  const neck = new THREE.Group()
  neck.position.set(0, 0.05, 0.01)
  chest.add(neck)
  add(loftY([
    { y: 0.0, rx: 0.045, rz: 0.05 },
    { y: 0.05, rx: 0.058, rz: 0.068, oz: 0.008 },
    { y: 0.11, rx: 0.075, rz: 0.082, oz: 0.005 },
    { y: 0.17, rx: 0.082, rz: 0.088 },
    { y: 0.22, rx: 0.07, rz: 0.075, oz: -0.005 },
    { y: 0.26, rx: 0.035, rz: 0.04, oz: -0.008 },
  ], 8, rng, J * 0.7), neck)

  return {
    root, parts,
    j: {
      pelvis, chest, neck,
      shL: armL.shoulder, shR: armR.shoulder,
      elL: armL.elbow, elR: armR.elbow,
      hipL: legL.hip, hipR: legR.hip,
      kneeL: legL.knee, kneeR: legR.knee,
    },
  }
}

const MEMORY_LINES = [
  '一段记忆：公园里仿佛永远不会结束的午后',
  '一段记忆：那天，球被抛得比以往任何一次都远',
  '一段记忆：大雨落下时，我们一起奔跑回家',
  '一段记忆：主人连续两次说，你是好孩子',
  '一段记忆：湖边那份与你分食的三明治',
  '一段记忆：就连风也认得那声熟悉的口哨',
]

interface ActiveGhost {
  root: THREE.Group
  parts: THREE.LineSegments[]
  totals: number[]
  mat: THREE.LineBasicMaterial
  j: Joints
  t: number
  phase: 'draw' | 'walk' | 'pet' | 'fade'
  walkPhase: number
  heading: number
  pts: THREE.Points | null
  ptsMat: THREE.PointsMaterial | null
  ptsVel: Float32Array | null
}

export class Ghosts {
  private active: ActiveGhost[] = []
  private bag: number[] = []

  constructor(private scene: THREE.Scene, private textEl: HTMLElement) {}

  private pickLine(): string {
    if (this.bag.length === 0) {
      this.bag = MEMORY_LINES.map((_, i) => i)
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]]
      }
    }
    return MEMORY_LINES[this.bag.pop()!]
  }

  spawn(pos: THREE.Vector3, playerPos: THREE.Vector3) {
    const mat = new THREE.LineBasicMaterial({ color: 0xff6a55, transparent: true, opacity: 0.92, fog: false })
    const { root, parts, j } = buildGhost(mat)
    const heading = Math.atan2(playerPos.x - pos.x, playerPos.z - pos.z)
    root.position.set(pos.x, 0, pos.z)
    root.rotation.y = heading
    // kollar doğal sarkık başlar
    j.elL.rotation.x = -0.25
    j.elR.rotation.x = -0.25
    const totals = parts.map((p) => {
      const total = (p.geometry.getAttribute('position') as THREE.BufferAttribute).count
      p.geometry.setDrawRange(0, 0)
      return total
    })
    this.scene.add(root)
    this.active.push({
      root, parts, totals, mat, j, t: 0, phase: 'draw',
      walkPhase: 0, heading, pts: null, ptsMat: null, ptsVel: null,
    })
    this.textEl.textContent = this.pickLine()
    this.textEl.style.opacity = '1'
  }

  update(dt: number, playerPos: THREE.Vector3) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const g = this.active[i]
      g.t += dt
      const dx = playerPos.x - g.root.position.x
      const dz = playerPos.z - g.root.position.z
      const dist = Math.hypot(dx, dz)

      if (g.phase === 'draw') {
        g.parts.forEach((p, pi) => {
          const start = pi * 0.09
          const k = Math.min(Math.max((g.t - start) / 0.45, 0), 1)
          p.geometry.setDrawRange(0, Math.floor((g.totals[pi] * k) / 2) * 2)
        })
        if (g.t > g.parts.length * 0.09 + 0.5) { g.phase = 'walk'; g.t = 0 }
      } else if (g.phase === 'walk') {
        if (dist < 1.15) {
          g.phase = 'pet'
          g.t = 0
        } else if (g.t > 14 || dist > 28) {
          this.startFade(g)
        } else {
          // köpeğe doğru sakin yürüyüş
          g.heading = dampAngle(g.heading, Math.atan2(dx, dz), 5, dt)
          g.root.rotation.y = g.heading
          const nx = dx / dist, nz = dz / dist
          g.root.position.x += nx * 1.35 * dt
          g.root.position.z += nz * 1.35 * dt
          g.walkPhase += dt * 5.9
          const amp = Math.min(g.t * 1.5, 1)
          const p01 = g.walkPhase / (Math.PI * 2)
          const gL = gait(p01, 0.62)
          const gR = gait(p01 + 0.5, 0.62)
          g.j.hipL.rotation.x = -gL.swing * 0.5 * amp
          g.j.kneeL.rotation.x = (gL.lift * 1.0 + gL.load * 0.08) * amp
          g.j.hipR.rotation.x = -gR.swing * 0.5 * amp
          g.j.kneeR.rotation.x = (gR.lift * 1.0 + gR.load * 0.08) * amp
          g.j.pelvis.position.y = 1.0 + Math.abs(Math.sin(g.walkPhase)) * 0.03 * amp
          g.j.chest.rotation.x = 0.07 * amp
          g.j.neck.rotation.x = -0.02 * amp
          g.j.shL.rotation.x = -gR.swing * 0.3 * amp
          g.j.shR.rotation.x = -gL.swing * 0.3 * amp
          g.j.elL.rotation.x = -0.3 - gR.lift * 0.1 * amp
          g.j.elR.rotation.x = -0.3 - gL.lift * 0.1 * amp
        }
      } else if (g.phase === 'pet') {
        if (dist > 3.5) {
          this.startFade(g)
        } else {
          // köpeğe dönük kal, eğil, başını okşa
          g.heading = dampAngle(g.heading, Math.atan2(dx, dz), 6, dt)
          g.root.rotation.y = g.heading
          const stroke = Math.sin(g.t * 4.6) * Math.min(g.t * 2, 1)
          const L = 7
          g.j.pelvis.rotation.x = damp(g.j.pelvis.rotation.x, 0.15, L, dt)
          g.j.pelvis.position.y = damp(g.j.pelvis.position.y, 0.98, L, dt)
          g.j.chest.rotation.x = damp(g.j.chest.rotation.x, 0.28, L, dt)
          g.j.neck.rotation.x = damp(g.j.neck.rotation.x, 0.3, L, dt)
          g.j.shR.rotation.x = damp(g.j.shR.rotation.x, -0.98 + stroke * 0.13, L, dt)
          g.j.elR.rotation.x = damp(g.j.elR.rotation.x, -0.12 + stroke * 0.1, L, dt)
          g.j.shL.rotation.x = damp(g.j.shL.rotation.x, 0.12, L, dt)
          g.j.elL.rotation.x = damp(g.j.elL.rotation.x, -0.3, L, dt)
          g.j.hipL.rotation.x = damp(g.j.hipL.rotation.x, -0.04, L, dt)
          g.j.hipR.rotation.x = damp(g.j.hipR.rotation.x, 0.06, L, dt)
          g.j.kneeL.rotation.x = damp(g.j.kneeL.rotation.x, 0.05, L, dt)
          g.j.kneeR.rotation.x = damp(g.j.kneeR.rotation.x, 0.08, L, dt)
          if (g.t > 3.6) this.startFade(g)
        }
      } else {
        const k = Math.min(g.t / 1.9, 1)
        g.mat.opacity = 0.92 * (1 - k)
        g.root.position.y += dt * 0.25
        if (g.pts && g.ptsMat && g.ptsVel) {
          const attr = g.pts.geometry.getAttribute('position') as THREE.BufferAttribute
          const arr = attr.array as Float32Array
          for (let p = 0; p < arr.length / 3; p++) {
            arr[p * 3] += g.ptsVel[p * 3] * dt
            arr[p * 3 + 1] += g.ptsVel[p * 3 + 1] * dt
            arr[p * 3 + 2] += g.ptsVel[p * 3 + 2] * dt
          }
          attr.needsUpdate = true
          g.ptsMat.opacity = 0.85 * (1 - k)
        }
        if (k >= 1) {
          this.scene.remove(g.root)
          if (g.pts) {
            this.scene.remove(g.pts)
            g.pts.geometry.dispose()
            g.ptsMat!.dispose()
          }
          for (const p of g.parts) p.geometry.dispose()
          g.mat.dispose()
          this.active.splice(i, 1)
        }
      }
    }
  }

  private startFade(g: ActiveGhost) {
    g.phase = 'fade'
    g.t = 0
    this.spawnParticles(g)
    this.textEl.style.opacity = '0'
  }

  private spawnParticles(g: ActiveGhost) {
    const n = 40
    const pos = new Float32Array(n * 3)
    const vel = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * 0.35
      pos[i * 3] = g.root.position.x + Math.cos(a) * r
      pos[i * 3 + 1] = 0.15 + Math.random() * 1.7
      pos[i * 3 + 2] = g.root.position.z + Math.sin(a) * r
      vel[i * 3] = (Math.random() - 0.5) * 0.25
      vel[i * 3 + 1] = 0.3 + Math.random() * 0.55
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.25
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xff6a55, size: 0.05, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    const pts = new THREE.Points(geo, mat)
    pts.frustumCulled = false
    this.scene.add(pts)
    g.pts = pts
    g.ptsMat = mat
    g.ptsVel = vel
  }
}
