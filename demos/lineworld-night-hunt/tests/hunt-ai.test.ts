import test from 'node:test'
import assert from 'node:assert/strict'
import { decideRabbitState, selectFleeDirection, threatScore } from '../src/hunt/ai.ts'
import type { RabbitPerception, RabbitState } from '../src/hunt/ai.ts'

const quiet: RabbitPerception = {
  distanceToDog: 18,
  distanceToBurrow: 20,
  dogSpeed: 0,
  dogFacing: -1,
  barkPulse: false,
}

function decide(state: RabbitState, stateTime: number, perception: RabbitPerception, jukeCooldown = 1) {
  return decideRabbitState({ state, stateTime, perception, jukeCooldown })
}

test('a distant quiet dog does not disturb a calm rabbit', () => {
  assert.equal(threatScore(quiet), 0)
  assert.equal(decide('calm', 2, quiet), 'calm')
})

test('bark starts a legible listening and alert sequence instead of instant flight', () => {
  const bark = { ...quiet, barkPulse: true }
  assert.equal(decide('calm', 0, bark), 'listening')
  assert.equal(decide('listening', 0.1, bark), 'listening')
  assert.equal(decide('listening', 0.23, bark), 'alert')
  assert.equal(decide('alert', 0.2, bark), 'alert')
  assert.equal(decide('alert', 0.35, bark), 'fleeing')
})

test('close pressure enables a bounded juke after the rabbit has committed to fleeing', () => {
  const close = { ...quiet, distanceToDog: 2.2, dogSpeed: 6, dogFacing: 1 }
  assert.equal(decide('fleeing', 0.2, close, 0), 'fleeing')
  assert.equal(decide('fleeing', 0.33, close, 0), 'juking')
  assert.equal(decide('juking', 0.2, close, 0), 'juking')
  assert.equal(decide('juking', 0.35, close, 0), 'fleeing')
})

test('the burrow transition is terminal and cannot be overwritten by threat', () => {
  const atBurrow = { ...quiet, distanceToDog: 1, distanceToBurrow: 0.7, barkPulse: true }
  assert.equal(decide('fleeing', 0.5, atBurrow, 0), 'burrowing')
  assert.equal(decide('burrowing', 0.2, atBurrow, 0), 'burrowing')
  assert.equal(decide('burrowing', 0.43, atBurrow, 0), 'escaped')
  assert.equal(decide('escaped', 10, atBurrow, 0), 'escaped')
  assert.equal(decide('caught', 10, atBurrow, 0), 'caught')
})

test('flee steering combines distance from the dog with progress toward the burrow', () => {
  const straight = selectFleeDirection({ x: 0, z: -5 }, { x: 0, z: 0 }, { x: 0, z: -20 }, 'fleeing', 1)
  assert.ok(straight.z < -0.9)
  const leftJuke = selectFleeDirection({ x: 0, z: -5 }, { x: 0, z: 0 }, { x: 0, z: -20 }, 'juking', -1)
  const rightJuke = selectFleeDirection({ x: 0, z: -5 }, { x: 0, z: 0 }, { x: 0, z: -20 }, 'juking', 1)
  assert.ok(leftJuke.x < 0)
  assert.ok(rightJuke.x > 0)
  const lowPressure = selectFleeDirection({ x: 0, z: -5 }, { x: 8, z: -5 }, { x: 0, z: -20 }, 'fleeing', 1, 0)
  assert.ok(lowPressure.z < -0.9, 'a distant dog should not pull the rabbit away from its burrow route')
})
