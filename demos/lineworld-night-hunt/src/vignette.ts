import * as THREE from 'three'

type Stroke = [number, number][]

function circle(cx: number, cy: number, r: number, n = 10): Stroke {
  const pts: Stroke = []
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
  }
  return pts
}

// top atma yayı: kesikli parabol
function arcDashes(x0: number, y0: number, x1: number, y1: number, peak: number): Stroke[] {
  const out: Stroke[] = []
  const N = 10
  const pts: [number, number][] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const x = x0 + (x1 - x0) * t
    const y = y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * (peak - Math.max(y0, y1))
    pts.push([x, y])
  }
  for (let i = 0; i < N; i += 2) out.push([pts[i], pts[i + 1]])
  return out
}

const bank: Stroke[] = [
  [[-0.85, 0], [0.85, 0]],
  [[-0.85, 0.42], [0.85, 0.42]],
  ...[-0.6, -0.3, 0, 0.3, 0.6].map((x) => [[x, 0.03], [x, 0.39]] as Stroke),
  [[-0.7, -0.02], [-0.7, -0.45]],
  [[0.7, -0.02], [0.7, -0.45]],
]

const salincak: Stroke[] = [
  [[-0.85, -0.55], [-0.5, 0.62]],
  [[-0.15, -0.55], [-0.5, 0.62]],
  [[0.85, -0.55], [0.5, 0.62]],
  [[0.15, -0.55], [0.5, 0.62]],
  [[-0.5, 0.62], [0.5, 0.62]],
  [[-0.16, 0.62], [-0.16, -0.02]],
  [[0.16, 0.62], [0.16, -0.02]],
  [[-0.22, -0.02], [0.22, -0.02]],
]

const topAtan: Stroke[] = [
  circle(-0.55, 0.38, 0.09, 8),
  [[-0.55, 0.29], [-0.55, -0.08]],
  [[-0.55, -0.08], [-0.66, -0.5]],
  [[-0.55, -0.08], [-0.44, -0.5]],
  [[-0.55, 0.22], [-0.33, 0.45]],
  [[-0.55, 0.2], [-0.68, 0.05]],
  ...arcDashes(-0.3, 0.48, 0.62, 0.05, 0.68),
  circle(0.66, 0.02, 0.05, 8),
  // küçük köpek: yayı kovalıyor
  [[0.3, -0.35], [0.55, -0.35]],
  [[0.55, -0.35], [0.63, -0.26]],
  [[0.3, -0.35], [0.21, -0.26]],
  [[0.34, -0.35], [0.34, -0.48]],
  [[0.51, -0.35], [0.51, -0.48]],
]

const ucurtma: Stroke[] = [
  [[0.32, 0.72], [0.52, 0.5]],
  [[0.52, 0.5], [0.32, 0.26]],
  [[0.32, 0.26], [0.12, 0.5]],
  [[0.12, 0.5], [0.32, 0.72]],
  [[0.32, 0.72], [0.32, 0.26]],
  [[0.12, 0.5], [0.52, 0.5]],
  [[0.32, 0.26], [0.22, 0.14], [0.34, 0.04], [0.24, -0.06]],
  [[0.32, 0.26], [0.14, 0.16], [-0.06, 0.06], [-0.24, 0.02], [-0.38, 0.0]],
  circle(-0.44, 0.12, 0.075, 8),
  [[-0.44, 0.04], [-0.44, -0.25]],
  [[-0.44, -0.25], [-0.54, -0.55]],
  [[-0.44, -0.25], [-0.34, -0.55]],
  [[-0.44, 0.0], [-0.38, 0.0]],
]

const kamp: Stroke[] = [
  [[-0.32, -0.42], [0.32, -0.28]],
  [[-0.32, -0.28], [0.32, -0.42]],
  [[-0.12, -0.3], [-0.05, -0.12], [-0.14, 0.02], [-0.04, 0.18]],
  [[0.02, -0.28], [0.1, -0.1], [0.02, 0.06], [0.12, 0.22]],
  [[-0.05, -0.32], [0.0, -0.2], [-0.06, -0.05]],
  circle(-0.6, -0.02, 0.08, 8),
  [[-0.6, -0.1], [-0.68, -0.2], [-0.7, -0.34], [-0.62, -0.44]],
  [[-0.62, -0.44], [-0.45, -0.44]],
  circle(0.6, -0.02, 0.08, 8),
  [[0.6, -0.1], [0.68, -0.2], [0.7, -0.34], [0.62, -0.44]],
  [[0.62, -0.44], [0.45, -0.44]],
]

const kemik: Stroke[] = [
  [[-0.32, 0], [0.32, 0]],
  circle(-0.38, 0.09, 0.09, 8),
  circle(-0.38, -0.09, 0.09, 8),
  circle(0.38, 0.09, 0.09, 8),
  circle(0.38, -0.09, 0.09, 8),
]

const pati: Stroke[] = [
  circle(0, -0.14, 0.17, 10),
  circle(-0.22, 0.14, 0.075, 8),
  circle(0, 0.22, 0.075, 8),
  circle(0.22, 0.14, 0.075, 8),
]

const top: Stroke[] = [
  circle(0, 0, 0.3, 14),
  [[-0.3, 0.0], [-0.12, 0.11], [0.12, 0.11], [0.3, 0.0]],
  [[-0.3, 0.0], [-0.12, -0.11], [0.12, -0.11], [0.3, 0.0]],
]

const kunye: Stroke[] = [
  circle(0, 0, 0.28, 12),
  circle(0, 0.36, 0.08, 8),
  [[-0.13, 0.02], [0.13, 0.02]],
  [[-0.09, -0.08], [0.09, -0.08]],
]

const SCENES: Record<string, Stroke[]> = { bank, salincak, topAtan, ucurtma, kamp, kemik, pati, top, kunye }
const BIG = ['bank', 'salincak', 'topAtan', 'ucurtma', 'kamp']
const SHARD = ['pati', 'top', 'kunye']

interface ActiveVignette {
  group: THREE.Group
  line: THREE.LineSegments
  mat: THREE.LineBasicMaterial
  total: number
  t: number
  phase: 'draw' | 'hold' | 'fade'
}

export class Vignettes {
  private active: ActiveVignette[] = []
  private lastBig = ''

  constructor(private scene: THREE.Scene) {}

  spawn(kind: 'big' | 'shard' | 'kemik', pos: THREE.Vector3, camPos: THREE.Vector3) {
    let name: string
    if (kind === 'big') {
      const opts = BIG.filter((n) => n !== this.lastBig)
      name = opts[Math.floor(Math.random() * opts.length)]
      this.lastBig = name
    } else if (kind === 'kemik') {
      name = 'kemik'
    } else {
      name = SHARD[Math.floor(Math.random() * SHARD.length)]
    }
    const scale = kind === 'big' ? 2.1 : 0.75

    const posArr: number[] = []
    for (const stroke of SCENES[name]) {
      for (let i = 0; i < stroke.length - 1; i++) {
        posArr.push(
          stroke[i][0] * scale, stroke[i][1] * scale, 0,
          stroke[i + 1][0] * scale, stroke[i + 1][1] * scale, 0
        )
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(posArr, 3))
    g.setDrawRange(0, 0)
    // anıt anıları kızıl, kazı parçaları altın, kemik beyaz
    const color = kind === 'kemik' ? 0xffffff : kind === 'big' ? 0xff5a4d : 0xffc06a
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 1, fog: false })
    const line = new THREE.LineSegments(g, mat)
    line.frustumCulled = false
    const group = new THREE.Group()
    group.add(line)
    group.position.copy(pos)
    group.rotation.y = Math.atan2(camPos.x - pos.x, camPos.z - pos.z)
    this.scene.add(group)
    this.active.push({ group, line, mat, total: posArr.length / 3, t: 0, phase: 'draw' })
  }

  update(dt: number) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const v = this.active[i]
      v.t += dt
      if (v.phase === 'draw') {
        const k = Math.min(v.t / 1.1, 1)
        v.line.geometry.setDrawRange(0, Math.floor((v.total * k) / 2) * 2)
        if (k >= 1) { v.phase = 'hold'; v.t = 0 }
      } else if (v.phase === 'hold') {
        if (v.t > 3.2) { v.phase = 'fade'; v.t = 0 }
      } else {
        v.mat.opacity = Math.max(0, 1 - v.t / 1.4)
        v.group.position.y += dt * 0.22
        if (v.t > 1.4) {
          this.scene.remove(v.group)
          v.line.geometry.dispose()
          v.mat.dispose()
          this.active.splice(i, 1)
        }
      }
    }
  }
}
