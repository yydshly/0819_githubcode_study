import * as THREE from 'three'
import type { ExperimentMode } from './procedural-snake'
import type { InteractionField } from './interaction-field'

export const WORLD_SIZE = 70
export const TREE_POSITION = new THREE.Vector3(7, 0, 5)

export function terrainHeight(x: number, z: number) {
  return Math.sin(x * 0.17) * 0.25 + Math.cos(z * 0.13) * 0.22 + Math.sin((x + z) * 0.07) * 0.32
}

const HEIGHT_GLSL = /* glsl */ `
float terrainHeight(vec2 p) {
  return sin(p.x * 0.17) * 0.25 + cos(p.y * 0.13) * 0.22 + sin((p.x + p.y) * 0.07) * 0.32;
}
`

function mulberry32(seed: number) {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ result >>> 15, result | 1)
    result ^= result + Math.imul(result ^ result >>> 7, result | 61)
    return ((result ^ result >>> 14) >>> 0) / 4294967296
  }
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 150, 150)
  geometry.rotateX(-Math.PI / 2)
  const positions = geometry.getAttribute('position')
  for (let index = 0; index < positions.count; index++) {
    positions.setY(index, terrainHeight(positions.getX(index), positions.getZ(index)))
  }
  geometry.computeVertexNormals()

  const material = new THREE.MeshStandardMaterial({ color: 0x17281a, roughness: 1, metalness: 0 })
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTerrainWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTerrainWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vTerrainWorld;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise2(vec2 p){
          vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
          return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
        }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        diffuseColor.rgb *= 0.78 + noise2(vTerrainWorld.xz * 0.6) * 0.34;
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.09, 0.17, 0.08), smoothstep(0.55, 0.82, noise2(vTerrainWorld.xz * 0.18 + 8.0)));`)
  }
  material.customProgramCacheKey = () => 'snakey-research-terrain-v1'
  return new THREE.Mesh(geometry, material)
}

function createGrass(field: InteractionField, bladeCount = 26000) {
  const template = new THREE.PlaneGeometry(0.07, 1, 1, 3)
  template.translate(0, 0.5, 0)
  const geometry = new THREE.InstancedBufferGeometry()
  geometry.index = template.index
  geometry.setAttribute('position', template.getAttribute('position'))
  geometry.setAttribute('uv', template.getAttribute('uv'))

  const offsets = new Float32Array(bladeCount * 2)
  const randoms = new Float32Array(bladeCount * 3)
  const random = mulberry32(82731)
  for (let index = 0; index < bladeCount; index++) {
    offsets[index * 2] = (random() - 0.5) * WORLD_SIZE
    offsets[index * 2 + 1] = (random() - 0.5) * WORLD_SIZE
    randoms[index * 3] = random()
    randoms[index * 3 + 1] = random()
    randoms[index * 3 + 2] = random()
  }
  geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 2))
  geometry.setAttribute('aRand', new THREE.InstancedBufferAttribute(randoms, 3))
  geometry.instanceCount = bladeCount
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), WORLD_SIZE)

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uField: { value: field.texture },
      uFieldVisible: { value: 0 },
      uWorldSize: { value: WORLD_SIZE },
      uCamera: { value: new THREE.Vector3() },
      uFogColor: { value: new THREE.Color(0x7e9278) },
    },
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform sampler2D uField;
      uniform float uWorldSize;
      uniform vec3 uCamera;
      attribute vec2 aOffset;
      attribute vec3 aRand;
      varying float vT;
      varying float vField;
      varying float vShade;
      varying float vDistance;
      ${HEIGHT_GLSL}
      void main() {
        float t = uv.y;
        vec3 world = vec3(aOffset.x, terrainHeight(aOffset), aOffset.y);
        vec2 fieldUv = world.xz / uWorldSize + 0.5;
        float field = texture2D(uField, fieldUv).r;
        float sx = texture2D(uField, fieldUv + vec2(0.004, 0.0)).r;
        float sz = texture2D(uField, fieldUv + vec2(0.0, 0.004)).r;
        vec2 gradient = vec2(sx - field, sz - field);
        vec2 push = length(gradient) > 0.001 ? -normalize(gradient) : vec2(0.0);

        float height = mix(0.38, 0.86, aRand.y);
        float wind = sin(uTime * 1.7 + aRand.x * 6.283 + aOffset.x * 0.13 + aOffset.y * 0.09) * 0.18;
        float bend = field * field;
        world.xz += vec2(wind, wind * 0.42) * t * t * (1.0 - bend * 0.7);
        world.xz += push * bend * t * height * 1.15;
        world.y += position.y * height * (1.0 - bend * 0.74);

        float rotation = aRand.z * 6.283;
        vec2 widthDirection = vec2(cos(rotation), sin(rotation));
        world.xz += widthDirection * position.x * (1.0 - t * 0.68);

        vT = t;
        vField = field;
        vShade = aRand.y;
        vDistance = distance(world.xz, uCamera.xz);
        gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uFogColor;
      varying float vT;
      varying float vField;
      varying float vShade;
      varying float vDistance;
      void main() {
        vec3 root = vec3(0.035, 0.10, 0.035);
        vec3 tip = vec3(0.31, 0.48, 0.16);
        vec3 color = mix(root, tip, pow(vT, 1.25));
        color *= 0.75 + vShade * 0.45;
        color = mix(color, vec3(0.45, 0.32, 0.12), vField * 0.55);
        float fog = 1.0 - exp(-vDistance * vDistance * 0.0012);
        color = mix(color, uFogColor, fog);
        gl_FragColor = vec4(color, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.frustumCulled = false
  return { mesh, material }
}

function createInteractionOverlay(field: InteractionField) {
  const geometry = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, 110, 110)
  geometry.rotateX(-Math.PI / 2)
  const positions = geometry.getAttribute('position')
  for (let index = 0; index < positions.count; index++) {
    positions.setY(index, terrainHeight(positions.getX(index), positions.getZ(index)) + 0.045)
  }
  const material = new THREE.ShaderMaterial({
    uniforms: { uField: { value: field.texture } },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uField;
      varying vec2 vUv;
      void main(){
        float value=texture2D(uField, vUv).r;
        vec3 color=mix(vec3(0.18,0.45,0.18),vec3(1.0,0.52,0.12),value);
        gl_FragColor=vec4(color, value*0.48);
      }`,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.visible = false
  return mesh
}

function createClimbTree() {
  const group = new THREE.Group()
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a3421, roughness: 1 })
  const leaf = new THREE.MeshStandardMaterial({ color: 0x203c20, roughness: 0.95 })
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.28, 1.5, 8, 18), bark)
  trunk.position.set(TREE_POSITION.x, 3.65, TREE_POSITION.z)
  group.add(trunk)

  const branchDirections = [
    new THREE.Vector3(3.2, 1.0, 1.2),
    new THREE.Vector3(-2.6, 0.7, 2.1),
    new THREE.Vector3(1.1, 0.8, -2.8),
  ]
  const up = new THREE.Vector3(0, 1, 0)
  branchDirections.forEach((direction, index) => {
    const length = direction.length()
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.38, length, 10), bark)
    branch.position.set(TREE_POSITION.x, 2.3 + index * 1.6, TREE_POSITION.z).addScaledVector(direction, 0.5)
    branch.quaternion.setFromUnitVectors(up, direction.clone().normalize())
    group.add(branch)
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35 - index * 0.1, 1), leaf)
    crown.position.copy(branch.position).addScaledVector(direction, 0.58)
    crown.scale.y = 0.72
    group.add(crown)
  })

  for (let index = 0; index < 4; index++) {
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 + index * 0.1, 1), leaf)
    crown.position.set(TREE_POSITION.x + Math.cos(index * 1.7) * 1.1, 7.2 + (index % 2) * 0.8, TREE_POSITION.z + Math.sin(index * 1.7) * 1.1)
    crown.scale.y = 0.75
    group.add(crown)
  }
  return group
}

function createForest() {
  const count = 90
  const geometry = new THREE.ConeGeometry(0.55, 3.4, 7)
  geometry.translate(0, 1.7, 0)
  const material = new THREE.MeshStandardMaterial({ color: 0x1d351d, roughness: 1 })
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  const matrix = new THREE.Matrix4()
  const random = mulberry32(11993)
  for (let index = 0; index < count; index++) {
    const angle = random() * Math.PI * 2
    const radius = 13 + random() * 20
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const scale = 0.65 + random() * 1.2
    matrix.compose(
      new THREE.Vector3(x, terrainHeight(x, z), z),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), random() * Math.PI),
      new THREE.Vector3(scale, scale, scale),
    )
    mesh.setMatrixAt(index, matrix)
  }
  return mesh
}

export class Environment {
  readonly group = new THREE.Group()
  readonly grassMaterial: THREE.ShaderMaterial

  private overlay: THREE.Mesh
  private tree: THREE.Group

  constructor(field: InteractionField) {
    this.group.add(createTerrain())
    const grass = createGrass(field)
    this.grassMaterial = grass.material
    this.group.add(grass.mesh)
    this.overlay = createInteractionOverlay(field)
    this.group.add(this.overlay)
    this.tree = createClimbTree()
    this.group.add(this.tree)
    this.group.add(createForest())
  }

  setMode(mode: ExperimentMode, forceField = false) {
    this.overlay.visible = mode === 'field' || forceField
    this.tree.traverse((object) => {
      if (object instanceof THREE.Mesh && object.material instanceof THREE.MeshStandardMaterial) {
        object.material.emissive.set(mode === 'climb' ? 0x0d190d : 0x000000)
      }
    })
  }

  update(time: number, cameraPosition: THREE.Vector3) {
    this.grassMaterial.uniforms.uTime.value = time
    ;(this.grassMaterial.uniforms.uCamera.value as THREE.Vector3).copy(cameraPosition)
  }
}
