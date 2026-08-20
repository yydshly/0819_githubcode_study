const TUTORIAL_KEY = 'lineworld-night-hunt-tutorial-v1'

export function initTutorial() {
  const overlay = document.getElementById('tutorial-panel')!
  const openButton = document.getElementById('tutorial-open') as HTMLButtonElement
  const closeButton = document.getElementById('tutorial-close') as HTMLButtonElement
  const params = new URLSearchParams(location.search)

  const open = () => {
    overlay.classList.add('visible')
    closeButton.focus()
  }
  const close = () => {
    overlay.classList.remove('visible')
    try { sessionStorage.setItem(TUTORIAL_KEY, 'seen') } catch { /* storage may be unavailable */ }
    openButton.focus()
  }

  openButton.addEventListener('click', open)
  closeButton.addEventListener('click', close)
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close()
  })
  window.addEventListener('keydown', (event) => {
    if (event.code === 'Escape' && overlay.classList.contains('visible')) close()
  })

  let seen = false
  try { seen = sessionStorage.getItem(TUTORIAL_KEY) === 'seen' } catch { /* storage may be unavailable */ }
  const forceTutorial = params.get('tutorial') === '1'
  const isFixture = params.has('fixture')
  if (forceTutorial || (!seen && !isFixture)) open()

  return { open, close }
}
