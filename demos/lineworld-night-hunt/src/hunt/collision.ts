import type { Vec2 } from './ai'
import type { HuntLevelData, HuntObstacle } from './level-data'

const EPSILON = 0.0001

function length(v: Vec2) {
  return Math.hypot(v.x, v.z)
}

function normalized(v: Vec2): Vec2 {
  const d = length(v)
  return d < EPSILON ? { x: 0, z: -1 } : { x: v.x / d, z: v.z / d }
}

function distanceToSegment(point: Vec2, a: Vec2, b: Vec2) {
  const abX = b.x - a.x
  const abZ = b.z - a.z
  const denom = abX * abX + abZ * abZ
  const t = denom < EPSILON ? 0 : Math.max(0, Math.min(1, ((point.x - a.x) * abX + (point.z - a.z) * abZ) / denom))
  return Math.hypot(point.x - (a.x + abX * t), point.z - (a.z + abZ * t))
}

export class HuntCollisionField {
  readonly level: HuntLevelData

  constructor(level: HuntLevelData) {
    this.level = level
  }

  isCircleClear(position: Vec2, radius: number) {
    if (
      position.x - radius < this.level.bounds.minX ||
      position.x + radius > this.level.bounds.maxX ||
      position.z - radius < this.level.bounds.minZ ||
      position.z + radius > this.level.bounds.maxZ
    ) return false
    return this.level.obstacles.every((obstacle) => (
      Math.hypot(position.x - obstacle.position.x, position.z - obstacle.position.z) >= obstacle.radius + radius
    ))
  }

  segmentClear(a: Vec2, b: Vec2, clearance: number) {
    return this.level.obstacles.every((obstacle) => (
      distanceToSegment(obstacle.position, a, b) >= obstacle.radius + clearance
    ))
  }

  resolveMovement(from: Vec2, desired: Vec2, radius: number, containWithinBounds = true): Vec2 {
    let result = containWithinBounds ? {
      x: Math.max(this.level.bounds.minX + radius, Math.min(this.level.bounds.maxX - radius, desired.x)),
      z: Math.max(this.level.bounds.minZ + radius, Math.min(this.level.bounds.maxZ - radius, desired.z)),
    } : { x: desired.x, z: desired.z }
    for (const obstacle of this.level.obstacles) {
      result = this.pushOutside(result, from, obstacle, radius)
    }
    return result
  }

  steer(position: Vec2, desired: Vec2, radius: number, lookAhead = 2.3): Vec2 {
    const forward = normalized(desired)
    const probe = { x: position.x + forward.x * lookAhead, z: position.z + forward.z * lookAhead }
    let avoid = { x: 0, z: 0 }
    for (const obstacle of this.level.obstacles) {
      const clearance = obstacle.radius + radius + 0.45
      const distance = distanceToSegment(obstacle.position, position, probe)
      if (distance >= clearance) continue
      const away = normalized({ x: position.x - obstacle.position.x, z: position.z - obstacle.position.z })
      const tangentSign = forward.x * away.z - forward.z * away.x < 0 ? -1 : 1
      const tangent = { x: -away.z * tangentSign, z: away.x * tangentSign }
      const weight = 1 - distance / clearance
      avoid.x += (away.x * 0.8 + tangent.x * 1.25) * weight
      avoid.z += (away.z * 0.8 + tangent.z * 1.25) * weight
    }
    const combined = { x: forward.x + avoid.x * 1.7, z: forward.z + avoid.z * 1.7 }
    const forwardProgress = combined.x * forward.x + combined.z * forward.z
    if (forwardProgress < 0.22) {
      combined.x += forward.x * (0.22 - forwardProgress)
      combined.z += forward.z * (0.22 - forwardProgress)
    }
    return normalized(combined)
  }

  findNavigationRoute(startId: string, goalId: string, clearance: number): string[] | null {
    const anchors = new Map(this.level.navigation.map((anchor) => [anchor.id, anchor]))
    if (!anchors.has(startId) || !anchors.has(goalId)) return null
    const queue: string[][] = [[startId]]
    const visited = new Set([startId])
    while (queue.length) {
      const route = queue.shift()!
      const id = route[route.length - 1]
      if (id === goalId) return route
      const anchor = anchors.get(id)!
      for (const nextId of anchor.links) {
        const next = anchors.get(nextId)
        if (!next || visited.has(nextId) || !this.segmentClear(anchor.position, next.position, clearance)) continue
        visited.add(nextId)
        queue.push([...route, nextId])
      }
    }
    return null
  }

  private pushOutside(point: Vec2, from: Vec2, obstacle: HuntObstacle, radius: number): Vec2 {
    const minimum = obstacle.radius + radius
    const dx = point.x - obstacle.position.x
    const dz = point.z - obstacle.position.z
    const d = Math.hypot(dx, dz)
    if (d >= minimum) return point
    const fallback = normalized({ x: from.x - obstacle.position.x, z: from.z - obstacle.position.z })
    const nx = d > EPSILON ? dx / d : fallback.x
    const nz = d > EPSILON ? dz / d : fallback.z
    return { x: obstacle.position.x + nx * minimum, z: obstacle.position.z + nz * minimum }
  }
}

export interface HuntLevelValidation {
  valid: boolean
  errors: string[]
  rabbitRoute: string[] | null
  guideRoute: string[] | null
}

export function validateHuntLevel(level: HuntLevelData, clearance = 0.42): HuntLevelValidation {
  const errors: string[] = []
  const ids = [...level.obstacles.map((item) => item.id), ...level.navigation.map((item) => item.id)]
  if (new Set(ids).size !== ids.length) errors.push('level IDs must be globally unique')
  if (level.planeY !== 0) errors.push('gameplay plane must remain at y=0')
  const field = new HuntCollisionField(level)
  if (!field.isCircleClear(level.playerSpawn, 0.48)) errors.push('player spawn overlaps collision')
  if (!field.isCircleClear(level.rabbitSpawn, clearance)) errors.push('rabbit spawn overlaps collision')
  if (!field.isCircleClear(level.burrow, clearance)) errors.push('burrow overlaps collision')
  for (const anchor of level.navigation) {
    for (const linkedId of anchor.links) {
      if (!level.navigation.some((candidate) => candidate.id === linkedId)) errors.push(`${anchor.id} links to missing ${linkedId}`)
    }
  }
  const rabbitRoute = field.findNavigationRoute('rabbit-start', 'burrow-entry', clearance)
  const guideRoute = field.findNavigationRoute('rabbit-start', 'guide-clearing', clearance)
  if (!rabbitRoute) errors.push('rabbit has no clear route to burrow')
  if (!guideRoute) errors.push('released rabbit has no clear route to guide clearing')
  return { valid: errors.length === 0, errors, rabbitRoute, guideRoute }
}
