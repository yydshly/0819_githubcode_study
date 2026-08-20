import * as THREE from 'three'
import {
  mulberry32, hashSeed, deciduousTree, rock, bush, stoneCircle, pond,
  stumpWithAxe, fallenLog, deadTree, mushrooms, woodpile, fence, signpost, cabin,
} from './gen'
import type { Rng, GenResult } from './gen'
import { buildGrassChunk, getGrassMaterial } from './grass'
import { makeGlowTexture } from './fx'
import { getScentMaterial, buildScentGeometry, buildMarkerGeometry } from './scent'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js'
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'

const CHUNK = 26
const VIEW = 3
const WORLD_SEED = 1337

type RevealState = 'hidden' | 'drawing' | 'shown' | 'fading'

interface RevealObj {
  line: THREE.LineSegments | LineSegments2
  mat: THREE.LineBasicMaterial | LineMaterial
  total: number // vertex sayısı
  thick: boolean
  state: RevealState
  t: number
  wx: number
  wz: number
  baseOpacity: number
  drawDur: number
  flashUntil: number
  speedMul: number
}

interface Spark {
  group: THREE.Group
  mat: THREE.SpriteMaterial
  wx: number
  wz: number
  baseY: number
  phase: number
  key: string
  collected: boolean
}

export interface BuriedSpot {
  wx: number
  wz: number
  key: string
  dug: boolean
  trail: THREE.Points
  marker: THREE.LineSegments
  markerMat: THREE.LineBasicMaterial
}

interface Monument {
  wx: number
  wz: number
  key: string
  obj: RevealObj
  beacon: THREE.Sprite
  beaconMat: THREE.SpriteMaterial
}

interface Chunk {
  group: THREE.Group
  reveals: RevealObj[]
  sparks: Spark[]
  geos: THREE.BufferGeometry[]
  perches: THREE.Vector3[]
  buried: BuriedSpot[]
  monuments: Monument[]
}

export interface WorldEvents {
  sparks: number
}

export class World {
  private chunks = new Map<string, Chunk>()
  private collected = new Set<string>()
  private dugSet = new Set<string>()
  private doneMonuments = new Set<string>()
  private perchCache: THREE.Vector3[] = []
  private perchesDirty = true
  private tint = new THREE.Color(0xffffff)
  private tintTarget = new THREE.Color(0xffffff)
  private thickMats = new Set<LineMaterial>()
  private resX = window.innerWidth
  private resY = window.innerHeight

  setResolution(w: number, h: number) {
    this.resX = w
    this.resY = h
    for (const m of this.thickMats) m.resolution.set(w, h)
  }

  // draw-in ilerlemesi: ince çizgide drawRange, kalın (Line2) çizgide instanceCount
  private setRevealProgress(r: RevealObj, k: number) {
    if (r.thick) {
      ;(r.line.geometry as LineSegmentsGeometry).instanceCount = Math.floor((r.total / 2) * k)
    } else {
      r.line.geometry.setDrawRange(0, Math.floor((r.total * k) / 2) * 2)
    }
  }

  setTint(c: THREE.Color) {
    this.tintTarget.copy(c)
  }

  getTint(): THREE.Color {
    return this.tint
  }

  constructor(private scene: THREE.Scene) {}

  allPerches(): THREE.Vector3[] {
    if (this.perchesDirty) {
      this.perchCache = []
      for (const c of this.chunks.values()) this.perchCache.push(...c.perches)
      this.perchesDirty = false
    }
    return this.perchCache
  }

  // havlama: menzildeki her şey bir anlığına çizilir; yakındaki anıtlar uyanır
  bark(pos: THREE.Vector3, time: number): THREE.Vector3[] {
    const awakened: THREE.Vector3[] = []
    for (const chunk of this.chunks.values()) {
      for (const r of chunk.reveals) {
        const d = Math.hypot(r.wx - pos.x, r.wz - pos.z)
        if (d > 50) continue
        r.flashUntil = time + 2.6
        if (r.state === 'hidden') {
          r.state = 'drawing'
          r.t = 0
          r.speedMul = 3
        } else if (r.state === 'fading') {
          r.state = 'shown'
        }
      }
      for (let i = chunk.monuments.length - 1; i >= 0; i--) {
        const m = chunk.monuments[i]
        if (Math.hypot(m.wx - pos.x, m.wz - pos.z) < 12 && m.obj.state !== 'hidden') {
          this.doneMonuments.add(m.key)
          m.obj.mat.color.copy(this.tint)
          m.beacon.removeFromParent()
          m.beaconMat.dispose()
          awakened.push(new THREE.Vector3(m.wx, 0, m.wz))
          chunk.monuments.splice(i, 1)
        }
      }
    }
    return awakened
  }

  findDigSpot(pos: THREE.Vector3): BuriedSpot | null {
    for (const chunk of this.chunks.values()) {
      for (const b of chunk.buried) {
        if (!b.dug && Math.hypot(b.wx - pos.x, b.wz - pos.z) < 1.4) return b
      }
    }
    return null
  }

  completeDig(spot: BuriedSpot): 'kemik' | 'shard' {
    spot.dug = true
    this.dugSet.add(spot.key)
    spot.trail.removeFromParent()
    spot.marker.removeFromParent()
    spot.trail.geometry.dispose()
    spot.marker.geometry.dispose()
    spot.markerMat.dispose()
    return hashSeed(Math.round(spot.wx * 10), Math.round(spot.wz * 10), 5) % 100 < 55 ? 'kemik' : 'shard'
  }

  update(dt: number, player: THREE.Vector3, radius: number, time: number, sniff: number): WorldEvents {
    const pcx = Math.round(player.x / CHUNK)
    const pcz = Math.round(player.z / CHUNK)

    for (let dz = -VIEW; dz <= VIEW; dz++) {
      for (let dx = -VIEW; dx <= VIEW; dx++) {
        const key = `${pcx + dx},${pcz + dz}`
        if (!this.chunks.has(key)) {
          this.chunks.set(key, this.makeChunk(pcx + dx, pcz + dz))
          this.perchesDirty = true
        }
      }
    }
    for (const [key, chunk] of this.chunks) {
      const [cx, cz] = key.split(',').map(Number)
      if (Math.abs(cx - pcx) > VIEW + 1 || Math.abs(cz - pcz) > VIEW + 1) {
        this.disposeChunk(chunk)
        this.chunks.delete(key)
        this.perchesDirty = true
      }
    }

    const events: WorldEvents = { sparks: 0 }

    // dünya rengi yeni hedefe yumuşakça kayar (anıt nabzı bunu her karede ezer, sorun değil)
    const dr = Math.abs(this.tint.r - this.tintTarget.r)
      + Math.abs(this.tint.g - this.tintTarget.g)
      + Math.abs(this.tint.b - this.tintTarget.b)
    if (dr > 0.002) {
      this.tint.lerp(this.tintTarget, 1 - Math.exp(-1.2 * dt))
      for (const chunk of this.chunks.values()) {
        for (const r of chunk.reveals) r.mat.color.copy(this.tint)
      }
    }

    for (const chunk of this.chunks.values()) {
      for (const r of chunk.reveals) {
        const d = Math.hypot(r.wx - player.x, r.wz - player.z)
        switch (r.state) {
          case 'hidden':
            if (d < radius) { r.state = 'drawing'; r.t = 0 }
            break
          case 'drawing': {
            r.t += dt / (r.drawDur / r.speedMul)
            this.setRevealProgress(r, Math.min(r.t, 1))
            if (r.t >= 1) { r.state = 'shown'; r.speedMul = 1 }
            break
          }
          case 'shown':
            if (r.mat.opacity < r.baseOpacity) {
              r.mat.opacity = Math.min(r.baseOpacity, r.mat.opacity + dt * r.baseOpacity)
            }
            if (d > radius + 8 && time > r.flashUntil) { r.state = 'fading'; r.t = 1 }
            break
          case 'fading':
            r.t -= dt / 1.8
            r.mat.opacity = r.baseOpacity * Math.max(r.t, 0)
            if (d < radius || time < r.flashUntil) {
              r.state = 'shown'
            } else if (r.t <= 0) {
              r.state = 'hidden'
              this.setRevealProgress(r, 0)
              r.mat.opacity = r.baseOpacity
            }
            break
        }
      }

      for (const s of chunk.sparks) {
        if (s.collected) continue
        s.group.position.y = s.baseY + Math.sin(time * 1.2 + s.phase) * 0.15
        s.mat.opacity = 0.55 + 0.35 * Math.sin(time * 3 + s.phase)
        const d = Math.hypot(s.wx - player.x, s.wz - player.z)
        if (d < 1.7) {
          s.collected = true
          this.collected.add(s.key)
          s.group.visible = false
          events.sparks++
        }
      }

      for (const b of chunk.buried) {
        if (!b.dug) b.markerMat.opacity = 0.08 + sniff * 0.62
      }

      // uyandırılmamış anıtlar kızıl tonuyla nefes alır; işaret ışığı uzaktan nabız atar
      for (const m of chunk.monuments) {
        const pulse = 0.5 + 0.5 * Math.sin(time * 2.2)
        const d = Math.hypot(m.wx - player.x, m.wz - player.z)
        m.beaconMat.opacity = (0.14 + 0.3 * pulse) * Math.min(1, Math.max(0.35, 1.3 - d / 80))
        if (m.obj.state === 'hidden') continue
        const tint = pulse * 0.9
        m.obj.mat.color.setRGB(1, 1 - 0.72 * tint, 1 - 0.78 * tint)
      }
    }
    return events
  }

  private makeChunk(cx: number, cz: number): Chunk {
    const rng = mulberry32(hashSeed(cx, cz, WORLD_SEED))
    const group = new THREE.Group()
    group.position.set(cx * CHUNK, 0, cz * CHUNK)
    const chunk: Chunk = { group, reveals: [], sparks: [], geos: [], perches: [], buried: [], monuments: [] }

    const addReveal = (gen: GenResult, x: number, z: number, baseOpacity: number, rotY = 0, thick = false): RevealObj => {
      let line: THREE.LineSegments | LineSegments2
      let mat: THREE.LineBasicMaterial | LineMaterial
      let g: THREE.BufferGeometry
      if (thick) {
        const lg = new LineSegmentsGeometry()
        lg.setPositions(Array.from(gen.arr))
        lg.instanceCount = 0
        const lm = new LineMaterial({
          color: this.tint.getHex(), linewidth: 2, worldUnits: false,
          transparent: true, opacity: baseOpacity,
        })
        lm.resolution.set(this.resX, this.resY)
        this.thickMats.add(lm)
        line = new LineSegments2(lg, lm)
        mat = lm
        g = lg
      } else {
        g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(gen.arr, 3))
        g.setDrawRange(0, 0)
        mat = new THREE.LineBasicMaterial({ color: this.tint.clone(), transparent: true, opacity: baseOpacity })
        line = new THREE.LineSegments(g, mat)
      }
      line.position.set(x, 0, z)
      line.rotation.y = rotY
      group.add(line)
      const total = gen.arr.length / 3
      const obj: RevealObj = {
        line, mat, total, thick, state: 'hidden', t: 0,
        wx: cx * CHUNK + x, wz: cz * CHUNK + z,
        baseOpacity,
        drawDur: Math.min(Math.max(total / 1400, 0.5), 2.0),
        flashUntil: 0,
        speedMul: 1,
      }
      chunk.reveals.push(obj)
      chunk.geos.push(g)
      if (gen.perch) {
        const p = gen.perch.clone()
        if (rotY !== 0) p.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY)
        chunk.perches.push(p.add(new THREE.Vector3(cx * CHUNK + x, 0, cz * CHUNK + z)))
      }
      return obj
    }

    // nadir set piece = anıt
    let setPiece = false
    if (rng() < 0.18) {
      setPiece = true
      const which = rng()
      const gen = which < 0.25 ? deciduousTree(rng, 3.8 + rng() * 0.8)
        : which < 0.5 ? stoneCircle(rng)
        : which < 0.75 ? pond(rng)
        : cabin(rng)
      const x = (rng() - 0.5) * CHUNK * 0.4
      const z = (rng() - 0.5) * CHUNK * 0.4
      const obj = addReveal(gen, x, z, 1, rng() * Math.PI * 2)
      const mKey = `m${cx},${cz}`
      if (!this.doneMonuments.has(mKey)) {
        // karanlıkta uzaktan görünen kızıl işaret ışığı
        const beaconMat = new THREE.SpriteMaterial({
          map: makeGlowTexture(), color: 0xff4a3a,
          blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
          opacity: 0.3, fog: false,
        })
        const beacon = new THREE.Sprite(beaconMat)
        beacon.scale.setScalar(1.6)
        beacon.position.set(x, 2.4, z)
        group.add(beacon)
        chunk.monuments.push({ wx: obj.wx, wz: obj.wz, key: mKey, obj, beacon, beaconMat })
      }
    }

    // ağaçlar
    const clearing = !setPiece && rng() < 0.12
    // yerleşim: ağaçlar birbirinin içine girmesin (deneme-red)
    const placed: { x: number; z: number; r: number }[] = []
    if (setPiece) placed.push({ x: 0, z: 0, r: 4 })
    const tryPlace = (r: number): { x: number; z: number } | null => {
      for (let a = 0; a < 8; a++) {
        const x = (rng() - 0.5) * CHUNK * 0.84
        const z = (rng() - 0.5) * CHUNK * 0.84
        let ok = true
        for (const p of placed) {
          const need = r + p.r
          if ((x - p.x) ** 2 + (z - p.z) ** 2 < need * need) { ok = false; break }
        }
        if (ok) { placed.push({ x, z, r }); return { x, z } }
      }
      return null
    }
    // %10 kuru, %40 dev yapraklı (yüksek orman), %50 normal yapraklı
    const n = clearing ? 0 : setPiece ? 2 : 3 + Math.floor(rng() * 4)
    for (let i = 0; i < n; i++) {
      const roll = rng()
      const spacing = roll < 0.1 ? 1.2 : roll < 0.5 ? 2.8 : 1.7
      const spot = tryPlace(spacing)
      if (!spot) continue
      const gen = roll < 0.1 ? deadTree(rng)
        : roll < 0.5 ? deciduousTree(rng, 2.2 + rng() * 0.9)
        : deciduousTree(rng, 0.8 + rng() * 0.7)
      addReveal(gen, spot.x, spot.z, 0.85)
    }

    // çalılar + kayalar
    const nBush = clearing ? 1 : 1 + Math.floor(rng() * 3)
    for (let i = 0; i < nBush; i++) {
      addReveal(bush(rng, 0.8 + rng() * 0.8), (rng() - 0.5) * CHUNK * 0.9, (rng() - 0.5) * CHUNK * 0.9, 0.65)
    }
    if (rng() < 0.4) {
      addReveal(rock(rng, 0.8 + rng()), (rng() - 0.5) * CHUNK * 0.8, (rng() - 0.5) * CHUNK * 0.8, 0.6)
    }

    // orman propları: kütük+balta, devrik kütük, odun istifi, çit, tabela, mantarlar
    const propRoll = rng()
    const px = () => (rng() - 0.5) * CHUNK * 0.85
    if (propRoll < 0.1) addReveal(stumpWithAxe(rng), px(), px(), 0.8, rng() * Math.PI * 2)
    else if (propRoll < 0.2) addReveal(fallenLog(rng), px(), px(), 0.75, rng() * Math.PI * 2)
    else if (propRoll < 0.28) addReveal(woodpile(rng), px(), px(), 0.75, rng() * Math.PI * 2)
    else if (propRoll < 0.36) addReveal(fence(rng), px(), px(), 0.7, rng() * Math.PI * 2)
    else if (propRoll < 0.41) addReveal(signpost(rng), px(), px(), 0.8, rng() * Math.PI * 2)
    if (rng() < 0.3) {
      addReveal(mushrooms(rng), px(), px(), 0.6, rng() * Math.PI * 2)
    }

    // çim
    const grassGeo = buildGrassChunk(rng, CHUNK, clearing ? 48 : 36)
    const grass = new THREE.LineSegments(grassGeo, getGrassMaterial())
    group.add(grass)
    chunk.geos.push(grassGeo)

    // gömülü koku hedefi + izi
    if (rng() < 0.5) {
      const dKey = `d${cx},${cz}`
      const sx = (rng() - 0.5) * CHUNK * 0.8
      const sz = (rng() - 0.5) * CHUNK * 0.8
      if (!this.dugSet.has(dKey)) {
        const ang = rng() * Math.PI * 2
        const dist = 10 + rng() * 10
        const start = new THREE.Vector3(sx + Math.cos(ang) * dist, 0, sz + Math.sin(ang) * dist)
        const end = new THREE.Vector3(sx, 0, sz)
        const pts: THREE.Vector3[] = [start]
        for (let i = 1; i <= 3; i++) {
          const t = i / 4
          const p = start.clone().lerp(end, t)
          p.x += (rng() - 0.5) * 5
          p.z += (rng() - 0.5) * 5
          pts.push(p)
        }
        pts.push(end)
        const curvePts = new THREE.CatmullRomCurve3(pts).getPoints(64)
        const trailGeo = buildScentGeometry(curvePts)
        const trail = new THREE.Points(trailGeo, getScentMaterial())
        trail.frustumCulled = false
        group.add(trail)
        const markerGeo = buildMarkerGeometry()
        const markerMat = new THREE.LineBasicMaterial({ color: 0xff7038, transparent: true, opacity: 0.08, fog: false })
        const marker = new THREE.LineSegments(markerGeo, markerMat)
        marker.position.set(sx, 0, sz)
        group.add(marker)
        chunk.geos.push(trailGeo, markerGeo)
        chunk.buried.push({
          wx: cx * CHUNK + sx, wz: cz * CHUNK + sz,
          key: dKey, dug: false, trail, marker, markerMat,
        })
      }
    }

    // kıvılcımlar
    const sparkCount = (rng() < 0.55 ? 1 : 0) + (setPiece ? 2 : 0) + (clearing ? 1 : 0)
    for (let i = 0; i < sparkCount; i++) {
      const key = `${cx},${cz},${i}`
      if (this.collected.has(key)) continue
      this.addSpark(chunk, cx, cz, rng, key)
    }

    this.scene.add(group)
    return chunk
  }

  private addSpark(chunk: Chunk, cx: number, cz: number, rng: Rng, key: string) {
    const x = (rng() - 0.5) * CHUNK * 0.85
    const z = (rng() - 0.5) * CHUNK * 0.85
    const baseY = 0.9 + rng() * 0.8
    const sg = new THREE.Group()
    const mat = new THREE.SpriteMaterial({
      map: makeGlowTexture(), color: 0xffffff,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
      opacity: 0.9, fog: false,
    })
    const sprite = new THREE.Sprite(mat)
    sprite.scale.setScalar(0.55)
    sg.add(sprite)
    const cross = new Float32Array([
      -0.06, 0, 0, 0.06, 0, 0,
      0, -0.06, 0, 0, 0.06, 0,
      0, 0, -0.06, 0, 0, 0.06,
    ])
    const cg = new THREE.BufferGeometry()
    cg.setAttribute('position', new THREE.BufferAttribute(cross, 3))
    const cl = new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: 0xffffff, fog: false }))
    sg.add(cl)
    sg.position.set(x, baseY, z)
    chunk.group.add(sg)
    chunk.geos.push(cg)
    chunk.sparks.push({
      group: sg, mat,
      wx: cx * CHUNK + x, wz: cz * CHUNK + z,
      baseY, phase: rng() * Math.PI * 2, key, collected: false,
    })
  }

  private disposeChunk(chunk: Chunk) {
    this.scene.remove(chunk.group)
    for (const g of chunk.geos) g.dispose()
    for (const r of chunk.reveals) {
      if (r.mat instanceof LineMaterial) this.thickMats.delete(r.mat)
      r.mat.dispose()
    }
    for (const s of chunk.sparks) s.mat.dispose()
    for (const b of chunk.buried) b.markerMat.dispose()
    for (const m of chunk.monuments) m.beaconMat.dispose()
  }
}
