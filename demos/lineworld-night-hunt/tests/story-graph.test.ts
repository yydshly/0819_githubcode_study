import test from 'node:test'
import assert from 'node:assert/strict'
import { ACTION_LABELS, STORY_NODES, storyNodeForNewRun, transitionStory } from '../src/hunt/story-graph.ts'
import type { StoryNodeId } from '../src/hunt/story-graph.ts'

test('take and release outcomes are explicit branches of the authored task graph', () => {
  let node: StoryNodeId = storyNodeForNewRun(false)
  node = transitionStory(node, 'sniff')
  assert.equal(node, 'hunt.stalk')
  node = transitionStory(node, 'rabbitFleeing')
  assert.equal(node, 'hunt.chase')
  node = transitionStory(node, 'rabbitCaught')
  assert.equal(node, 'hunt.choice')
  assert.equal(transitionStory(node, 'take'), 'hunt.resolved.take')
  assert.equal(transitionStory(node, 'release'), 'hunt.resolved.release')
})

test('release persistence enters the reunion and guide branch on the next run', () => {
  let node = storyNodeForNewRun(true)
  assert.equal(node, 'bond.reunion')
  node = transitionStory(node, 'guideMoving')
  assert.equal(node, 'bond.guiding')
  node = transitionStory(node, 'guideWaiting')
  assert.equal(node, 'bond.reunion')
  node = transitionStory(transitionStory(node, 'guideMoving'), 'guideComplete')
  assert.equal(node, 'bond.guided')
})

test('every player-facing task prompt contains Chinese copy', () => {
  const hasChinese = (value: string) => /[\u3400-\u9fff]/u.test(value)
  for (const node of Object.values(STORY_NODES)) {
    assert.ok(hasChinese(node.status({ threat: 0.5, distanceToBurrow: 8.2, canPounce: false })), `${node.id} status should be Chinese`)
    assert.ok(hasChinese(node.objective), `${node.id} objective should be Chinese`)
    if (!node.panel) continue
    assert.ok(hasChinese(node.panel.title), `${node.id} title should be Chinese`)
    assert.ok(hasChinese(node.panel.text), `${node.id} story text should be Chinese`)
    if (node.panel.retryLabel) assert.ok(hasChinese(node.panel.retryLabel), `${node.id} retry action should be Chinese`)
  }
  for (const label of Object.values(ACTION_LABELS)) assert.ok(hasChinese(label))
})

test('every transition points to a real stable task node', () => {
  for (const node of Object.values(STORY_NODES)) {
    for (const target of Object.values(node.transitions)) {
      assert.ok(target in STORY_NODES, `${node.id} points to missing node ${target}`)
    }
  }
})
