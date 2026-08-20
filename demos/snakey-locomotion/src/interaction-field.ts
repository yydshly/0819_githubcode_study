import * as THREE from 'three'

export interface FieldStamp {
  x: number
  z: number
  radius: number
}

/** A small CPU reference implementation of a decaying interaction texture. */
export class InteractionField {
  readonly texture: THREE.CanvasTexture
  readonly worldSize: number

  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private previewTimer = 0

  constructor(resolution = 256, worldSize = 70) {
    this.worldSize = worldSize
    this.canvas = document.createElement('canvas')
    this.canvas.width = resolution
    this.canvas.height = resolution
    const context = this.canvas.getContext('2d', { alpha: false })
    if (!context) throw new Error('Canvas 2D context unavailable')
    this.context = context
    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, resolution, resolution)

    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.colorSpace = THREE.NoColorSpace
    this.texture.wrapS = THREE.ClampToEdgeWrapping
    this.texture.wrapT = THREE.ClampToEdgeWrapping
    this.texture.minFilter = THREE.LinearFilter
    this.texture.magFilter = THREE.LinearFilter
  }

  clear() {
    this.context.fillStyle = '#000'
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.texture.needsUpdate = true
  }

  update(dt: number, stamps: FieldStamp[]) {
    const ctx = this.context
    const resolution = this.canvas.width
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.2, dt * 0.45)})`
    ctx.fillRect(0, 0, resolution, resolution)

    for (const stamp of stamps) {
      const x = (stamp.x / this.worldSize + 0.5) * resolution
      const y = (1 - (stamp.z / this.worldSize + 0.5)) * resolution
      const radius = Math.max(2, stamp.radius / this.worldSize * resolution)
      const gradient = ctx.createRadialGradient(x, y, radius * 0.1, x, y, radius)
      gradient.addColorStop(0, 'rgba(255,255,255,0.45)')
      gradient.addColorStop(0.55, 'rgba(230,230,230,0.24)')
      gradient.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    this.texture.needsUpdate = true
  }

  drawPreview(target: HTMLCanvasElement, dt: number) {
    this.previewTimer += dt
    if (this.previewTimer < 0.08) return
    this.previewTimer = 0
    const context = target.getContext('2d')
    if (!context) return
    context.clearRect(0, 0, target.width, target.height)
    context.drawImage(this.canvas, 0, 0, target.width, target.height)
  }
}
