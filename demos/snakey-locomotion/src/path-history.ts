import * as THREE from 'three'

export interface PathSeed {
  position: THREE.Vector3
  normal: THREE.Vector3
  grounded: number
}

interface StoredPoint {
  position: THREE.Vector3
  normal: THREE.Vector3
  grounded: number
}

/**
 * A bounded, distance-sampled path. The head is live while stored points are
 * spaced evenly, so a body can query its pose by arc distance rather than time.
 */
export class PathHistory {
  readonly spacing: number
  readonly maxPoints: number

  private points: StoredPoint[] = []
  private headPosition = new THREE.Vector3()
  private headNormal = new THREE.Vector3(0, 1, 0)
  private headGrounded = 1
  private scratchNormal = new THREE.Vector3()

  constructor(spacing = 0.08, maxPoints = 220) {
    this.spacing = spacing
    this.maxPoints = maxPoints
  }

  get count() {
    return this.points.length
  }

  get head() {
    return this.headPosition
  }

  reset(seed: PathSeed[]) {
    this.points = seed.slice(-this.maxPoints).map((point) => ({
      position: point.position.clone(),
      normal: point.normal.clone().normalize(),
      grounded: point.grounded,
    }))

    const latest = this.points.at(-1)
    if (latest) {
      this.headPosition.copy(latest.position)
      this.headNormal.copy(latest.normal)
      this.headGrounded = latest.grounded
    }
  }

  setHead(position: THREE.Vector3, normal: THREE.Vector3, grounded: number) {
    if (this.points.length === 0) {
      this.reset([{ position, normal, grounded }])
      return
    }

    let latest = this.points[this.points.length - 1]
    let distance = latest.position.distanceTo(position)

    while (distance >= this.spacing) {
      const t = this.spacing / distance
      const nextPosition = latest.position.clone().lerp(position, t)
      const nextNormal = this.scratchNormal.copy(latest.normal).lerp(normal, t).normalize().clone()
      const nextGrounded = THREE.MathUtils.lerp(latest.grounded, grounded, t)

      latest = { position: nextPosition, normal: nextNormal, grounded: nextGrounded }
      this.points.push(latest)
      distance = latest.position.distanceTo(position)

      if (this.points.length > this.maxPoints) this.points.shift()
    }

    this.headPosition.copy(position)
    this.headNormal.copy(normal).normalize()
    this.headGrounded = grounded
  }

  sample(distance: number, outPosition: THREE.Vector3, outNormal: THREE.Vector3) {
    const latestIndex = this.points.length - 1
    if (latestIndex < 0) {
      outPosition.copy(this.headPosition)
      outNormal.copy(this.headNormal)
      return this.headGrounded
    }

    const latest = this.points[latestIndex]
    const headGap = latest.position.distanceTo(this.headPosition)

    if (distance <= headGap) {
      const t = headGap > 1e-6 ? distance / headGap : 0
      outPosition.copy(this.headPosition).lerp(latest.position, t)
      outNormal.copy(this.headNormal).lerp(latest.normal, t).normalize()
      return THREE.MathUtils.lerp(this.headGrounded, latest.grounded, t)
    }

    const floatingIndex = latestIndex - (distance - headGap) / this.spacing
    const low = THREE.MathUtils.clamp(Math.floor(floatingIndex), 0, Math.max(0, latestIndex - 1))
    const high = Math.min(latestIndex, low + 1)
    const t = THREE.MathUtils.clamp(floatingIndex - low, 0, 1)
    const a = this.points[low]
    const b = this.points[high]

    outPosition.copy(a.position).lerp(b.position, t)
    outNormal.copy(a.normal).lerp(b.normal, t).normalize()
    return THREE.MathUtils.lerp(a.grounded, b.grounded, t)
  }
}
