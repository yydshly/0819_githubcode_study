import * as THREE from 'three'

const uniforms = {
  uTime: { value: 0 },
  uSniff: { value: 0 },
  uPlayer: { value: new THREE.Vector3() },
}

export function updateScentUniforms(time: number, sniff: number, player: THREE.Vector3) {
  uniforms.uTime.value = time
  uniforms.uSniff.value = sniff
  uniforms.uPlayer.value.copy(player)
}

let mat: THREE.ShaderMaterial | null = null

// neon turkuaz koku partikülleri: kafa hizasında süzülür, kaynağa doğru nabız akar,
// oyuncuya yakınken büyük ve parlak, uzakta söner
export function getScentMaterial(): THREE.ShaderMaterial {
  if (mat) return mat
  mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      attribute float aT;
      attribute float aSeed;
      uniform float uTime, uSniff;
      uniform vec3 uPlayer;
      varying float vA;
      void main() {
        vec3 p = position;
        p.y += sin(uTime * 1.4 + aSeed * 6.2831) * 0.1;
        p.x += sin(uTime * 0.9 + aSeed * 12.0) * 0.08;
        p.z += cos(uTime * 1.1 + aSeed * 9.0) * 0.08;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        float d = distance(wp.xz, uPlayer.xz);
        float prox = 1.0 - smoothstep(5.0, 28.0, d);
        float w = fract(aT * 3.0 - uTime * 0.45);
        float pulse = smoothstep(0.55, 1.0, w);
        vA = uSniff * prox * (0.22 + 0.78 * pulse);
        vec4 mv = viewMatrix * wp;
        float size = (5.0 + 14.0 * prox + 8.0 * pulse) * (160.0 / max(1.0, -mv.z));
        gl_PointSize = min(size, 42.0);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vA;
      void main() {
        float r = length(gl_PointCoord - vec2(0.5));
        float m = smoothstep(0.5, 0.12, r);
        gl_FragColor = vec4(vec3(1.0, 0.42, 0.18), vA * m);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return mat
}

// zemin eğrisinden kafa hizasında süzülen partikül dizisi;
// son %18'de burun hizasından yere iner (kazı noktasını gösterir)
export function buildScentGeometry(groundPts: THREE.Vector3[]): THREE.BufferGeometry {
  const pos: number[] = []
  const ts: number[] = []
  const seeds: number[] = []
  const n = groundPts.length
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const drop = Math.max(0, (t - 0.82) / 0.18)
    const baseY = 0.55 - 0.42 * drop
    for (let k = 0; k < 2; k++) {
      // deterministik sözde-rastgele saçılım
      const h = ((i * 7919 + k * 104729) % 997) / 997
      const h2 = ((i * 6271 + k * 31337) % 991) / 991
      pos.push(
        groundPts[i].x + (h - 0.5) * 0.3,
        baseY + (h2 - 0.5) * 0.16,
        groundPts[i].z + (h2 - 0.5) * 0.3
      )
      ts.push(t)
      seeds.push(h)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1))
  g.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1))
  return g
}

// kazı noktası işareti: kesikli halka + çarpı
export function buildMarkerGeometry(): THREE.BufferGeometry {
  const pos: number[] = []
  const R = 0.38
  const n = 16
  for (let i = 0; i < n; i++) {
    if (i % 2 === 1) continue
    const a1 = (i / n) * Math.PI * 2
    const a2 = ((i + 1) / n) * Math.PI * 2
    pos.push(Math.cos(a1) * R, 0.03, Math.sin(a1) * R, Math.cos(a2) * R, 0.03, Math.sin(a2) * R)
  }
  pos.push(-0.1, 0.03, -0.1, 0.1, 0.03, 0.1)
  pos.push(-0.1, 0.03, 0.1, 0.1, 0.03, -0.1)
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  return g
}
