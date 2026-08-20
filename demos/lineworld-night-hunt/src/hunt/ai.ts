export type RabbitState =
  | 'calm'
  | 'listening'
  | 'alert'
  | 'fleeing'
  | 'juking'
  | 'burrowing'
  | 'caught'
  | 'escaped'
  | 'guiding'
  | 'waiting'
  | 'guided'

export interface Vec2 {
  x: number
  z: number
}

export interface RabbitPerception {
  distanceToDog: number
  distanceToBurrow: number
  dogSpeed: number
  dogFacing: number
  barkPulse: boolean
}

export interface RabbitDecisionContext {
  state: RabbitState
  stateTime: number
  jukeCooldown: number
  perception: RabbitPerception
}

export function threatScore(p: RabbitPerception): number {
  if (p.barkPulse) return 1
  const proximity = 1 - Math.min(Math.max((p.distanceToDog - 2.5) / 11, 0), 1)
  const sound = Math.min(p.dogSpeed / 6, 1) * (1 - Math.min(p.distanceToDog / 15, 1))
  const sight = Math.max(0, p.dogFacing) * (1 - Math.min(p.distanceToDog / 12, 1))
  return Math.min(1, proximity * 0.5 + sound * 0.32 + sight * 0.18)
}

export function decideRabbitState(ctx: RabbitDecisionContext): RabbitState {
  const { state, stateTime, jukeCooldown, perception: p } = ctx
  if (state === 'caught' || state === 'escaped' || state === 'guiding' || state === 'waiting' || state === 'guided') return state
  if (p.distanceToBurrow < 1.1 && (state === 'fleeing' || state === 'juking')) {
    return 'burrowing'
  }

  const threat = threatScore(p)
  switch (state) {
    case 'calm':
      return threat > 0.28 ? 'listening' : 'calm'
    case 'listening':
      if (stateTime >= 0.22 && (threat > 0.52 || p.distanceToDog < 6.2)) return 'alert'
      if (stateTime >= 0.85 && threat < 0.16) return 'calm'
      return 'listening'
    case 'alert':
      return stateTime >= 0.34 ? 'fleeing' : 'alert'
    case 'fleeing':
      if (p.distanceToDog < 2.6 && jukeCooldown <= 0 && stateTime >= 0.32) return 'juking'
      return 'fleeing'
    case 'juking':
      return stateTime >= 0.34 ? 'fleeing' : 'juking'
    case 'burrowing':
      return stateTime >= 0.42 ? 'escaped' : 'burrowing'
  }
}

function normalized(v: Vec2): Vec2 {
  const len = Math.hypot(v.x, v.z)
  if (len < 1e-5) return { x: 0, z: -1 }
  return { x: v.x / len, z: v.z / len }
}

export function selectFleeDirection(
  rabbit: Vec2,
  dog: Vec2,
  burrow: Vec2,
  state: RabbitState,
  jukeSign: number,
  pressure = 1
): Vec2 {
  const away = normalized({ x: rabbit.x - dog.x, z: rabbit.z - dog.z })
  const home = normalized({ x: burrow.x - rabbit.x, z: burrow.z - rabbit.z })
  const side = { x: -away.z * jukeSign, z: away.x * jukeSign }
  pressure = Math.min(Math.max(pressure, 0), 1)
  const awayWeight = 0.24 + pressure * 0.34
  const homeWeight = 0.68 - pressure * 0.26
  const jukeWeight = state === 'juking' ? 0.82 : 0.05
  const result = {
    x: away.x * awayWeight + home.x * homeWeight + side.x * jukeWeight,
    z: away.z * awayWeight + home.z * homeWeight + side.z * jukeWeight,
  }
  return normalized(result)
}
