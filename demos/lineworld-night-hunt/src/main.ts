import * as THREE from 'three'
import { Character } from './character'
import { World } from './world'
import { updateGrassUniforms } from './grass'
import { makeStars, makeDust, makeFireflies, BarkRings, Dirt } from './fx'
import { Critters } from './critters'
import { Vignettes } from './vignette'
import { Ghosts } from './ghost'
import { updateScentUniforms } from './scent'
import type { BuriedSpot } from './world'
import { audio } from './audio'
import { HuntDirector } from './hunt/hunt-director'
import { initTutorial } from './hunt/tutorial'

const clamp = (x: number, a: number, b: number) => Math.min(Math.max(x, a), b)

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.debug.onShaderError = (gl, _program, vs, fs) => {
  console.error('着色器错误', gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs))
  document.getElementById('shader-error')!.style.display = 'block'
}
document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)
const fog = new THREE.Fog(0x000000, 2, 48)
scene.fog = fog

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 600)

const character = new Character(scene)
const world = new World(scene)
scene.add(makeStars())
const dust = makeDust()
scene.add(dust.points)
const fireflies = makeFireflies()
scene.add(fireflies.points)
const critters = new Critters(scene, false)
const vignettes = new Vignettes(scene)
const ghosts = new Ghosts(scene, document.getElementById('memoryline')!)
const barkRings = new BarkRings(scene)
const dirt = new Dirt(scene)

// --- input ---
const keys = new Set<string>()
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') e.preventDefault()
  keys.add(e.code)
  audio.ensure()
})
window.addEventListener('pointerdown', () => audio.ensure())
window.addEventListener('keyup', (e) => keys.delete(e.code))

let yaw = 0
let pitch = 0.3
let dist = 7
let dragging = false
let lastX = 0
let lastY = 0
window.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY })
window.addEventListener('pointermove', (e) => {
  if (!dragging) return
  yaw -= (e.clientX - lastX) * 0.005
  pitch = clamp(pitch + (e.clientY - lastY) * 0.004, 0.06, 1.15)
  lastX = e.clientX
  lastY = e.clientY
})
window.addEventListener('pointerup', () => { dragging = false })
window.addEventListener('wheel', (e) => { dist = clamp(dist + e.deltaY * 0.008, 3.5, 12) })
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  world.setResolution(window.innerWidth, window.innerHeight)
})

// --- HUD ---
const fill = document.getElementById('fill')!
const memEl = document.getElementById('memento')!

// --- state ---
let energy = 65
let time = 0
let sniffB = 0
let scentLinger = 0
let barkCd = 0
let barkFlash = 0
let digT = 0
let digSpot: BuriedSpot | null = null
let mementos = 0
let wasE = false
let wasSpace = false

const hunt = new HuntDirector(scene, (delta) => {
  energy = clamp(energy + delta, 0, 100)
})
initTutorial()

type NightHuntDebug = {
  snapshot: () => ReturnType<HuntDirector['snapshot']>
  forceRabbitNear: () => void
  forceGuideNear: () => void
  forceGuideComplete: () => void
  playerPosition: () => { x: number; z: number }
  clearSave: () => void
}
;(window as typeof window & { __nightHunt?: NightHuntDebug }).__nightHunt = {
  snapshot: () => hunt.snapshot(),
  forceRabbitNear: () => hunt.forceRabbitNear(character.group.position),
  forceGuideNear: () => hunt.forceGuideNear(character.group.position),
  forceGuideComplete: () => hunt.forceGuideComplete(character.group.position),
  playerPosition: () => ({ x: character.group.position.x, z: character.group.position.z }),
  clearSave: () => hunt.clearSave(),
}

// her anıda dünya çizgileri yeni bir tona kayar; başlangıç beyaz
function paletteFor(m: number): THREE.Color {
  const c = new THREE.Color(0xffffff)
  if (m > 0) c.setHSL((0.08 + m * 0.13) % 1, 0.6, 0.72)
  return c
}

function collectMemory(count = 1) {
  mementos += count
  memEl.textContent = `✦ ${mementos}`
  world.setTint(paletteFor(mementos))
}
const clock = new THREE.Clock()
const camPos = new THREE.Vector3(0, 3, 8)
const lookTarget = new THREE.Vector3()
const moveDir = new THREE.Vector3()
const forward = new THREE.Vector3()
const right = new THREE.Vector3()
const previousDogPosition = new THREE.Vector3()

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05)
  time += dt

  // kamera-göreli hareket
  forward.set(-Math.sin(yaw), 0, -Math.cos(yaw))
  right.set(-forward.z, 0, forward.x)
  moveDir.set(0, 0, 0)
  if (keys.has('KeyW') || keys.has('ArrowUp')) moveDir.add(forward)
  if (keys.has('KeyS') || keys.has('ArrowDown')) moveDir.sub(forward)
  if (keys.has('KeyD') || keys.has('ArrowRight')) moveDir.add(right)
  if (keys.has('KeyA') || keys.has('ArrowLeft')) moveDir.sub(right)
  if (moveDir.lengthSq() > 0) moveDir.normalize()
  const running = keys.has('ShiftLeft') || keys.has('ShiftRight')
  const pos = character.group.position
  let barkPulse = false

  // koklama (Q basılı) — bırakınca koku 7.5 sn asılı kalır, sonra yumuşak söner
  const sniffing = keys.has('KeyQ') && digT <= 0
  if (sniffing) scentLinger = 7.5
  else scentLinger = Math.max(0, scentLinger - dt)
  const scentVis = sniffing || scentLinger > 0 ? 1 : 0
  sniffB += (scentVis - sniffB) * (1 - Math.exp(-(scentVis ? 8 : 1.5) * dt))

  // havlama (F): dünyayı flash'lar, sisi geriye iter, yakındaki anıtları uyandırır
  barkCd -= dt
  barkFlash = Math.max(0, barkFlash - dt)
  if (keys.has('KeyF') && barkCd <= 0) {
    barkCd = 1.4
    barkFlash = 2.6
    character.bark()
    audio.bark()
    const awakened = world.bark(pos, time)
    if (awakened.length > 0) {
      collectMemory(awakened.length)
      audio.memoryTone()
    }
    for (const a of awakened) ghosts.spawn(a, pos)
    critters.bark(pos)
    barkRings.spawn(pos)
    barkPulse = true
  }

  // kazı (E: iz sonundaki noktada)
  const ePressed = keys.has('KeyE')
  if (ePressed && !wasE && digT <= 0) {
    const s = world.findDigSpot(pos)
    if (s) { digT = 1.8; digSpot = s }
  }
  wasE = ePressed
  if (digT > 0) {
    digT -= dt
    moveDir.set(0, 0, 0)
    const back = new THREE.Vector3(-Math.sin(character.heading), 0, -Math.cos(character.heading))
    if (Math.random() < dt * 9) {
      dirt.spawn(new THREE.Vector3(pos.x - back.x * 0.35, 0, pos.z - back.z * 0.35), back)
    }
    if (digT <= 0 && digSpot) {
      const kind = world.completeDig(digSpot)
      const vpos = new THREE.Vector3(digSpot.wx, 0.8, digSpot.wz)
      collectMemory()
      if (kind === 'kemik') {
        energy = clamp(energy + 18, 0, 100)
        vignettes.spawn('kemik', vpos, camera.position)
        audio.boneFind()
      } else {
        vignettes.spawn('shard', vpos, camera.position)
        audio.shardFind()
      }
      digSpot = null
    }
  }

  const spaceDown = keys.has('Space')
  const spacePressed = spaceDown && !wasSpace
  const pounceRequested = spacePressed && digT <= 0 && hunt.canPounce(pos, running, character.heading)
  previousDogPosition.copy(pos)
  character.update(dt, moveDir, running, energy, spaceDown && !pounceRequested, sniffing, digT > 0, pounceRequested)
  hunt.resolvePlayerCollision(pos, previousDogPosition)
  wasSpace = spaceDown

  const dogSpeed = character.isPouncing ? 7.4
    : moveDir.lengthSq() > 0 ? (sniffing ? 0.9 : running ? 6 : 1.7)
      : 0
  hunt.update(dt, pos, dogSpeed, character.heading, 20 + energy * 0.35, sniffB, barkPulse, character.isPouncing)

  // enerji: hareket yakar, kıvılcım doldurur
  const moving = moveDir.lengthSq() > 0
  energy -= dt * (moving ? (running ? 1.6 : 1.0) : 0.35)
  const radius = 20 + energy * 0.35
  fog.near = 2
  // havlama sisi bir anlığına geriye iter (hızlı açılır, yavaş kapanır)
  const fogPush = Math.min(1, (2.6 - barkFlash) * 6) * (barkFlash / 2.6)
  fog.far = radius * 1.6 + 6 + fogPush * 45

  const events = world.update(dt, pos, radius, time, sniffB)
  if (events.sparks > 0) energy += events.sparks * 14
  energy = clamp(energy, 0, 100)

  updateGrassUniforms(time, pos, radius, fog.near, fog.far, world.getTint())
  updateScentUniforms(time, sniffB, pos)
  dust.update(dt, pos)
  fireflies.update(time, pos)
  critters.update(dt, pos, radius, world.allPerches(), time)
  vignettes.update(dt)
  ghosts.update(dt, pos)
  barkRings.update(dt)
  dirt.update(dt)

  // kamera takibi
  const co = new THREE.Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch),
    Math.cos(yaw) * Math.cos(pitch)
  ).multiplyScalar(dist)
  co.add(pos).add(new THREE.Vector3(0, 0.9, 0))
  camPos.lerp(co, 1 - Math.exp(-8 * dt))
  camera.position.copy(camPos)
  lookTarget.copy(pos).add(new THREE.Vector3(0, 0.65, 0))
  camera.lookAt(lookTarget)

  // HUD
  fill.style.width = `${energy}%`
  fill.classList.toggle('low', energy < 22)

  renderer.render(scene, camera)
})
