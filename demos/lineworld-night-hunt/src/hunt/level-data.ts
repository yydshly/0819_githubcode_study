import type { Vec2 } from './ai'

export interface HuntObstacle {
  id: string
  kind: 'tree' | 'rock'
  position: Vec2
  radius: number
}

export interface HuntNavAnchor {
  id: string
  position: Vec2
  links: string[]
}

export interface HuntLevelData {
  id: string
  planeY: 0
  playerSpawn: Vec2
  rabbitSpawn: Vec2
  burrow: Vec2
  guideTarget: Vec2
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number }
  obstacles: HuntObstacle[]
  navigation: HuntNavAnchor[]
}

const BASE_LEVEL: HuntLevelData = {
  id: 'moonlit-corridor-v2',
  planeY: 0,
  playerSpawn: { x: 0, z: 0 },
  rabbitSpawn: { x: 0.4, z: -11 },
  burrow: { x: -0.8, z: -34 },
  guideTarget: { x: 7.2, z: -26.5 },
  bounds: { minX: -13, maxX: 13, minZ: -38, maxZ: 6 },
  obstacles: [
    { id: 'tree-west-01', kind: 'tree', position: { x: -3.4, z: -16 }, radius: 1.55 },
    { id: 'rock-centre-01', kind: 'rock', position: { x: 1.6, z: -21.2 }, radius: 1.35 },
    { id: 'tree-east-01', kind: 'tree', position: { x: 4.1, z: -27 }, radius: 1.65 },
  ],
  navigation: [
    { id: 'rabbit-start', position: { x: 0.4, z: -11 }, links: ['west-gate', 'east-gate'] },
    { id: 'west-gate', position: { x: -6.8, z: -14.5 }, links: ['rabbit-start', 'deep-west'] },
    { id: 'east-gate', position: { x: 5.4, z: -18.2 }, links: ['rabbit-start', 'deep-east'] },
    { id: 'deep-west', position: { x: -5.7, z: -27 }, links: ['west-gate', 'burrow-entry'] },
    { id: 'deep-east', position: { x: 7.2, z: -24.2 }, links: ['east-gate', 'guide-clearing', 'burrow-entry'] },
    { id: 'guide-clearing', position: { x: 7.2, z: -26.5 }, links: ['deep-east'] },
    { id: 'burrow-entry', position: { x: -0.8, z: -34 }, links: ['deep-west', 'deep-east'] },
  ],
}

export function createHuntLevel(closeFixture = false): HuntLevelData {
  return {
    ...BASE_LEVEL,
    rabbitSpawn: closeFixture ? { x: 0, z: -8.5 } : { ...BASE_LEVEL.rabbitSpawn },
    playerSpawn: { ...BASE_LEVEL.playerSpawn },
    burrow: { ...BASE_LEVEL.burrow },
    guideTarget: { ...BASE_LEVEL.guideTarget },
    bounds: { ...BASE_LEVEL.bounds },
    obstacles: BASE_LEVEL.obstacles.map((obstacle) => ({
      ...obstacle,
      position: { ...obstacle.position },
    })),
    navigation: BASE_LEVEL.navigation.map((anchor) => ({
      ...anchor,
      position: { ...anchor.position },
      links: [...anchor.links],
    })),
  }
}
