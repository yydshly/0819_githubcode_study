import * as THREE from 'three'
import './styles.css'
import { InteractionField } from './interaction-field'
import { Environment, terrainHeight, TREE_POSITION } from './environment'
import { ProceduralSnake, type ExperimentMode } from './procedural-snake'

const modeContent: Record<ExperimentMode, { number: string; title: string; description: string }> = {
  ground: { number: 'MODE 01', title: '地面蜿蜒', description: '头部生成 S 曲线，身体按弧长查询历史轨迹。' },
  climb: { number: 'MODE 02', title: '曲面攀爬', description: '移动方向沿曲面切平面传播，法线决定身体截面朝向。' },
  field: { number: 'MODE 03', title: '交互场', description: '蛇身写入可衰减纹理，草叶读取强度与梯度产生倒伏。' },
  anatomy: { number: 'MODE 04', title: '结构解剖', description: '显示等弧长轨迹，以及切线、横向轴和上方向组成的局部标架。' },
}

const $ = <T extends HTMLElement>(selector: string) => {
  const element = document.querySelector<T>(selector)
  if (!element) throw new Error(`Missing element: ${selector}`)
  return element
}

const sceneRoot = $('#scene-root')
const fallback = $('#webgl-fallback')
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
let renderer: THREE.WebGLRenderer | null = null

try {
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.35 : 1.8))
  renderer.setSize(innerWidth, innerHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.06
  renderer.outputColorSpace = THREE.SRGBColorSpace
  sceneRoot.append(renderer.domElement)
} catch (error) {
  console.error(error)
  fallback.hidden = false
  document.body.classList.add('webgl-unavailable')
}

if (renderer) startLab(renderer)
else {
  $('#fallback-notes').addEventListener('click', () => {
    fallback.hidden = true
    document.body.classList.add('fallback-notes-mode')
    const panel = $('#research-panel')
    panel.classList.add('is-open')
    panel.setAttribute('aria-hidden', 'false')
    panel.querySelectorAll<HTMLElement>('[role="tabpanel"]').forEach((section) => { section.hidden = false })
    $('#research-close').focus()
  })
}

function startLab(renderer: THREE.WebGLRenderer) {
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x7e9278)
scene.fog = new THREE.FogExp2(0x7e9278, 0.028)

const camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 0.06, 150)
camera.position.set(6, 5, -8)

const sun = new THREE.DirectionalLight(0xffedc4, 2.7)
sun.position.set(18, 28, -12)
scene.add(sun)
scene.add(new THREE.HemisphereLight(0xcfe3d3, 0x192415, 1.45))

const field = new InteractionField(256, 70)
const environment = new Environment(field)
scene.add(environment.group)

const snake = new ProceduralSnake(terrainHeight)
scene.add(snake.group)

const keys = new Set<string>()
let activeMode: ExperimentMode = 'ground'
let paused = reducedMotion
let cameraYaw = -0.45
let cameraPitch = 0.46
let cameraDistance = 8.6
let dragging = false
let lastPointerX = 0
let lastPointerY = 0
const cameraTarget = new THREE.Vector3()
const desiredCamera = new THREE.Vector3()
const clock = new THREE.Clock()
let frameCount = 0
let fpsTimer = 0

const runtimeLabel = $('#runtime-label')
const fpsValue = $('#fps-value')
const sampleValue = $('#sample-value')
const pauseButton = $('#pause-button') as HTMLButtonElement
const modeNumber = $('#mode-number')
const modeTitle = $('#mode-title')
const modeDescription = $('#mode-description')
const pathToggle = $('#path-toggle') as HTMLInputElement
const framesToggle = $('#frames-toggle') as HTMLInputElement
const fieldToggle = $('#field-toggle') as HTMLInputElement

function updatePauseUi() {
  document.body.classList.toggle('is-paused', paused)
  pauseButton.setAttribute('aria-pressed', String(paused))
  pauseButton.querySelector('[aria-hidden]')!.textContent = paused ? '▶' : 'Ⅱ'
  pauseButton.querySelector('.button-label')!.textContent = paused ? '运行' : '暂停'
  runtimeLabel.textContent = paused ? '已暂停' : '实时运行'
}

function applyDebugVisibility() {
  snake.setDebug(pathToggle.checked || activeMode === 'anatomy', framesToggle.checked || activeMode === 'anatomy')
  environment.setMode(activeMode, fieldToggle.checked)
}

function setMode(mode: ExperimentMode) {
  activeMode = mode
  snake.setMode(mode)
  const content = modeContent[mode]
  modeNumber.textContent = content.number
  modeTitle.textContent = content.title
  modeDescription.textContent = content.description

  document.querySelectorAll<HTMLButtonElement>('.mode-button').forEach((button) => {
    const selected = button.dataset.mode === mode
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-pressed', String(selected))
  })

  if (mode === 'anatomy') {
    pathToggle.checked = true
    framesToggle.checked = true
  }
  if (mode === 'field') fieldToggle.checked = true
  applyDebugVisibility()

  if (mode === 'climb') {
    cameraYaw = -0.7
    cameraPitch = 0.35
    cameraDistance = 10.5
    cameraTarget.set(TREE_POSITION.x, 3.5, TREE_POSITION.z)
  } else if (mode === 'field') {
    cameraPitch = 0.92
    cameraDistance = 13
  } else {
    cameraPitch = 0.46
    cameraDistance = 8.6
  }
}

pauseButton.addEventListener('click', () => {
  paused = !paused
  updatePauseUi()
})

document.querySelectorAll<HTMLButtonElement>('.mode-button').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode as ExperimentMode))
})

for (const toggle of [pathToggle, framesToggle, fieldToggle]) toggle.addEventListener('change', applyDebugVisibility)

const ranges = [
  { selector: '#amplitude-range', output: '#amplitude-output', key: 'amplitude' as const, format: (value: number) => value.toFixed(2) },
  { selector: '#wavelength-range', output: '#wavelength-output', key: 'wavelength' as const, format: (value: number) => `${value.toFixed(1)}m` },
  { selector: '#speed-range', output: '#speed-output', key: 'speed' as const, format: (value: number) => `${value.toFixed(1)}m/s` },
  { selector: '#radius-range', output: '#radius-output', key: 'radiusScale' as const, format: (value: number) => `${value.toFixed(2)}×` },
]

for (const binding of ranges) {
  const input = $(binding.selector) as HTMLInputElement
  const output = $(binding.output) as HTMLOutputElement
  input.addEventListener('input', () => {
    const value = Number(input.value)
    snake.parameters[binding.key] = value
    output.value = binding.format(value)
  })
}

addEventListener('keydown', (event) => {
  if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(event.code)) {
    event.preventDefault()
    keys.add(event.code)
  }
  if (event.code === 'Space' && event.target === document.body) {
    event.preventDefault()
    paused = !paused
    updatePauseUi()
  }
})
addEventListener('keyup', (event) => keys.delete(event.code))
addEventListener('blur', () => keys.clear())

document.querySelectorAll<HTMLButtonElement>('.touch-controls button').forEach((button) => {
  const code = button.dataset.key!
  const release = () => {
    keys.delete(code)
    button.classList.remove('is-held')
  }
  button.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    button.setPointerCapture(event.pointerId)
    keys.add(code)
    button.classList.add('is-held')
  })
  button.addEventListener('pointerup', release)
  button.addEventListener('pointercancel', release)
})

renderer.domElement.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' && innerWidth < 760) return
  dragging = true
  lastPointerX = event.clientX
  lastPointerY = event.clientY
  renderer.domElement.setPointerCapture(event.pointerId)
})
renderer.domElement.addEventListener('pointermove', (event) => {
  if (!dragging) return
  cameraYaw -= (event.clientX - lastPointerX) * 0.005
  cameraPitch = THREE.MathUtils.clamp(cameraPitch + (event.clientY - lastPointerY) * 0.004, 0.15, 1.18)
  lastPointerX = event.clientX
  lastPointerY = event.clientY
})
renderer.domElement.addEventListener('pointerup', () => { dragging = false })
renderer.domElement.addEventListener('pointercancel', () => { dragging = false })
renderer.domElement.addEventListener('wheel', (event) => {
  cameraDistance = THREE.MathUtils.clamp(cameraDistance + event.deltaY * 0.008, 4, 17)
}, { passive: true })

function updateCamera(dt: number) {
  const target = activeMode === 'climb'
    ? new THREE.Vector3(TREE_POSITION.x, THREE.MathUtils.clamp(snake.headPosition.y, 2.6, 5.2), TREE_POSITION.z)
    : snake.headPosition
  cameraTarget.lerp(target, 1 - Math.exp(-dt * 4.5))

  const horizontal = Math.cos(cameraPitch) * cameraDistance
  desiredCamera.set(
    cameraTarget.x + Math.sin(cameraYaw) * horizontal,
    cameraTarget.y + Math.sin(cameraPitch) * cameraDistance + 0.6,
    cameraTarget.z + Math.cos(cameraYaw) * horizontal,
  )
  const minimumHeight = terrainHeight(desiredCamera.x, desiredCamera.z) + 0.6
  desiredCamera.y = Math.max(desiredCamera.y, minimumHeight)
  camera.position.lerp(desiredCamera, 1 - Math.exp(-dt * 5))
  camera.lookAt(cameraTarget)
}

const researchPanel = $('#research-panel')
const researchToggle = $('#research-toggle') as HTMLButtonElement
const researchClose = $('#research-close') as HTMLButtonElement
const drawerBackdrop = $('#drawer-backdrop')
let researchReturnFocus: HTMLElement | null = null

function usesOverlayPanel() {
  return innerWidth <= 1120
}

function openResearch() {
  if (!usesOverlayPanel()) return
  researchReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : researchToggle
  researchPanel.classList.add('is-open')
  researchPanel.setAttribute('aria-hidden', 'false')
  researchToggle.setAttribute('aria-expanded', 'true')
  drawerBackdrop.hidden = false
  researchClose.focus()
}

function closeResearch() {
  if (!usesOverlayPanel()) return
  researchPanel.classList.remove('is-open')
  researchPanel.setAttribute('aria-hidden', 'true')
  researchToggle.setAttribute('aria-expanded', 'false')
  drawerBackdrop.hidden = true
  researchReturnFocus?.focus()
}

function syncPanelLayout() {
  if (usesOverlayPanel()) {
    if (!researchPanel.classList.contains('is-open')) researchPanel.setAttribute('aria-hidden', 'true')
  } else {
    researchPanel.classList.remove('is-open')
    researchPanel.setAttribute('aria-hidden', 'false')
    researchToggle.setAttribute('aria-expanded', 'false')
    drawerBackdrop.hidden = true
  }
}

researchToggle.addEventListener('click', () => researchPanel.classList.contains('is-open') ? closeResearch() : openResearch())
researchClose.addEventListener('click', closeResearch)
drawerBackdrop.addEventListener('click', closeResearch)

addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && researchPanel.classList.contains('is-open')) closeResearch()
  if (event.key === 'Tab' && researchPanel.classList.contains('is-open')) {
    const focusable = [...researchPanel.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex]:not([tabindex="-1"])')].filter((element) => !element.hasAttribute('hidden'))
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
})

const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
function activateTab(tab: HTMLButtonElement) {
  tabs.forEach((candidate) => {
    const selected = candidate === tab
    candidate.setAttribute('aria-selected', String(selected))
    candidate.tabIndex = selected ? 0 : -1
    const panel = document.getElementById(candidate.getAttribute('aria-controls')!)
    if (panel) panel.hidden = !selected
  })
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab))
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let nextIndex = index
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    activateTab(tabs[nextIndex])
    tabs[nextIndex].focus()
  })
})

$('#fallback-notes').addEventListener('click', () => {
  fallback.hidden = true
  openResearch()
})

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.35 : 1.8))
  renderer.setSize(innerWidth, innerHeight)
  syncPanelLayout()
})

function loop() {
  requestAnimationFrame(loop)
  const dt = Math.min(clock.getDelta(), 0.05)
  const time = clock.elapsedTime

  if (!paused) {
    const turn = (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) - (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0)
    const forward = keys.has('KeyW') || keys.has('ArrowUp')
    snake.update(dt, { turn, forward })
    field.update(dt, snake.getStamps())
  }

  updateCamera(dt)
  environment.update(time, camera.position)
  renderer.render(scene, camera)

  frameCount++
  fpsTimer += dt
  if (fpsTimer >= 0.5) {
    fpsValue.textContent = String(Math.round(frameCount / fpsTimer))
    sampleValue.textContent = String(snake.history.count)
    frameCount = 0
    fpsTimer = 0
  }
}

updatePauseUi()
syncPanelLayout()
setMode('ground')
loop()
}
