export interface HuntSave {
  caught: number
  released: number
  escaped: number
  lastChoice: 'take' | 'release' | null
  markedRabbit: boolean
  guidePending: boolean
  reunions: number
}

const KEY = 'lineworld-night-hunt-v1'

export function loadHuntSave(): HuntSave {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptySave()
    const parsed = JSON.parse(raw) as Partial<HuntSave>
    return {
      caught: Number(parsed.caught) || 0,
      released: Number(parsed.released) || 0,
      escaped: Number(parsed.escaped) || 0,
      lastChoice: parsed.lastChoice === 'take' || parsed.lastChoice === 'release' ? parsed.lastChoice : null,
      markedRabbit: parsed.markedRabbit === true,
      guidePending: parsed.guidePending === true,
      reunions: Number(parsed.reunions) || 0,
    }
  } catch {
    return emptySave()
  }
}

function emptySave(): HuntSave {
  return {
    caught: 0,
    released: 0,
    escaped: 0,
    lastChoice: null,
    markedRabbit: false,
    guidePending: false,
    reunions: 0,
  }
}

export function saveHunt(state: HuntSave) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function clearHuntSave() {
  localStorage.removeItem(KEY)
}
