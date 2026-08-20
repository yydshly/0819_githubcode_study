import * as THREE from 'three'
import { PathHistory, type PathSeed } from './path-history'
import type { FieldStamp } from './interaction-field'

export type ExperimentMode = 'ground' | 'climb' | 'field' | 'anatomy'

export interface SnakeParameters {
  amplitude: number
  wavelength: number
  speed: number
  radiusScale: number
}

export interface DriveInput {
  turn: number
  forward: boolean
}

const BODY_LENGTH = 12.4
const RING_COUNT = 88
const RING_SEGMENTS = 14
const TREE_CENTER = new THREE.Vector2(7, 5)
const TREE_SURFACE_RADIUS = 1.5

function radiusProfile(distance: number) {
  const head = THREE.MathUtils.smoothstep(distance, 0, 0.7)
  const tail = 1 - THREE.MathUtils.smoothstep(distance, BODY_LENGTH * 0.72, BODY_LENGTH)
  return (0.62 + head * 0.34) * Math.max(0.05, tail)
}

function createSkinTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#667246'
  ctx.fillRect(0, 0, 256, 256)

  for (let row = 0; row < 16; row++) {
    for (let column = 0; column < 12; column++) {
      const x = column * 24 + (row % 2) * 12
      const y = row * 16
      ctx.fillStyle = (row + column) % 5 === 0 ? '#303923' : '#89925b'
      ctx.beginPath()
      ctx.moveTo(x, y + 1)
      ctx.lineTo(x + 11, y + 8)
      ctx.lineTo(x, y + 15)
      ctx.lineTo(x - 11, y + 8)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'rgba(18,25,16,.28)'
      ctx.stroke()
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.2, 7)
  return texture
}

export class ProceduralSnake {
  readonly group = new THREE.Group()
  readonly history = new PathHistory(0.08, 220)
  readonly headPosition = new THREE.Vector3()

  mode: ExperimentMode = 'ground'
  parameters: SnakeParameters = {
    amplitude: 0.3,
    wavelength: 2.6,
    speed: 2.2,
    radiusScale: 1,
  }

  private geometry: THREE.BufferGeometry
  private positionAttribute: THREE.BufferAttribute
  private normalAttribute: THREE.BufferAttribute
  private mesh: THREE.Mesh
  private heading = 0
  private distanceTravelled = 0
  private elapsed = 0
  private pathLine: THREE.Line
  private frameLines: THREE.LineSegments
  private headMarker: THREE.Mesh

  private point = new THREE.Vector3()
  private pointForward = new THREE.Vector3()
  private pointBack = new THREE.Vector3()
  private normal = new THREE.Vector3()
  private spareNormal = new THREE.Vector3()
  private tangent = new THREE.Vector3()
  private right = new THREE.Vector3()
  private up = new THREE.Vector3()

  constructor(private heightAt: (x: number, z: number) => number) {
    const vertexCount = RING_COUNT * (RING_SEGMENTS + 1)
    this.geometry = new THREE.BufferGeometry()
    this.positionAttribute = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3)
    this.normalAttribute = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3)
    this.positionAttribute.setUsage(THREE.DynamicDrawUsage)
    this.normalAttribute.setUsage(THREE.DynamicDrawUsage)

    const uvs = new Float32Array(vertexCount * 2)
    const indices: number[] = []
    for (let ring = 0; ring < RING_COUNT; ring++) {
      for (let segment = 0; segment <= RING_SEGMENTS; segment++) {
        const vertex = ring * (RING_SEGMENTS + 1) + segment
        uvs[vertex * 2] = segment / RING_SEGMENTS
        uvs[vertex * 2 + 1] = ring / (RING_COUNT - 1)
      }
    }
    for (let ring = 0; ring < RING_COUNT - 1; ring++) {
      for (let segment = 0; segment < RING_SEGMENTS; segment++) {
        const a = ring * (RING_SEGMENTS + 1) + segment
        const b = (ring + 1) * (RING_SEGMENTS + 1) + segment
        indices.push(a, b, a + 1, a + 1, b, b + 1)
      }
    }

    this.geometry.setAttribute('position', this.positionAttribute)
    this.geometry.setAttribute('normal', this.normalAttribute)
    this.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    this.geometry.setIndex(indices)
    this.geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), BODY_LENGTH + 3)

    const material = new THREE.MeshStandardMaterial({
      map: createSkinTexture(),
      color: 0xd8d9a5,
      roughness: 0.68,
      metalness: 0,
    })
    this.mesh = new THREE.Mesh(this.geometry, material)
    this.mesh.frustumCulled = false
    this.group.add(this.mesh)

    const pathGeometry = new THREE.BufferGeometry()
    pathGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(110 * 3), 3))
    this.pathLine = new THREE.Line(pathGeometry, new THREE.LineBasicMaterial({ color: 0xf2b45f, transparent: true, opacity: 0.9 }))
    this.pathLine.visible = false
    this.group.add(this.pathLine)

    const frameGeometry = new THREE.BufferGeometry()
    frameGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(90 * 3), 3))
    frameGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(90 * 3), 3))
    this.frameLines = new THREE.LineSegments(frameGeometry, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 }))
    this.frameLines.visible = false
    this.group.add(this.frameLines)

    this.headMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 14, 10),
      new THREE.MeshBasicMaterial({ color: 0xf2b45f }),
    )
    this.headMarker.visible = false
    this.group.add(this.headMarker)

    this.seedGroundPath()
    this.rebuild()
  }

  setMode(mode: ExperimentMode) {
    if (mode === this.mode) {
      this.setDebug(mode === 'anatomy' || this.pathLine.visible, mode === 'anatomy' || this.frameLines.visible)
      return
    }
    this.mode = mode
    this.distanceTravelled = 0
    this.elapsed = 0
    this.heading = 0
    if (mode === 'climb') this.seedClimbPath()
    else this.seedGroundPath(mode === 'field' ? -4 : 0)
    this.setDebug(mode === 'anatomy', mode === 'anatomy')
    this.rebuild()
  }

  setDebug(pathVisible: boolean, framesVisible: boolean) {
    this.pathLine.visible = pathVisible
    this.frameLines.visible = framesVisible
    this.headMarker.visible = pathVisible || framesVisible
  }

  update(dt: number, input: DriveInput) {
    this.elapsed += dt
    const speed = this.parameters.speed * (input.forward ? 1.35 : 1)
    this.distanceTravelled += speed * dt

    if (this.mode === 'climb') this.updateClimb()
    else this.updateGround(dt, input.turn, speed)

    this.rebuild()
  }

  getStamps(): FieldStamp[] {
    const stamps: FieldStamp[] = []
    if (this.mode === 'climb') return stamps
    for (let distance = 0.4; distance < BODY_LENGTH - 0.6; distance += 0.55) {
      this.history.sample(distance, this.point, this.normal)
      stamps.push({ x: this.point.x, z: this.point.z, radius: 0.52 * this.parameters.radiusScale })
    }
    return stamps
  }

  private updateGround(dt: number, turn: number, speed: number) {
    const k = Math.PI * 2 / this.parameters.wavelength
    const wiggle = Math.atan(this.parameters.amplitude * k * Math.cos(k * this.distanceTravelled))
    const head = this.history.head.clone()

    this.heading += turn * dt * 1.8
    if (turn === 0) this.heading += Math.sin(this.elapsed * 0.37) * dt * 0.08

    const radial = Math.hypot(head.x, head.z)
    if (radial > 19) {
      const target = Math.atan2(-head.x, -head.z)
      let difference = Math.atan2(Math.sin(target - this.heading), Math.cos(target - this.heading))
      this.heading += difference * dt * 0.65
    }

    const angle = this.heading + wiggle
    head.x += Math.sin(angle) * speed * dt
    head.z += Math.cos(angle) * speed * dt
    head.y = this.heightAt(head.x, head.z) + 0.04

    this.history.setHead(head, this.normal.set(0, 1, 0), 1)
    this.headPosition.copy(head).addScaledVector(this.normal, 0.25)
  }

  private updateClimb() {
    const angle = this.distanceTravelled / TREE_SURFACE_RADIUS + 0.5
    const vertical = 3.75 + Math.sin(this.distanceTravelled * 0.28 - 0.8) * 2.7
    const normal = this.normal.set(Math.cos(angle), 0, Math.sin(angle))
    const head = this.point.set(
      TREE_CENTER.x + normal.x * TREE_SURFACE_RADIUS,
      vertical,
      TREE_CENTER.y + normal.z * TREE_SURFACE_RADIUS,
    )
    this.history.setHead(head, normal, 0)
    this.headPosition.copy(head).addScaledVector(normal, 0.22)
  }

  private seedGroundPath(offsetX = 0) {
    const seed: PathSeed[] = []
    const normal = new THREE.Vector3(0, 1, 0)
    const k = Math.PI * 2 / this.parameters.wavelength
    for (let distance = BODY_LENGTH + 2; distance >= 0; distance -= this.history.spacing) {
      const x = offsetX + this.parameters.amplitude * Math.sin(-distance * k)
      const z = -distance + (this.mode === 'field' ? 2 : 0)
      seed.push({ position: new THREE.Vector3(x, this.heightAt(x, z) + 0.04, z), normal, grounded: 1 })
    }
    this.history.reset(seed)
    this.headPosition.copy(this.history.head).add(new THREE.Vector3(0, 0.25, 0))
  }

  private seedClimbPath() {
    const seed: PathSeed[] = []
    for (let distance = BODY_LENGTH + 2; distance >= 0; distance -= this.history.spacing) {
      const phase = -distance / TREE_SURFACE_RADIUS + 0.5
      const normal = new THREE.Vector3(Math.cos(phase), 0, Math.sin(phase))
      const position = new THREE.Vector3(
        TREE_CENTER.x + normal.x * TREE_SURFACE_RADIUS,
        3.75 + Math.sin(-distance * 0.28 - 0.8) * 2.7,
        TREE_CENTER.y + normal.z * TREE_SURFACE_RADIUS,
      )
      seed.push({ position, normal, grounded: 0 })
    }
    this.history.reset(seed)
    this.headPosition.copy(this.history.head).addScaledVector(seed.at(-1)!.normal, 0.22)
  }

  private rebuild() {
    const positions = this.positionAttribute.array as Float32Array
    const normals = this.normalAttribute.array as Float32Array
    const ringStep = BODY_LENGTH / (RING_COUNT - 1)
    const pathPositions = this.pathLine.geometry.getAttribute('position') as THREE.BufferAttribute
    const framePositions = this.frameLines.geometry.getAttribute('position') as THREE.BufferAttribute
    const frameColors = this.frameLines.geometry.getAttribute('color') as THREE.BufferAttribute
    let frameVertex = 0

    for (let ring = 0; ring < RING_COUNT; ring++) {
      const distance = ring * ringStep
      const grounded = this.history.sample(distance, this.point, this.normal)
      this.history.sample(Math.max(0, distance - 0.12), this.pointForward, this.spareNormal)
      this.history.sample(Math.min(BODY_LENGTH, distance + 0.12), this.pointBack, this.spareNormal)

      this.tangent.subVectors(this.pointForward, this.pointBack).normalize()
      this.right.crossVectors(this.tangent, this.normal)
      if (this.right.lengthSq() < 1e-6) this.right.set(this.normal.z, 0, -this.normal.x)
      this.right.normalize()
      this.up.crossVectors(this.right, this.tangent).normalize()

      const profile = radiusProfile(distance) * this.parameters.radiusScale
      const radiusWide = profile * THREE.MathUtils.lerp(0.23, 0.3, grounded)
      const radiusTall = profile * THREE.MathUtils.lerp(0.24, 0.17, grounded)
      const center = this.point.clone().addScaledVector(this.normal, radiusTall * 0.95)

      for (let segment = 0; segment <= RING_SEGMENTS; segment++) {
        const theta = segment / RING_SEGMENTS * Math.PI * 2
        const cosine = Math.cos(theta)
        const sine = Math.sin(theta)
        const vertex = (ring * (RING_SEGMENTS + 1) + segment) * 3

        positions[vertex] = center.x + this.right.x * cosine * radiusWide + this.up.x * sine * radiusTall
        positions[vertex + 1] = center.y + this.right.y * cosine * radiusWide + this.up.y * sine * radiusTall
        positions[vertex + 2] = center.z + this.right.z * cosine * radiusWide + this.up.z * sine * radiusTall

        const nx = this.right.x * cosine * radiusTall + this.up.x * sine * radiusWide
        const ny = this.right.y * cosine * radiusTall + this.up.y * sine * radiusWide
        const nz = this.right.z * cosine * radiusTall + this.up.z * sine * radiusWide
        const length = Math.hypot(nx, ny, nz) || 1
        normals[vertex] = nx / length
        normals[vertex + 1] = ny / length
        normals[vertex + 2] = nz / length
      }

      if (ring % 8 === 0 && frameVertex + 6 <= framePositions.count) {
        const axes = [
          { vector: this.tangent, color: new THREE.Color(0x72a7ff) },
          { vector: this.right, color: new THREE.Color(0xef7f67) },
          { vector: this.up, color: new THREE.Color(0x8dca7b) },
        ]
        for (const axis of axes) {
          framePositions.setXYZ(frameVertex, center.x, center.y, center.z)
          frameColors.setXYZ(frameVertex, axis.color.r, axis.color.g, axis.color.b)
          frameVertex++
          framePositions.setXYZ(frameVertex, center.x + axis.vector.x * 0.48, center.y + axis.vector.y * 0.48, center.z + axis.vector.z * 0.48)
          frameColors.setXYZ(frameVertex, axis.color.r, axis.color.g, axis.color.b)
          frameVertex++
        }
      }
    }

    for (let index = 0; index < pathPositions.count; index++) {
      const distance = index / (pathPositions.count - 1) * BODY_LENGTH
      this.history.sample(distance, this.point, this.normal)
      pathPositions.setXYZ(index, this.point.x, this.point.y + 0.04, this.point.z)
    }

    this.headMarker.position.copy(this.headPosition)
    this.positionAttribute.needsUpdate = true
    this.normalAttribute.needsUpdate = true
    pathPositions.needsUpdate = true
    framePositions.needsUpdate = true
    frameColors.needsUpdate = true
    this.frameLines.geometry.setDrawRange(0, frameVertex)
    this.geometry.boundingSphere!.center.copy(this.headPosition)
  }
}
