import test from 'node:test'
import assert from 'node:assert/strict'
import { HuntCollisionField, validateHuntLevel } from '../src/hunt/collision.ts'
import { createHuntLevel } from '../src/hunt/level-data.ts'

test('authored hunt level stays flat, uniquely identified, and route-valid', () => {
  const level = createHuntLevel()
  const result = validateHuntLevel(level)
  assert.equal(level.planeY, 0)
  assert.deepEqual(result.errors, [])
  assert.equal(result.valid, true)
  assert.deepEqual(result.rabbitRoute, ['rabbit-start', 'west-gate', 'deep-west', 'burrow-entry'])
  assert.ok(result.guideRoute?.includes('guide-clearing'))
})

test('movement resolution prevents dog-sized circles from penetrating obstacles', () => {
  const level = createHuntLevel()
  const field = new HuntCollisionField(level)
  const obstacle = level.obstacles[0]
  const resolved = field.resolveMovement(
    { x: obstacle.position.x, z: obstacle.position.z + obstacle.radius + 1 },
    obstacle.position,
    0.52
  )
  const distance = Math.hypot(resolved.x - obstacle.position.x, resolved.z - obstacle.position.z)
  assert.ok(distance >= obstacle.radius + 0.52 - 0.0001)
})

test('the authored task bounds contain animals but never hard-wall the player', () => {
  const level = createHuntLevel()
  const field = new HuntCollisionField(level)
  const outside = { x: level.bounds.maxX + 8, z: level.bounds.maxZ + 4 }
  const animal = field.resolveMovement(level.playerSpawn, outside, 0.42)
  const player = field.resolveMovement(level.playerSpawn, outside, 0.52, false)
  assert.ok(animal.x <= level.bounds.maxX - 0.42)
  assert.deepEqual(player, outside)
})

test('avoidance steering bends a direct route before impact', () => {
  const level = createHuntLevel()
  const field = new HuntCollisionField(level)
  const obstacle = level.obstacles[1]
  const position = { x: obstacle.position.x, z: obstacle.position.z + obstacle.radius + 1.2 }
  const steered = field.steer(position, { x: 0, z: -1 }, 0.42, 3)
  assert.ok(Math.abs(steered.x) > 0.05, 'steering should introduce a readable lateral detour')
  assert.ok(steered.z < 0, 'detour should continue making forward progress')
})

test('validation rejects a blocked rabbit spawn', () => {
  const level = createHuntLevel()
  level.rabbitSpawn = { ...level.obstacles[0].position }
  const result = validateHuntLevel(level)
  assert.equal(result.valid, false)
  assert.ok(result.errors.includes('rabbit spawn overlaps collision'))
})
