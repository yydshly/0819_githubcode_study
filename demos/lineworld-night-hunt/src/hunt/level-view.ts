import * as THREE from 'three'
import type { HuntLevelData, HuntObstacle } from './level-data'

function obstacleGeometry(obstacle: HuntObstacle) {
  const vertices: number[] = []
  const segments = 24
  for (let i = 0; i < segments; i++) {
    const a = i / segments * Math.PI * 2
    const b = (i + 1) / segments * Math.PI * 2
    vertices.push(Math.cos(a) * obstacle.radius, 0.018, Math.sin(a) * obstacle.radius)
    vertices.push(Math.cos(b) * obstacle.radius, 0.018, Math.sin(b) * obstacle.radius)
  }
  if (obstacle.kind === 'tree') {
    vertices.push(0, 0, 0, 0, 4.2, 0)
    vertices.push(-0.85, 2.5, 0, 0.85, 2.5, 0)
    vertices.push(-0.65, 3.3, 0, 0.65, 3.3, 0)
  } else {
    const points = [[-0.85, 0], [-0.35, 0.7], [0.5, 0.82], [0.95, 0.18], [0.55, -0.45], [-0.5, -0.55]]
    for (let i = 0; i < points.length; i++) {
      const a = points[i]
      const b = points[(i + 1) % points.length]
      vertices.push(a[0] * obstacle.radius, 0.03 + Math.abs(a[1]) * 0.6, a[1] * obstacle.radius)
      vertices.push(b[0] * obstacle.radius, 0.03 + Math.abs(b[1]) * 0.6, b[1] * obstacle.radius)
    }
  }
  return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
}

export class HuntLevelView {
  readonly group = new THREE.Group()
  private materials: THREE.LineBasicMaterial[] = []
  private geometries: THREE.BufferGeometry[] = []
  private landmarkMaterial = new THREE.LineBasicMaterial({ color: 0x79d8ff, transparent: true, opacity: 0.16, fog: false })
  private landmark = new THREE.Group()

  constructor(private scene: THREE.Scene, readonly level: HuntLevelData) {
    this.group.name = `hunt-level:${level.id}`
    for (const obstacle of level.obstacles) {
      const geometry = obstacleGeometry(obstacle)
      const material = new THREE.LineBasicMaterial({ color: obstacle.kind === 'tree' ? 0xd7f1ff : 0xffb67a, transparent: true, opacity: 0.22, fog: false })
      const line = new THREE.LineSegments(geometry, material)
      line.name = `collision:${obstacle.id}`
      line.position.set(obstacle.position.x, 0, obstacle.position.z)
      this.group.add(line)
      this.geometries.push(geometry)
      this.materials.push(material)
    }
    const landmarkVertices: number[] = []
    for (let i = 0; i < 32; i++) {
      const a = i / 32 * Math.PI * 2
      const b = (i + 1) / 32 * Math.PI * 2
      const ra = 0.3 + i / 32 * 1.1
      const rb = 0.3 + (i + 1) / 32 * 1.1
      landmarkVertices.push(Math.cos(a) * ra, 0.025, Math.sin(a) * ra)
      landmarkVertices.push(Math.cos(b) * rb, 0.025, Math.sin(b) * rb)
    }
    const geometry = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(landmarkVertices, 3))
    this.geometries.push(geometry)
    this.landmark.add(new THREE.LineSegments(geometry, this.landmarkMaterial))
    this.landmark.position.set(level.guideTarget.x, 0, level.guideTarget.z)
    this.landmark.visible = false
    this.group.add(this.landmark)
    this.scene.add(this.group)
  }

  update(sniff: number, guideActive: boolean, time: number) {
    for (const material of this.materials) material.opacity = 0.18 + sniff * 0.42
    this.landmark.visible = guideActive
    this.landmarkMaterial.opacity = 0.16 + sniff * 0.5
    this.landmark.rotation.y = time * 0.18
  }

  dispose() {
    this.scene.remove(this.group)
    for (const geometry of this.geometries) geometry.dispose()
    for (const material of this.materials) material.dispose()
    this.landmarkMaterial.dispose()
  }
}
