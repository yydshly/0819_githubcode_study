import * as THREE from 'three'

export type Rng = () => number

export interface GenResult {
  arr: Float32Array
  perch: THREE.Vector3 | null
}

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashSeed(x: number, z: number, salt = 0): number {
  let h = 1779033703 ^ salt
  h = Math.imul(h ^ x, 3432918353)
  h = (h << 13) | (h >>> 19)
  h = Math.imul(h ^ z, 461845907)
  return h >>> 0
}

type Seg = [THREE.Vector3, THREE.Vector3]

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

const byMidY = (s1: Seg, s2: Seg) => (s1[0].y + s1[1].y) - (s2[0].y + s2[1].y)

function flat(segs: Seg[]): Float32Array {
  const arr = new Float32Array(segs.length * 6)
  segs.forEach(([a, b], i) => {
    arr[i * 6] = a.x; arr[i * 6 + 1] = a.y; arr[i * 6 + 2] = a.z
    arr[i * 6 + 3] = b.x; arr[i * 6 + 4] = b.y; arr[i * 6 + 5] = b.z
  })
  return arr
}

function randInSphere(rng: Rng, r: number): THREE.Vector3 {
  return v(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize().multiplyScalar(r * (0.4 + 0.6 * rng()))
}

// icosa edge'leri, paylaşılan vertex'ler tutarlı jitter alsın diye pozisyon-key'li offset map
function blobEdges(r: number, rng: Rng, jitter: number, detail = 1): Seg[] {
  const geo = new THREE.IcosahedronGeometry(r, detail)
  const edges = new THREE.EdgesGeometry(geo)
  const pos = edges.getAttribute('position') as THREE.BufferAttribute
  const offsets = new Map<string, THREE.Vector3>()
  const off = (x: number, y: number, z: number) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`
    let o = offsets.get(k)
    if (!o) {
      o = v(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(jitter * r)
      offsets.set(k, o)
    }
    return o
  }
  const segs: Seg[] = []
  for (let i = 0; i < pos.count; i += 2) {
    const ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i)
    const bx = pos.getX(i + 1), by = pos.getY(i + 1), bz = pos.getZ(i + 1)
    segs.push([v(ax, ay, az).add(off(ax, ay, az)), v(bx, by, bz).add(off(bx, by, bz))])
  }
  geo.dispose()
  edges.dispose()
  return segs
}

export function deciduousTree(rng: Rng, scale = 1): GenResult {
  const segs: Seg[] = []
  const h = (2.6 + rng() * 1.6) * scale
  const lean = v((rng() - 0.5) * 0.5, 0, (rng() - 0.5) * 0.5)
  const midC = v(lean.x * h * 0.12 + (rng() - 0.5) * 0.2, h * 0.5, lean.z * h * 0.12 + (rng() - 0.5) * 0.2)
  const topC = v(lean.x * h * 0.3, h, lean.z * h * 0.3)

  // gövde: 3 kırıklı çizgi
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + rng()
    const o = v(Math.cos(a) * 0.06 * scale, 0, Math.sin(a) * 0.06 * scale)
    const p0 = o.clone()
    const p1 = midC.clone().add(o.clone().multiplyScalar(0.6)).add(v((rng() - 0.5) * 0.12, 0, (rng() - 0.5) * 0.12))
    const p2 = topC.clone().add(o.clone().multiplyScalar(0.25))
    segs.push([p0, p1], [p1, p2])
  }

  // dallar + ikincil dalcıklar
  const nB = 3 + Math.floor(rng() * 3)
  const tips: THREE.Vector3[] = []
  for (let i = 0; i < nB; i++) {
    const ang = (i / nB) * Math.PI * 2 + rng() * 1.2
    const from = rng() < 0.3 ? midC.clone().lerp(topC, 0.5 + rng() * 0.5) : topC.clone()
    const tip = from.clone().add(v(
      Math.cos(ang) * (0.6 + rng() * 1.0) * scale,
      (0.15 + rng() * 0.7) * scale,
      Math.sin(ang) * (0.6 + rng() * 1.0) * scale
    ))
    segs.push([from, tip])
    const nT = 1 + Math.floor(rng() * 2)
    for (let t = 0; t < nT; t++) {
      const tw = tip.clone().add(v((rng() - 0.5) * 0.6 * scale, rng() * 0.4 * scale, (rng() - 0.5) * 0.6 * scale))
      segs.push([tip.clone(), tw])
    }
    tips.push(tip)
  }

  // taç: ana kubbe + uç bloblar + iç karalama kirişleri
  const blobSegs: Seg[] = []
  const crownR = (1.1 + rng() * 0.5) * scale
  const crownC = topC.clone().add(v(0, crownR * 0.45, 0))
  const crownDetail = crownR > 1.35 ? 2 : 1
  for (const [a, b] of blobEdges(crownR, rng, 0.22, crownDetail)) {
    blobSegs.push([a.add(crownC), b.add(crownC)])
  }
  const nCh = 10 + Math.floor(rng() * 8)
  for (let i = 0; i < nCh; i++) {
    blobSegs.push([randInSphere(rng, crownR * 0.9).add(crownC), randInSphere(rng, crownR * 0.9).add(crownC)])
  }
  for (const c of tips) {
    const r = (0.5 + rng() * 0.6) * scale
    for (const [a, b] of blobEdges(r, rng, 0.28, r > 0.85 ? 1 : 0)) {
      blobSegs.push([a.add(c), b.add(c)])
    }
  }
  blobSegs.sort(byMidY)
  segs.push(...blobSegs)

  return { arr: flat(segs), perch: crownC.clone().add(v(0, crownR * 1.02, 0)) }
}

export function pineTree(rng: Rng, scale = 1): GenResult {
  const segs: Seg[] = []
  const h = (4.5 + rng() * 2.5) * scale
  // gövde: 2 kırıklı çizgi
  for (const s of [-1, 1]) {
    const o = 0.04 * scale * s
    const m = v(o + (rng() - 0.5) * 0.15, h * 0.55, (rng() - 0.5) * 0.15)
    segs.push([v(o, 0, 0), m], [m, v(o * 0.4, h, 0)])
  }
  const tiers = 6 + Math.floor(rng() * 4)
  for (let t = 0; t < tiers; t++) {
    const f = t / tiers
    const y = h * (0.22 + 0.78 * f)
    const r = (1.9 * (1 - f) + 0.18) * scale
    const n = 10 + Math.floor(rng() * 7)
    const tips: THREE.Vector3[] = []
    for (let i = 0; i < n; i++) {
      const ang = (i / n) * Math.PI * 2 + rng() * 0.25
      const droop = 0.5 + rng() * 0.4
      const tip = v(Math.cos(ang) * r, y - r * droop, Math.sin(ang) * r)
      const mid = v(Math.cos(ang) * r * 0.55, y - r * droop * 0.3, Math.sin(ang) * r * 0.55)
      segs.push([v(0, y, 0), mid], [mid, tip])
      tips.push(tip)
    }
    // etek halkası: iğne uçlarını birbirine bağla
    for (let i = 0; i < n; i++) segs.push([tips[i].clone(), tips[(i + 1) % n].clone()])
  }
  return { arr: flat(segs), perch: v(0, h + 0.1, 0) }
}

export function bush(rng: Rng, scale = 1): GenResult {
  const segs: Seg[] = []
  const nBl = 1 + Math.floor(rng() * 2)
  for (let i = 0; i < nBl; i++) {
    const c = v((rng() - 0.5) * 0.5 * scale, (0.25 + rng() * 0.15) * scale, (rng() - 0.5) * 0.5 * scale)
    const r = (0.35 + rng() * 0.35) * scale
    for (const s of blobEdges(r, rng, 0.3, r > 0.5 ? 1 : 0)) {
      s[0].y *= 0.75; s[1].y *= 0.75
      segs.push([s[0].add(c), s[1].add(c)])
    }
  }
  segs.sort(byMidY)
  return { arr: flat(segs), perch: null }
}

export function rock(rng: Rng, scale = 1): GenResult {
  const segs = blobEdges((0.4 + rng() * 0.5) * scale, rng, 0.35, 0)
  for (const s of segs) { s[0].y *= 0.6; s[1].y *= 0.6 }
  segs.sort(byMidY)
  return { arr: flat(segs), perch: null }
}

export function stoneCircle(rng: Rng): GenResult {
  const segs: Seg[] = []
  const n = 5 + Math.floor(rng() * 3)
  const R = 2.5 + rng() * 1.5
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rng() * 0.3
    const c = v(Math.cos(a) * R, 0, Math.sin(a) * R)
    for (const s of blobEdges(0.5 + rng() * 0.6, rng, 0.35, 0)) {
      s[0].y *= 0.9; s[1].y *= 0.9
      segs.push([s[0].add(c), s[1].add(c)])
    }
  }
  return { arr: flat(segs), perch: null }
}

export function pond(rng: Rng): GenResult {
  const segs: Seg[] = []
  const rings = 4 + Math.floor(rng() * 3)
  const sx = 1 + rng() * 0.5
  const sz = 1 + rng() * 0.5
  for (let ri = 0; ri < rings; ri++) {
    const r = 1 + ri * (0.8 + rng() * 0.3)
    const n = 20 + ri * 6
    let prev: THREE.Vector3 | null = null
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2
      const jr = r * (1 + (rng() - 0.5) * 0.06)
      const p = v(Math.cos(a) * jr * sx, 0.02, Math.sin(a) * jr * sz)
      if (prev) segs.push([prev, p])
      prev = p
    }
  }
  return { arr: flat(segs), perch: null }
}

// --- proplar ---

function circleYSegs(cx: number, cy: number, cz: number, r: number, n: number): Seg[] {
  const segs: Seg[] = []
  let prev: THREE.Vector3 | null = null
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const p = v(cx + Math.cos(a) * r, cy, cz + Math.sin(a) * r)
    if (prev) segs.push([prev, p])
    prev = p
  }
  return segs
}

export function stumpWithAxe(rng: Rng): GenResult {
  const segs: Seg[] = []
  const h = 0.35 + rng() * 0.15
  const r = 0.22 + rng() * 0.1
  segs.push(...circleYSegs(0, 0.02, 0, r, 10))
  segs.push(...circleYSegs(0, h, 0, r * 0.96, 10))
  const nB = 9
  for (let i = 0; i < nB; i++) {
    const a = (i / nB) * Math.PI * 2 + rng() * 0.2
    segs.push([
      v(Math.cos(a) * r, 0.02, Math.sin(a) * r),
      v(Math.cos(a) * r * 0.96 + (rng() - 0.5) * 0.03, h, Math.sin(a) * r * 0.96 + (rng() - 0.5) * 0.03),
    ])
  }
  // yaş halkaları + çatlak
  segs.push(...circleYSegs(0.02, h + 0.005, 0.01, r * 0.62, 9))
  segs.push(...circleYSegs(0.03, h + 0.005, -0.01, r * 0.38, 8))
  segs.push(...circleYSegs(0.01, h + 0.005, 0.02, r * 0.16, 6))
  segs.push([v(-r * 0.9, h + 0.005, 0.05), v(r * 0.4, h + 0.005, -0.08)])
  // balta: ağzı kütüğe saplı, sapı havada
  const hx = r * 0.45
  const tip = v(hx, h - 0.03, 0)
  const heel = v(hx + 0.16, h + 0.12, 0)
  const bTop = v(hx + 0.05, h + 0.2, 0)
  const grip = v(hx + 0.62, h + 0.68, 0.04)
  for (const o of [-0.012, 0.012]) {
    segs.push([v(heel.x, heel.y, heel.z + o), v(grip.x, grip.y, grip.z + o)])
  }
  segs.push([v(grip.x, grip.y, grip.z - 0.012), v(grip.x, grip.y, grip.z + 0.012)])
  segs.push([tip.clone(), bTop.clone()], [bTop.clone(), heel.clone()], [heel.clone(), tip.clone()])
  segs.push([v(tip.x, tip.y, tip.z + 0.02), v(bTop.x, bTop.y, bTop.z + 0.02)])
  return { arr: flat(segs), perch: null }
}

export function fallenLog(rng: Rng): GenResult {
  const segs: Seg[] = []
  const len = 2 + rng() * 1.5
  const r0 = 0.16 + rng() * 0.05
  const nS = 4
  const nR = 8
  const bend = (rng() - 0.5) * 0.4
  const rings: THREE.Vector3[][] = []
  for (let s = 0; s <= nS; s++) {
    const t = s / nS
    const x = -len / 2 + t * len
    const r = r0 * (1 - 0.25 * t)
    const zc = bend * t * t
    const ring: THREE.Vector3[] = []
    for (let i = 0; i < nR; i++) {
      const a = (i / nR) * Math.PI * 2
      ring.push(v(
        x + (rng() - 0.5) * 0.02,
        r0 + Math.cos(a) * r,
        zc + Math.sin(a) * r + (rng() - 0.5) * 0.02
      ))
    }
    rings.push(ring)
    for (let i = 0; i < nR; i++) segs.push([ring[i].clone(), ring[(i + 1) % nR].clone()])
  }
  for (let s = 0; s < nS; s++) {
    for (let i = 0; i < nR; i++) segs.push([rings[s][i].clone(), rings[s + 1][i].clone()])
  }
  // uç kapak ışınları
  for (let i = 0; i < nR; i += 2) {
    segs.push([rings[0][i].clone(), rings[0][(i + nR / 2) % nR].clone()])
  }
  return { arr: flat(segs), perch: null }
}

export function deadTree(rng: Rng): GenResult {
  const segs: Seg[] = []
  const h = 3 + rng() * 2
  const topC = v((rng() - 0.5) * 0.6, h, (rng() - 0.5) * 0.6)
  const midC = v(topC.x * 0.4 + (rng() - 0.5) * 0.2, h * 0.55, topC.z * 0.4)
  for (const s of [-1, 1]) {
    const o = 0.045 * s
    const m = midC.clone().add(v(o * 0.7, 0, 0))
    segs.push([v(o, 0, 0), m], [m.clone(), topC.clone()])
  }
  const trunkAt = (t: number) =>
    t < 0.55 ? v(0, 0, 0).lerp(midC, t / 0.55) : midC.clone().lerp(topC, (t - 0.55) / 0.45)
  const nB = 5 + Math.floor(rng() * 3)
  for (let i = 0; i < nB; i++) {
    const t = 0.35 + (i / nB) * 0.55 + rng() * 0.05
    const from = trunkAt(t)
    const ang = rng() * Math.PI * 2
    const blen = (0.5 + rng() * 0.8) * (1.2 - t * 0.6)
    const tip = from.clone().add(v(Math.cos(ang) * blen, blen * (0.3 + rng() * 0.5), Math.sin(ang) * blen))
    segs.push([from, tip])
    const nt = 1 + Math.floor(rng() * 2)
    for (let k = 0; k < nt; k++) {
      const bp = from.clone().lerp(tip, 0.5 + rng() * 0.4)
      segs.push([bp, bp.clone().add(v((rng() - 0.5) * 0.5, 0.15 + rng() * 0.3, (rng() - 0.5) * 0.5))])
    }
  }
  segs.sort(byMidY)
  return { arr: flat(segs), perch: topC.clone().add(v(0, 0.05, 0)) }
}

export function mushrooms(rng: Rng): GenResult {
  const segs: Seg[] = []
  const n = 3 + Math.floor(rng() * 4)
  for (let i = 0; i < n; i++) {
    const cx = (rng() - 0.5) * 1.1
    const cz = (rng() - 0.5) * 1.1
    const sh = 0.08 + rng() * 0.14
    const cr = 0.05 + rng() * 0.09
    for (const o of [-0.012, 0.012]) segs.push([v(cx + o, 0, cz), v(cx + o * 0.6, sh, cz)])
    segs.push(...circleYSegs(cx, sh, cz, cr, 7))
    const apex = v(cx, sh + cr * 0.55, cz)
    for (const a0 of [0, Math.PI / 2]) {
      const p1 = v(cx + Math.cos(a0) * cr, sh, cz + Math.sin(a0) * cr)
      const p2 = v(cx - Math.cos(a0) * cr, sh, cz - Math.sin(a0) * cr)
      segs.push([p1, apex.clone()], [apex.clone(), p2])
    }
  }
  segs.sort(byMidY)
  return { arr: flat(segs), perch: null }
}

export function woodpile(rng: Rng): GenResult {
  const segs: Seg[] = []
  const r = 0.1 + rng() * 0.03
  const len = 0.8 + rng() * 0.3
  const rows = [4, 3, 2]
  rows.forEach((count, row) => {
    for (let i = 0; i < count; i++) {
      const y = r + row * r * 1.72
      const z = (i - (count - 1) / 2) * r * 2.05
      for (const ex of [-len / 2, len / 2]) {
        let prev: THREE.Vector3 | null = null
        for (let k = 0; k <= 6; k++) {
          const a = (k / 6) * Math.PI * 2
          const p = v(ex, y + Math.cos(a) * r, z + Math.sin(a) * r)
          if (prev) segs.push([prev, p])
          prev = p
        }
      }
      for (const a of [0.5, 2.6, 4.4]) {
        segs.push([
          v(-len / 2, y + Math.cos(a) * r, z + Math.sin(a) * r),
          v(len / 2, y + Math.cos(a) * r, z + Math.sin(a) * r),
        ])
      }
    }
  })
  return { arr: flat(segs), perch: null }
}

export function fence(rng: Rng): GenResult {
  const segs: Seg[] = []
  const nP = 3 + Math.floor(rng() * 2)
  const sp = 1.1
  const x0 = -((nP - 1) * sp) / 2
  const posts: number[] = []
  for (let i = 0; i < nP; i++) {
    const x = x0 + i * sp + (rng() - 0.5) * 0.1
    posts.push(x)
    const lean = (rng() - 0.5) * 0.1
    const ph = 0.9 + (rng() - 0.5) * 0.1
    for (const o of [-0.03, 0.03]) segs.push([v(x + o, 0, 0), v(x + o + lean, ph, 0)])
    segs.push([v(x - 0.03 + lean, ph, 0), v(x + 0.03 + lean, ph, 0)])
  }
  const broken = Math.floor(rng() * (nP - 1))
  for (let i = 0; i < nP - 1; i++) {
    for (const ry of [0.42, 0.7]) {
      if (i === broken && ry === 0.7) {
        segs.push([v(posts[i], ry, 0.02), v(posts[i] + sp * 0.6, 0.05, 0.1)])
      } else {
        const mid = v((posts[i] + posts[i + 1]) / 2, ry - 0.04, 0.01)
        segs.push([v(posts[i], ry, 0), mid], [mid.clone(), v(posts[i + 1], ry, 0)])
      }
    }
  }
  return { arr: flat(segs), perch: null }
}

export function signpost(rng: Rng): GenResult {
  const segs: Seg[] = []
  const lean = (rng() - 0.5) * 0.25
  for (const o of [-0.025, 0.025]) segs.push([v(o, 0, 0), v(lean + o, 1.6, 0)])
  const dir = rng() < 0.5 ? 1 : -1
  const y1 = 1.32
  const hgt = 0.16
  const w = 0.55
  const sx = lean * 0.85
  const pts = [
    v(sx - w * 0.5 * dir, y1, 0), v(sx + w * 0.4 * dir, y1, 0), v(sx + w * 0.55 * dir, y1 + hgt / 2, 0),
    v(sx + w * 0.4 * dir, y1 + hgt, 0), v(sx - w * 0.5 * dir, y1 + hgt, 0), v(sx - w * 0.5 * dir, y1, 0),
  ]
  for (let i = 0; i < pts.length - 1; i++) segs.push([pts[i], pts[i + 1]])
  segs.push([v(sx - w * 0.3 * dir, y1 + hgt / 2, 0.01), v(sx + w * 0.25 * dir, y1 + hgt / 2, 0.01)])
  return { arr: flat(segs), perch: v(lean, 1.65, 0) }
}

export function cabin(rng: Rng): GenResult {
  const segs: Seg[] = []
  const w = 1.5 + rng() * 0.3
  const d = 1.2 + rng() * 0.2
  const wallH = 1.7
  const ridgeH = 2.55
  const j = () => (rng() - 0.5) * 0.03
  // kütük duvarlar: yatay sıralar (alttan üste — draw-in inşaat gibi görünür)
  const rows = Math.floor(wallH / 0.22)
  for (let i = 0; i <= rows; i++) {
    const y = 0.08 + i * 0.22
    for (const zz of [d, -d]) segs.push([v(-w + j(), y + j(), zz), v(w + j(), y + j(), zz)])
    for (const xx of [w, -w]) segs.push([v(xx, y + j(), -d + j()), v(xx, y + j(), d + j())])
  }
  // köşeler + kütük ucu halkaları
  for (const xx of [w, -w]) {
    for (const zz of [d, -d]) {
      segs.push([v(xx, 0, zz), v(xx, wallH, zz)])
      for (let i = 0; i < 3; i++) {
        const y = 0.2 + i * 0.44
        let prev: THREE.Vector3 | null = null
        for (let k = 0; k <= 6; k++) {
          const a = (k / 6) * Math.PI * 2
          const p = v(xx + Math.cos(a) * 0.07, y + Math.sin(a) * 0.07, zz)
          if (prev) segs.push([prev, p])
          prev = p
        }
      }
    }
  }
  // kapı + pencere (ön yüz)
  const dx = -w * 0.35
  segs.push(
    [v(dx - 0.3, 0, d + 0.01), v(dx - 0.3, 1.25, d + 0.01)],
    [v(dx - 0.3, 1.25, d + 0.01), v(dx + 0.3, 1.25, d + 0.01)],
    [v(dx + 0.3, 1.25, d + 0.01), v(dx + 0.3, 0, d + 0.01)],
  )
  const wx = w * 0.4, wy = 0.85, ws = 0.28
  segs.push(
    [v(wx - ws, wy - ws, d + 0.01), v(wx + ws, wy - ws, d + 0.01)],
    [v(wx + ws, wy - ws, d + 0.01), v(wx + ws, wy + ws, d + 0.01)],
    [v(wx + ws, wy + ws, d + 0.01), v(wx - ws, wy + ws, d + 0.01)],
    [v(wx - ws, wy + ws, d + 0.01), v(wx - ws, wy - ws, d + 0.01)],
    [v(wx - ws, wy, d + 0.012), v(wx + ws, wy, d + 0.012)],
    [v(wx, wy - ws, d + 0.012), v(wx, wy + ws, d + 0.012)],
  )
  // alınlar + çatı
  for (const zz of [d, -d]) {
    segs.push([v(-w, wallH, zz), v(0, ridgeH, zz)], [v(0, ridgeH, zz), v(w, wallH, zz)])
  }
  segs.push([v(0, ridgeH, -d - 0.15), v(0, ridgeH, d + 0.15)])
  for (const s of [-1, 1]) {
    segs.push([v(s * (w + 0.18), wallH - 0.08, -d - 0.15), v(s * (w + 0.18), wallH - 0.08, d + 0.15)])
    for (let i = 0; i <= 5; i++) {
      const zz = -d - 0.15 + (i / 5) * (2 * d + 0.3)
      segs.push([v(0, ridgeH, zz), v(s * (w + 0.18), wallH - 0.08, zz)])
    }
  }
  // baca
  const cx2 = w * 0.5, cz2 = -d * 0.3, cw = 0.14
  const corners: [number, number][] = [[-cw, -cw], [cw, -cw], [cw, cw], [-cw, cw]]
  for (let i = 0; i < 4; i++) {
    const [ox, oz] = corners[i]
    const [ox2, oz2] = corners[(i + 1) % 4]
    segs.push([v(cx2 + ox, 2.0, cz2 + oz), v(cx2 + ox, 2.85, cz2 + oz)])
    segs.push([v(cx2 + ox, 2.85, cz2 + oz), v(cx2 + ox2, 2.85, cz2 + oz2)])
  }
  return { arr: flat(segs), perch: v(cx2, 2.9, cz2) }
}
