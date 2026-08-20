import * as THREE from 'three'

export class RabbitBurrow {
  readonly group = new THREE.Group()
  private material = new THREE.LineBasicMaterial({ color: 0xff8055, transparent: true, opacity: 0.12, fog: false })
  private geometry = new THREE.BufferGeometry()

  constructor(scene: THREE.Scene, readonly position: THREE.Vector3) {
    const vertices: number[] = []
    const n = 24
    for (let i = 0; i < n; i++) {
      const a1 = (i / n) * Math.PI * 2
      const a2 = ((i + 1) / n) * Math.PI * 2
      const r1 = i % 2 === 0 ? 0.55 : 0.48
      const r2 = (i + 1) % 2 === 0 ? 0.55 : 0.48
      vertices.push(Math.cos(a1) * r1, 0.025, Math.sin(a1) * r1)
      vertices.push(Math.cos(a2) * r2, 0.025, Math.sin(a2) * r2)
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      vertices.push(Math.cos(a) * 0.2, 0.03, Math.sin(a) * 0.2)
      vertices.push(Math.cos(a) * 0.48, 0.03, Math.sin(a) * 0.48)
    }
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    this.group.add(new THREE.LineSegments(this.geometry, this.material))
    this.group.position.copy(position)
    scene.add(this.group)
  }

  update(sniff: number, rabbitNear: boolean, escaped: boolean) {
    const target = escaped ? 0.9 : rabbitNear ? 0.3 + sniff * 0.55 : 0.08 + sniff * 0.2
    this.material.opacity += (target - this.material.opacity) * 0.12
    this.group.rotation.y += 0.002 + sniff * 0.004
  }

  moveTo(position: THREE.Vector3) {
    this.position.copy(position)
    this.group.position.copy(position)
  }

  dispose(scene: THREE.Scene) {
    scene.remove(this.group)
    this.geometry.dispose()
    this.material.dispose()
  }
}
