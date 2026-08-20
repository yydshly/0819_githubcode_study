import * as THREE from 'three'
import { makeGlowTexture } from './fx'
import { mulberry32 } from './gen'
import type { Rng } from './gen'

const clamp = (x: number, a: number, b: number) => Math.min(Math.max(x, a), b)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function dampAngle(cur: number, target: number, lambda: number, dt: number): number {
  let d = target - cur
  while (d > Math.PI) d -= Math.PI * 2
  while (d < -Math.PI) d += Math.PI * 2
  return cur + d * (1 - Math.exp(-lambda * dt))
}

// dikey loft (uzuvlar): pivot üstte, -Y yönüne uzar
export interface RingY { y: number; rx: number; rz: number; ox?: number; oz?: number }
// yatay loft (gövde/kafa/kuyruk): +Z ileri, kesitler omurga boyunca
interface RingZ { z: number; rx: number; ry: number; ox?: number; oy?: number }

function buildLoft(verts: number[], idx: number[], ringStart: number[], radial: number) {
  const rings = ringStart.length
  for (let ri = 0; ri < rings - 1; ri++) {
    for (let i = 0; i < radial; i++) {
      const a = ringStart[ri] + i
      const b = ringStart[ri] + (i + 1) % radial
      const c = ringStart[ri + 1] + i
      const d = ringStart[ri + 1] + (i + 1) % radial
      idx.push(a, c, b, b, c, d)
    }
  }
}

export function loftY(rings: RingY[], radial: number, rng: Rng, jitter = 0): THREE.BufferGeometry {
  const verts: number[] = []
  const idx: number[] = []
  const ringStart: number[] = []
  rings.forEach((r, ri) => {
    ringStart.push(verts.length / 3)
    const endRing = ri === 0 || ri === rings.length - 1
    for (let i = 0; i < radial; i++) {
      const a = (i / radial) * Math.PI * 2
      let x = (r.ox ?? 0) + Math.cos(a) * r.rx
      let z = (r.oz ?? 0) + Math.sin(a) * r.rz
      let y = r.y
      if (jitter > 0 && !endRing) {
        x += (rng() - 0.5) * jitter; y += (rng() - 0.5) * jitter; z += (rng() - 0.5) * jitter
      }
      verts.push(x, y, z)
    }
  })
  buildLoft(verts, idx, ringStart, radial)
  const first = rings[0], last = rings[rings.length - 1]
  const c0 = verts.length / 3
  verts.push(first.ox ?? 0, first.y, first.oz ?? 0)
  for (let i = 0; i < radial; i++) idx.push(c0, ringStart[0] + (i + 1) % radial, ringStart[0] + i)
  const cN = verts.length / 3
  verts.push(last.ox ?? 0, last.y, last.oz ?? 0)
  const ls = ringStart[rings.length - 1]
  for (let i = 0; i < radial; i++) idx.push(cN, ls + i, ls + (i + 1) % radial)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  g.setIndex(idx)
  return g
}

function loftZ(rings: RingZ[], radial: number, rng: Rng, jitter = 0): THREE.BufferGeometry {
  const verts: number[] = []
  const idx: number[] = []
  const ringStart: number[] = []
  rings.forEach((r, ri) => {
    ringStart.push(verts.length / 3)
    const endRing = ri === 0 || ri === rings.length - 1
    for (let i = 0; i < radial; i++) {
      const a = (i / radial) * Math.PI * 2
      let x = (r.ox ?? 0) + Math.cos(a) * r.rx
      let y = (r.oy ?? 0) + Math.sin(a) * r.ry
      let z = r.z
      if (jitter > 0 && !endRing) {
        x += (rng() - 0.5) * jitter; y += (rng() - 0.5) * jitter; z += (rng() - 0.5) * jitter
      }
      verts.push(x, y, z)
    }
  })
  buildLoft(verts, idx, ringStart, radial)
  const first = rings[0], last = rings[rings.length - 1]
  const c0 = verts.length / 3
  verts.push(first.ox ?? 0, first.oy ?? 0, first.z)
  for (let i = 0; i < radial; i++) idx.push(c0, ringStart[0] + i, ringStart[0] + (i + 1) % radial)
  const cN = verts.length / 3
  verts.push(last.ox ?? 0, last.oy ?? 0, last.z)
  const ls = ringStart[rings.length - 1]
  for (let i = 0; i < radial; i++) idx.push(cN, ls + (i + 1) % radial, ls + i)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  g.setIndex(idx)
  return g
}

export function wirePart(geo: THREE.BufferGeometry, mat: THREE.LineBasicMaterial): THREE.LineSegments {
  const wf = new THREE.WireframeGeometry(geo)
  geo.dispose()
  const l = new THREE.LineSegments(wf, mat)
  l.frustumCulled = false
  return l
}

interface Leg {
  root: THREE.Group
  mid: THREE.Group
  end: THREE.Group
  front: boolean
  side: number
  walkOff: number
  gallopOff: number
}

// gerçek gait eğrisi: p (0..1 döngü konumu), duty (yerde kalma oranı)
// stance: ayak yerde, bacak +1'den -1'e sabit hızla geri süpürür, lift yok
// swing: bacak ease ile öne savrulur, lift çanı tepede
export function gait(p: number, duty: number): { swing: number; lift: number; load: number } {
  p = ((p % 1) + 1) % 1
  if (p < duty) {
    const s = p / duty
    return { swing: 1 - 2 * s, lift: 0, load: Math.sin(Math.PI * s) }
  }
  const s = (p - duty) / (1 - duty)
  const e = s * s * (3 - 2 * s)
  return { swing: -1 + 2 * e, lift: Math.sin(Math.PI * s), load: 0 }
}

export class Character {
  group = new THREE.Group()
  heading = 0

  private body = new THREE.Group()
  private neckG = new THREE.Group()
  private headG = new THREE.Group()
  private tail1 = new THREE.Group()
  private tail2 = new THREE.Group()
  private legs: Leg[] = []
  private lantern = new THREE.Group()
  private lanternGlow: THREE.Sprite

  private phase = 0
  private time = 0
  private amp = 0
  private runB = 0
  private vy = 0
  private airborne = false
  private tuck = 0
  private landT = 0
  private pounceT = 0
  private pounceDir = new THREE.Vector3()
  private idleT = 0
  private sit = 0
  private sniffB = 0
  private digB = 0
  private barkT = 0

  constructor(scene: THREE.Scene) {
    const rng = mulberry32(7)
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, fog: false })
    const J = 0.011

    this.body.position.y = 0.38
    this.group.add(this.body)

    // gövde: kuyruk sokumu → göğüs — geniş göğüs kafesi, ince bel
    this.body.add(wirePart(loftZ([
      { z: -0.44, rx: 0.058, ry: 0.072, oy: 0.03 },
      { z: -0.34, rx: 0.092, ry: 0.104, oy: 0.02 },
      { z: -0.18, rx: 0.078, ry: 0.092, oy: 0.03 },
      { z: -0.02, rx: 0.108, ry: 0.132, oy: 0.00 },
      { z: 0.12, rx: 0.122, ry: 0.152, oy: -0.015 },
      { z: 0.24, rx: 0.102, ry: 0.125, oy: 0.00 },
    ], 8, rng, J), mat))

    // boyun: öne-yukarı
    this.neckG.position.set(0, 0.07, 0.25)
    this.neckG.rotation.x = -0.55
    this.body.add(this.neckG)
    this.neckG.add(wirePart(loftZ([
      { z: -0.02, rx: 0.066, ry: 0.082 },
      { z: 0.09, rx: 0.058, ry: 0.068 },
      { z: 0.17, rx: 0.050, ry: 0.056 },
    ], 7, rng, J * 0.8), mat))

    // tasma: alçak poli halka
    const collar = wirePart(new THREE.TorusGeometry(0.08, 0.01, 3, 8), mat)
    collar.position.set(0, -0.005, 0.05)
    this.neckG.add(collar)

    // kafa: kafatası + stop + muzzle
    this.headG.position.set(0, 0.015, 0.19)
    this.headG.rotation.x = 0.5
    this.neckG.add(this.headG)
    this.headG.add(wirePart(loftZ([
      { z: -0.07, rx: 0.058, ry: 0.062 },
      { z: 0.00, rx: 0.068, ry: 0.072 },
      { z: 0.06, rx: 0.058, ry: 0.062, oy: 0.002 },
      { z: 0.10, rx: 0.036, ry: 0.040, oy: -0.014 },
      { z: 0.16, rx: 0.028, ry: 0.030, oy: -0.022 },
      { z: 0.20, rx: 0.017, ry: 0.018, oy: -0.024 },
    ], 8, rng, J * 0.7), mat))
    // kulaklar: dik üçgen piramitler
    for (const s of [-1, 1]) {
      const ear = wirePart(new THREE.ConeGeometry(0.032, 0.095, 4), mat)
      ear.position.set(s * 0.042, 0.09, -0.03)
      ear.rotation.z = -s * 0.22
      ear.rotation.x = -0.15
      this.headG.add(ear)
    }

    // kuyruk: iki parçalı
    this.tail1.position.set(0, 0.07, -0.43)
    this.tail1.rotation.x = 0.55
    this.body.add(this.tail1)
    this.tail1.add(wirePart(loftZ([
      { z: 0.00, rx: 0.028, ry: 0.030 },
      { z: -0.09, rx: 0.026, ry: 0.028 },
      { z: -0.16, rx: 0.022, ry: 0.024 },
    ], 6, rng, J * 0.7), mat))
    this.tail2.position.set(0, 0, -0.16)
    this.tail1.add(this.tail2)
    this.tail2.add(wirePart(loftZ([
      { z: 0.00, rx: 0.020, ry: 0.022 },
      { z: -0.08, rx: 0.016, ry: 0.018 },
      { z: -0.15, rx: 0.008, ry: 0.009 },
    ], 6, rng, J * 0.7), mat))

    // bacaklar
    const mkLeg = (front: boolean, side: number, walkOff: number, gallopOff: number): Leg => {
      const root = new THREE.Group()
      root.position.set(side * (front ? 0.096 : 0.08), front ? 0.04 : 0.05, front ? 0.17 : -0.33)
      this.body.add(root)
      const upperLen = front ? 0.17 : 0.18
      root.add(wirePart(loftY([
        { y: 0.03, rx: front ? 0.042 : 0.054, rz: front ? 0.044 : 0.062 },
        { y: -upperLen * 0.5, rx: front ? 0.034 : 0.040, rz: front ? 0.035 : 0.046 },
        { y: -upperLen, rx: 0.026, rz: 0.027 },
      ], 6, rng, J * 0.7), mat))
      const mid = new THREE.Group()
      mid.position.y = -upperLen
      root.add(mid)
      const lowerLen = 0.16
      mid.add(wirePart(loftY([
        { y: 0.015, rx: 0.024, rz: 0.025 },
        { y: -lowerLen * 0.55, rx: 0.020, rz: 0.021 },
        { y: -lowerLen, rx: 0.015, rz: 0.016 },
      ], 6, rng, J * 0.6), mat))
      const end = new THREE.Group()
      end.position.y = -lowerLen
      mid.add(end)
      const pastLen = front ? 0.08 : 0.10
      end.add(wirePart(loftY([
        { y: 0.01, rx: 0.014, rz: 0.015 },
        { y: -pastLen, rx: 0.013, rz: 0.014 },
      ], 5, rng, J * 0.5), mat))
      const pawGeo = new THREE.IcosahedronGeometry(0.032, 0)
      pawGeo.scale(0.9, 0.55, 1.5)
      const paw = wirePart(pawGeo, mat)
      paw.position.set(0, -pastLen, 0.02)
      end.add(paw)
      return { root, mid, end, front, side, walkOff, gallopOff }
    }
    // walk: 4 vuruşlu lateral dizi, ayak düşüşleri çeyrek döngü arayla:
    //   ArkaSol(0.0) → ÖnSol(0.25) → ArkaSağ(0.5) → ÖnSağ(0.75)
    // gallop (transvers): arka çift önden iter (0, 0.12), süspansiyon, ön çift kademeli (0.5, 0.62)
    this.legs.push(
      mkLeg(true, -1, 0.25, 0.5),   // ÖnL
      mkLeg(true, 1, 0.75, 0.62),   // ÖnR
      mkLeg(false, -1, 0.0, 0.12),  // ArkaL
      mkLeg(false, 1, 0.5, 0.0),    // ArkaR
    )

    // fener: tasmadan göğüs önüne sarkar
    this.lantern.position.set(0, -0.06, 0.29)
    this.body.add(this.lantern)
    const rope = new Float32Array([0, 0.1, -0.03, 0, 0.02, 0])
    const rg = new THREE.BufferGeometry()
    rg.setAttribute('position', new THREE.BufferAttribute(rope, 3))
    this.lantern.add(new THREE.LineSegments(rg, mat))
    const cage = wirePart(new THREE.OctahedronGeometry(0.075, 0), mat)
    cage.position.set(0, -0.05, 0)
    this.lantern.add(cage)
    const sm = new THREE.SpriteMaterial({
      map: makeGlowTexture(), color: 0xffffff,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
      opacity: 0.85, fog: false,
    })
    this.lanternGlow = new THREE.Sprite(sm)
    this.lanternGlow.position.set(0, -0.05, 0)
    this.lantern.add(this.lanternGlow)

    scene.add(this.group)
  }

  bark() {
    if (this.barkT <= 0) this.barkT = 0.32
  }

  get isPouncing() {
    return this.pounceT > 0
  }

  update(
    dt: number,
    moveDir: THREE.Vector3,
    running: boolean,
    energy: number,
    jump: boolean,
    sniffing: boolean,
    digging: boolean,
    pounce = false
  ) {
    this.time += dt
    this.barkT = Math.max(0, this.barkT - dt)
    this.sniffB += ((sniffing && !digging ? 1 : 0) - this.sniffB) * (1 - Math.exp(-8 * dt))
    this.digB += ((digging ? 1 : 0) - this.digB) * (1 - Math.exp(-10 * dt))

    if (pounce && !this.airborne && this.sit < 0.3 && !digging) {
      this.pounceT = 0.62
      this.pounceDir.set(Math.sin(this.heading), 0, Math.cos(this.heading)).normalize()
      this.vy = 3.45
      this.airborne = true
    }
    this.pounceT = Math.max(0, this.pounceT - dt)

    const moving = moveDir.lengthSq() > 0 && !digging && this.pounceT <= 0
    const speed = moving ? (sniffing ? 0.9 : running ? 6.0 : 1.7) : 0

    if (moving || this.airborne || jump || sniffing || digging || this.barkT > 0) this.idleT = 0
    else this.idleT += dt
    const sitTarget = this.idleT > 3 ? 1 : 0
    this.sit += (sitTarget - this.sit) * (1 - Math.exp(-(sitTarget ? 3.5 : 9) * dt))

    if (moving) {
      const target = Math.atan2(moveDir.x, moveDir.z)
      this.heading = dampAngle(this.heading, target, 8, dt)
      this.group.position.x += moveDir.x * speed * dt
      this.group.position.z += moveDir.z * speed * dt
      this.phase += dt * speed * lerp(7.0, 1.5, this.runB)
    }
    if (this.pounceT > 0) {
      const pounceSpeed = 7.4 * Math.min(1, this.pounceT / 0.16)
      this.group.position.addScaledVector(this.pounceDir, pounceSpeed * dt)
      this.phase += dt * 10
    }
    this.group.rotation.y = this.heading

    // zıplama
    if (jump && !this.airborne && this.sit < 0.3 && !digging && this.pounceT <= 0) {
      this.vy = 4.6
      this.airborne = true
    }
    if (this.airborne) {
      this.vy -= 11 * dt
      this.group.position.y += this.vy * dt
      if (this.group.position.y <= 0) {
        this.group.position.y = 0
        this.airborne = false
        this.landT = 0.22
      }
      this.tuck += (1 - this.tuck) * (1 - Math.exp(-8 * dt))
    } else {
      this.tuck += (0 - this.tuck) * (1 - Math.exp(-10 * dt))
      this.landT = Math.max(0, this.landT - dt)
    }

    const ampTarget = moving ? Math.min(speed / 1.7, 1.3) : 0
    this.amp += (ampTarget - this.amp) * (1 - Math.exp(-8 * dt))
    const runTarget = moving && running && !sniffing ? 1 : 0
    this.runB += (runTarget - this.runB) * (1 - Math.exp(-6 * dt))

    this.pose(energy)
  }

  private pose(energy: number) {
    const ph = this.phase
    const t = this.time
    const amp = this.amp
    const runB = this.runB
    const tuck = this.tuck
    const sit = this.sit
    const breathe = Math.sin(t * 2.1) * (0.005 + 0.004 * sit)

    // gövde: walk bob (2/döngü ufak) ↔ gallop bob (1/döngü büyük + süspansiyon)
    const walkBob = Math.abs(Math.sin(ph)) * 0.018
    const gallopBob = Math.sin(ph) * 0.05 + Math.sin(ph + 0.5) * 0.02
    const bob = lerp(walkBob, gallopBob, runB) * amp
    const landDip = this.landT > 0 ? Math.sin((this.landT / 0.22) * Math.PI) * 0.05 : 0
    this.body.position.y = 0.38 + bob - landDip + breathe - 0.17 * sit
    const gallopPitch = Math.cos(ph) * 0.08 * runB * amp
    const jumpPitch = this.airborne ? clamp(-this.vy * 0.06, -0.32, 0.38) : 0
    this.body.rotation.x = gallopPitch + lerp(0, jumpPitch, tuck) - 0.52 * sit
    this.body.rotation.z = Math.sin(ph) * 0.02 * amp * (1 - runB)

    // bacaklar: walk ↔ gallop karışımı, üstüne zıplama tuck'ı ve oturma pozu
    const p01 = ph / (Math.PI * 2)
    for (const leg of this.legs) {
      const w = gait(p01 + leg.walkOff, 0.62)
      const g = gait(p01 + leg.gallopOff, 0.38)
      const A = leg.front ? lerp(0.5, 0.72, runB) : lerp(0.52, 0.85, runB)
      const swing = lerp(w.swing, g.swing, runB) * A * amp
      const lift = lerp(w.lift, g.lift * 1.3, runB) * amp
      const load = lerp(w.load, g.load, runB) * amp
      let r: number, m: number, e: number
      if (leg.front) {
        r = 0.5 - swing
        m = -0.45 + lift * 0.75 + load * 0.06
        e = -0.05 - lift * 0.5 - load * 0.05
      } else {
        r = -0.5 - swing
        m = 1.0 + lift * 0.55 + load * 0.08
        e = -0.55 - lift * 0.35 - load * 0.06
      }
      // zıplama tuck pozu
      const tr = leg.front ? -0.9 : 0.25
      const tm = leg.front ? 1.3 : 1.45
      const te = leg.front ? -0.4 : -1.1
      // oturma pozu: ön bacaklar dik kolon, arkalar tamamen katlı
      const sr = leg.front ? 0.95 : -1.05
      const sm2 = leg.front ? -0.42 : 2.1
      const se = leg.front ? -0.12 : -1.25
      let rx = lerp(r, tr, tuck)
      let mx = lerp(m, tm, tuck)
      let ex = lerp(e, te, tuck)
      rx = lerp(rx, sr, sit)
      mx = lerp(mx, sm2, sit)
      ex = lerp(ex, se, sit)
      // kazı: ön patiler dönüşümlü eşeler, arkalar çömelir
      if (this.digB > 0.01) {
        if (leg.front) {
          const scrape = Math.sin(t * 15 + (leg.side < 0 ? 0 : Math.PI)) * 0.55
          rx = lerp(rx, -0.55 + scrape, this.digB)
          mx = lerp(mx, 0.55 + scrape * 0.5, this.digB)
          ex = lerp(ex, -0.35, this.digB)
        } else {
          rx = lerp(rx, -0.72, this.digB)
          mx = lerp(mx, 1.45, this.digB)
          ex = lerp(ex, -0.75, this.digB)
        }
      }
      leg.root.rotation.x = rx
      leg.mid.rotation.x = mx
      leg.end.rotation.x = ex
    }

    // gövdeye koklama/kazı eğimi
    this.body.rotation.x += 0.06 * this.sniffB + 0.3 * this.digB
    this.body.position.y -= 0.03 * this.sniffB + 0.07 * this.digB

    // boyun/kafa: koşarken öne uzanır + gallop'ta pompalanır; otururken dikleşip etrafı süzer
    // koklarken burun yere iner, havlarken kafa geriye atılır
    const scan = clamp(Math.sin(t * 0.45) * 1.6, -1, 1) // uçlarda bekleyen tarama
    const barkThrow = this.barkT > 0 ? Math.sin(Math.PI * (1 - this.barkT / 0.32)) : 0
    this.neckG.rotation.x = -0.55 + amp * 0.12 - Math.cos(ph) * 0.06 * runB * amp
      + lerp(0, -0.18, sit) + lerp(0, -0.15, tuck)
      + 0.88 * this.sniffB - 0.45 * barkThrow + 0.35 * this.digB
    this.neckG.rotation.y = scan * 0.55 * sit + Math.sin(t * 1.4) * 0.22 * this.sniffB
    this.headG.rotation.x = 0.5 - amp * 0.1 + Math.sin(t * 2.3) * 0.03 * (1 - amp) * (1 - sit)
      - 0.25 * this.sniffB + Math.sin(t * 9) * 0.04 * this.sniffB
    this.headG.rotation.y = clamp(Math.sin(t * 0.45 - 0.4) * 1.6, -1, 1) * 0.25 * sit
    this.headG.rotation.z = Math.sin(t * 0.7) * 0.05 * (1 - amp) * (1 - sit)

    // kuyruk: boşta wag, koşarken süzülür, otururken yerde tembel wag
    const wagSpeed = lerp(7, 4, sit)
    const wag = Math.sin(t * wagSpeed) * (0.4 * (1 - amp) + 0.1)
    this.tail1.rotation.y = wag
    this.tail1.rotation.x = lerp(0.55, 0.15, Math.min(amp, 1)) + lerp(0, -0.75, sit) + lerp(0, -0.3, tuck)
    this.tail2.rotation.y = Math.sin(t * wagSpeed - 0.9) * (0.35 * (1 - amp) + 0.1)

    // fener sarkacı: gövde pitch'ine karşı şakül kalmaya çalışır
    this.lantern.rotation.x = Math.sin(ph) * 0.14 * amp + Math.sin(t * 1.6) * 0.05
      + lerp(0, 0.25, tuck) + 0.52 * sit - gallopPitch
    this.lantern.rotation.z = Math.cos(t * 1.3) * 0.05 + Math.sin(ph) * 0.06 * amp

    const flicker = (Math.sin(t * 13) + Math.sin(t * 7.3)) * 0.03
    this.lanternGlow.scale.setScalar(1.0 + energy * 0.009 + flicker)
    ;(this.lanternGlow.material as THREE.SpriteMaterial).opacity = 0.55 + energy * 0.003
  }
}
