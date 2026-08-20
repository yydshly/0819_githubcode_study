import * as THREE from 'three'
import type { Rng } from './gen'

const uniforms = {
  uTime: { value: 0 },
  uPlayer: { value: new THREE.Vector3() },
  uRadius: { value: 20 },
  uFogNear: { value: 2 },
  uFogFar: { value: 50 },
  uTint: { value: new THREE.Color(0xffffff) },
}

export function updateGrassUniforms(time: number, player: THREE.Vector3, radius: number, fogNear: number, fogFar: number, tint: THREE.Color) {
  uniforms.uTime.value = time
  uniforms.uPlayer.value.copy(player)
  uniforms.uRadius.value = radius
  uniforms.uFogNear.value = fogNear
  uniforms.uFogFar.value = fogFar
  uniforms.uTint.value.copy(tint)
}

let mat: THREE.ShaderMaterial | null = null

export function getGrassMaterial(): THREE.ShaderMaterial {
  if (mat) return mat
  mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      attribute vec2 aData; // phase, tipWeight
      uniform float uTime, uRadius, uFogNear, uFogFar;
      uniform vec3 uPlayer;
      varying float vB;
      void main() {
        vec3 p = position;
        float ph = aData.x;
        float tw = aData.y;
        float sway = sin(uTime * 1.5 + ph + position.x * 0.2 + position.z * 0.2) * 0.7
                   + sin(uTime * 3.4 + ph * 1.7) * 0.3;
        p.x += sway * 0.14 * tw;
        p.z += cos(uTime * 1.1 + ph) * 0.07 * tw;
        vec4 wp = modelMatrix * vec4(p, 1.0);
        float d = distance(wp.xz, uPlayer.xz);
        float pool = 1.0 - smoothstep(uRadius * 0.2, uRadius, d);
        vec4 mv = viewMatrix * wp;
        float fogF = smoothstep(uFogNear, uFogFar, -mv.z);
        vB = (0.05 + pool * 0.85) * (1.0 - fogF);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTint;
      varying float vB;
      void main() {
        gl_FragColor = vec4(uTint * vB, 1.0);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  return mat
}

export function buildGrassChunk(rng: Rng, size: number, density: number): THREE.BufferGeometry {
  const blades = Math.floor(size * size * density)
  const pos: number[] = []
  const data: number[] = []
  for (let i = 0; i < blades; i++) {
    const x = rng() * size - size / 2
    const z = rng() * size - size / 2
    // max boy ~0.28: köpek omuz yüksekliğinin yarısı
    const h = rng() < 0.06 ? 0.24 + rng() * 0.04 : 0.10 + rng() * 0.15
    const leanX = (rng() - 0.5) * 0.26
    const leanZ = (rng() - 0.5) * 0.26
    const phase = rng() * Math.PI * 2
    const tx = x + leanX, ty = h, tz = z + leanZ
    if (h < 0.32) {
      // kısa blade: tek segment
      pos.push(x, 0, z, tx, ty, tz)
      data.push(phase, 0, phase, 1)
    } else {
      // uzun blade: iki segment, kıvrımlı
      const mx = x + leanX * 0.4, my = h * 0.55, mz = z + leanZ * 0.4
      pos.push(x, 0, z, mx, my, mz, mx, my, mz, tx, ty, tz)
      data.push(phase, 0, phase, 0.55, phase, 0.55, phase, 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aData', new THREE.Float32BufferAttribute(data, 2))
  return g
}
