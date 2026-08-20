import * as THREE from 'three'
import { mulberry32 } from '../gen'
import { RabbitBurrow } from './burrow'
import { HuntCollisionField, validateHuntLevel } from './collision'
import { HuntRabbit } from './hunt-rabbit'
import { createHuntLevel } from './level-data'
import { HuntLevelView } from './level-view'
import { DynamicScentTrail } from './scent-trail'
import { clearHuntSave, loadHuntSave, saveHunt } from './save'
import type { HuntSave } from './save'
import { ACTION_LABELS, STORY_NODES, storyNodeForNewRun, transitionStory } from './story-graph'
import type { HuntPhase, StoryEvent, StoryNodeId } from './story-graph'

export type { HuntPhase } from './story-graph'

export interface HuntSnapshot {
  phase: HuntPhase
  storyNode: StoryNodeId
  rabbit: ReturnType<HuntRabbit['snapshot']>
  save: HuntSave
  seed: number
  canPounce: boolean
  level: {
    id: string
    valid: boolean
    errors: string[]
    rabbitRoute: string[] | null
    guideRoute: string[] | null
  }
}

interface HuntUI {
  status: HTMLElement
  meta: HTMLElement
  objective: HTMLElement
  panel: HTMLElement
  panelTitle: HTMLElement
  panelText: HTMLElement
  take: HTMLButtonElement
  release: HTMLButtonElement
  retry: HTMLButtonElement
}

export class HuntDirector {
  phase: HuntPhase = 'search'
  private storyNode: StoryNodeId = 'hunt.search'
  readonly seed: number
  private rabbit: HuntRabbit
  private burrow: RabbitBurrow
  private scent: DynamicScentTrail
  private save = loadHuntSave()
  private pounceReady = false
  private hitConsumed = false
  private ui: HuntUI
  private fixture: string | null
  private level = createHuntLevel(false)
  private collision: HuntCollisionField
  private levelView: HuntLevelView
  private validation = validateHuntLevel(this.level)
  private guideActive = false
  private elapsed = 0

  constructor(private scene: THREE.Scene, private onEnergy: (delta: number) => void) {
    const params = new URLSearchParams(location.search)
    this.seed = Number(params.get('seed')) || 1337
    this.fixture = params.get('fixture')
    this.level = createHuntLevel(this.fixture === 'close')
    this.collision = new HuntCollisionField(this.level)
    this.validation = validateHuntLevel(this.level)
    if (!this.validation.valid) console.error('狩猎关卡数据无效', this.validation.errors)
    this.levelView = new HuntLevelView(scene, this.level)
    const rng = mulberry32(this.seed)
    const rabbitStart = new THREE.Vector3(this.level.rabbitSpawn.x, 0, this.level.rabbitSpawn.z)
    const burrowPos = new THREE.Vector3(this.level.burrow.x, 0, this.level.burrow.z)
    this.burrow = new RabbitBurrow(scene, burrowPos)
    this.rabbit = new HuntRabbit(scene, rabbitStart, burrowPos, rng, this.collision)
    this.scent = new DynamicScentTrail(scene, rabbitStart)
    this.ui = {
      status: document.getElementById('hunt-status')!,
      meta: document.getElementById('hunt-meta')!,
      objective: document.getElementById('hunt-objective-text')!,
      panel: document.getElementById('hunt-panel')!,
      panelTitle: document.getElementById('hunt-panel-title')!,
      panelText: document.getElementById('hunt-panel-text')!,
      take: document.getElementById('hunt-take') as HTMLButtonElement,
      release: document.getElementById('hunt-release') as HTMLButtonElement,
      retry: document.getElementById('hunt-retry') as HTMLButtonElement,
    }
    this.ui.take.addEventListener('click', () => this.choose('take'))
    this.ui.release.addEventListener('click', () => this.choose('release'))
    this.ui.retry.addEventListener('click', () => location.reload())
    this.guideActive = this.fixture === 'guide' || (!this.fixture && this.save.guidePending)
    if (this.guideActive) this.startGuideStory()
    else this.setStoryNode(storyNodeForNewRun(false))
    if (this.fixture === 'choice') this.forceChoice()
    this.updateMeta()
    this.updateStatus()
  }

  canPounce(player: THREE.Vector3, running: boolean, heading: number) {
    if (!running || !this.rabbit.catchable || this.phase !== 'chase') return false
    const toRabbit = this.rabbit.position.clone().sub(player).setY(0)
    const d = toRabbit.length()
    if (d > 2.7 || d < 0.25) return false
    toRabbit.normalize()
    const forward = new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading))
    return forward.dot(toRabbit) > 0.42
  }

  resolvePlayerCollision(player: THREE.Vector3, previous: THREE.Vector3) {
    const resolved = this.collision.resolveMovement(previous, player, 0.52, false)
    player.set(resolved.x, 0, resolved.z)
  }

  update(
    dt: number,
    player: THREE.Vector3,
    dogSpeed: number,
    dogHeading: number,
    radius: number,
    sniff: number,
    barkPulse: boolean,
    pounceActive: boolean
  ) {
    if (this.phase === 'choice' || this.phase === 'resolved' || this.phase === 'guided') return
    this.elapsed += dt
    const rabbit = this.rabbit.update(dt, player, dogSpeed, dogHeading, radius, barkPulse)
    this.scent.update(dt, this.rabbit.position, !this.rabbit.terminal)
    this.levelView.update(sniff, this.guideActive, this.elapsed)

    if (this.guideActive) {
      this.burrow.update(0, false, false)
      if (rabbit.state === 'guiding') this.emit('guideMoving')
      else if (rabbit.state === 'waiting') this.emit('guideWaiting')
      else if (rabbit.state === 'guided') this.showGuideComplete()
      this.updateStatus()
      return
    }

    this.burrow.update(sniff, rabbit.distanceToBurrow < 6, rabbit.state === 'escaped')
    if (this.phase === 'search' && sniff > 0.25) this.emit('sniff')
    if ((rabbit.state === 'fleeing' || rabbit.state === 'juking' || rabbit.state === 'burrowing') && this.phase !== 'escaped') {
      this.emit('rabbitFleeing')
    }

    this.pounceReady = this.canPounce(player, dogSpeed > 4.5, dogHeading)
    if (!pounceActive) this.hitConsumed = false
    if (pounceActive && !this.hitConsumed && this.rabbit.catchable && rabbit.distanceToDog < 0.95) {
      this.hitConsumed = true
      if (this.rabbit.catch()) this.showChoice()
    }

    if (rabbit.state === 'escaped' && this.phase !== 'escaped') {
      this.save.escaped++
      saveHunt(this.save)
      this.showEscape()
    }
    this.updateStatus()
  }

  snapshot(): HuntSnapshot {
    return {
      phase: this.phase,
      storyNode: this.storyNode,
      rabbit: this.rabbit.snapshot(),
      save: { ...this.save },
      seed: this.seed,
      canPounce: this.pounceReady,
      level: {
        id: this.level.id,
        valid: this.validation.valid,
        errors: [...this.validation.errors],
        rabbitRoute: this.validation.rabbitRoute,
        guideRoute: this.validation.guideRoute,
      },
    }
  }

  clearSave() {
    clearHuntSave()
    this.save = loadHuntSave()
    this.updateMeta()
  }

  forceRabbitNear(player: THREE.Vector3) {
    this.guideActive = false
    this.burrow.moveTo(player.clone().add(new THREE.Vector3(0, 0, -30)))
    this.rabbit.forceFleeingAt(player.clone().add(new THREE.Vector3(0, 0, -2.1)))
    this.setStoryNode('hunt.chase')
  }

  forceGuideNear(player: THREE.Vector3) {
    this.guideActive = true
    this.rabbit.startGuideAt(
      player.clone().add(new THREE.Vector3(0, 0, -3.2)),
      new THREE.Vector3(this.level.guideTarget.x, 0, this.level.guideTarget.z)
    )
    this.setStoryNode('bond.reunion')
  }

  forceGuideComplete(player: THREE.Vector3) {
    this.guideActive = true
    const target = new THREE.Vector3(this.level.guideTarget.x, 0, this.level.guideTarget.z)
    player.copy(target).add(new THREE.Vector3(0, 0, 1.6))
    this.rabbit.startGuideAt(target.clone().add(new THREE.Vector3(0, 0, 0.35)), target)
    this.setStoryNode('bond.guiding')
  }

  private startGuideStory() {
    const start = new THREE.Vector3(-1.8, 0, -6.2)
    const target = new THREE.Vector3(this.level.guideTarget.x, 0, this.level.guideTarget.z)
    this.rabbit.startGuideAt(start, target)
    this.setStoryNode('bond.reunion')
  }

  private forceChoice() {
    this.guideActive = false
    this.rabbit.forceCaught()
    this.setStoryNode('hunt.choice')
  }

  private showChoice() {
    this.pounceReady = false
    this.emit('rabbitCaught')
  }

  private showEscape() {
    this.pounceReady = false
    this.emit('rabbitEscaped')
    this.updateMeta()
  }

  private showGuideComplete() {
    if (this.phase === 'guided') return
    this.save.guidePending = false
    this.save.markedRabbit = true
    this.save.reunions++
    saveHunt(this.save)
    this.emit('guideComplete')
    this.updateMeta()
  }

  private choose(choice: 'take' | 'release') {
    if (this.phase !== 'choice') return
    this.save.lastChoice = choice
    if (choice === 'take') {
      this.save.caught++
      this.onEnergy(28)
      this.rabbit.hide()
    } else {
      this.save.released++
      this.save.markedRabbit = true
      this.save.guidePending = true
      this.rabbit.hide()
    }
    saveHunt(this.save)
    this.pounceReady = false
    this.emit(choice)
    this.updateMeta()
    this.updateStatus()
  }

  private updateStatus() {
    const rabbit = this.rabbit.snapshot()
    this.ui.status.textContent = STORY_NODES[this.storyNode].status({
      threat: rabbit.threat,
      distanceToBurrow: rabbit.distanceToBurrow,
      canPounce: this.pounceReady,
    })
    this.ui.objective.textContent = STORY_NODES[this.storyNode].objective
  }

  private updateMeta() {
    const bond = this.save.markedRabbit ? ` · 羁绊 ${this.save.reunions + 1}` : ''
    this.ui.meta.textContent = `带走 ${this.save.caught} · 放生 ${this.save.released} · 逃脱 ${this.save.escaped}${bond}`
  }

  private emit(event: StoryEvent) {
    const next = transitionStory(this.storyNode, event)
    if (next !== this.storyNode) this.setStoryNode(next)
  }

  private setStoryNode(id: StoryNodeId) {
    this.storyNode = id
    const node = STORY_NODES[id]
    this.phase = node.phase
    if (!node.panel) {
      this.ui.panel.classList.remove('visible')
      this.updateStatus()
      return
    }
    this.ui.panelTitle.textContent = node.panel.title
    this.ui.panelText.textContent = node.panel.text
    this.ui.take.textContent = ACTION_LABELS.take
    this.ui.release.textContent = ACTION_LABELS.release
    this.ui.retry.textContent = node.panel.retryLabel ?? ACTION_LABELS.retry
    this.ui.take.hidden = !node.panel.actions.includes('take')
    this.ui.release.hidden = !node.panel.actions.includes('release')
    this.ui.retry.hidden = !node.panel.actions.includes('retry')
    this.ui.panel.classList.add('visible')
    const firstAction = node.panel.actions[0]
    if (firstAction === 'take') this.ui.take.focus()
    else if (firstAction === 'release') this.ui.release.focus()
    else this.ui.retry.focus()
    this.updateStatus()
  }

  dispose() {
    this.rabbit.dispose()
    this.burrow.dispose(this.scene)
    this.scent.dispose(this.scene)
    this.levelView.dispose()
  }
}
