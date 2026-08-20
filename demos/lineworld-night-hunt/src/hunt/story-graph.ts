export type HuntPhase = 'search' | 'stalk' | 'chase' | 'choice' | 'escaped' | 'resolved' | 'reunion' | 'guiding' | 'guided'

export type StoryNodeId =
  | 'hunt.search'
  | 'hunt.stalk'
  | 'hunt.chase'
  | 'hunt.choice'
  | 'hunt.escaped'
  | 'hunt.resolved.take'
  | 'hunt.resolved.release'
  | 'bond.reunion'
  | 'bond.guiding'
  | 'bond.guided'

export type StoryEvent =
  | 'sniff'
  | 'rabbitFleeing'
  | 'rabbitCaught'
  | 'rabbitEscaped'
  | 'take'
  | 'release'
  | 'guideMoving'
  | 'guideWaiting'
  | 'guideComplete'

export type StoryAction = 'take' | 'release' | 'retry'

export interface StoryStatusContext {
  threat: number
  distanceToBurrow: number
  canPounce: boolean
}

export interface StoryPanel {
  title: string
  text: string
  actions: StoryAction[]
  retryLabel?: string
}

export interface StoryNode {
  id: StoryNodeId
  phase: HuntPhase
  purpose: '追踪' | '潜近' | '追逐' | '抉择' | '结果' | '关系' | '引路' | '目标'
  objective: string
  status: (context: StoryStatusContext) => string
  transitions: Partial<Record<StoryEvent, StoryNodeId>>
  panel?: StoryPanel
}

export const ACTION_LABELS = {
  take: '带走 · 恢复灯火',
  release: '放生 · 保留记忆',
  retry: '再次追踪',
} as const

export const STORY_NODES: Record<StoryNodeId, StoryNode> = {
  'hunt.search': {
    id: 'hunt.search',
    phase: 'search',
    purpose: '追踪',
    objective: '按住 Q 嗅闻，让气味轨迹显现；沿着发光轨迹寻找白兔。',
    status: () => '按住 Q · 寻找气味',
    transitions: { sniff: 'hunt.stalk', rabbitFleeing: 'hunt.chase' },
  },
  'hunt.stalk': {
    id: 'hunt.stalk',
    phase: 'stalk',
    purpose: '潜近',
    objective: '继续沿气味靠近。慢走更安静；吠叫会立刻惊动白兔。',
    status: ({ threat }) => `谨慎潜近 · 警觉 ${Math.round(threat * 100)}%`,
    transitions: { rabbitFleeing: 'hunt.chase' },
  },
  'hunt.chase': {
    id: 'hunt.chase',
    phase: 'chase',
    purpose: '追逐',
    objective: '按住 Shift 奔跑追赶；贴近并面向白兔时，按空格扑击。',
    status: ({ canPounce, distanceToBurrow }) => canPounce
      ? '按下空格 · 扑击'
      : `追逐白兔 · 距兔洞 ${distanceToBurrow.toFixed(1)} 米`,
    transitions: { rabbitCaught: 'hunt.choice', rabbitEscaped: 'hunt.escaped' },
  },
  'hunt.choice': {
    id: 'hunt.choice',
    phase: 'choice',
    purpose: '抉择',
    objective: '选择带走白兔恢复灯火，或放生它保留这段记忆。',
    status: () => '这场狩猎，由你决定结局',
    transitions: { take: 'hunt.resolved.take', release: 'hunt.resolved.release' },
    panel: {
      title: '白兔',
      text: '它的毛发间，缠着一小片从主人围巾上撕落的布条。',
      actions: ['take', 'release'],
    },
  },
  'hunt.escaped': {
    id: 'hunt.escaped',
    phase: 'escaped',
    purpose: '结果',
    objective: '白兔已经逃入洞中。选择“再次追踪”开始新一夜。',
    status: () => '白兔逃脱了',
    transitions: {},
    panel: {
      title: '兔洞合拢',
      text: '气味消失在漆黑的洞口。今晚的追迹结束了，但森林仍会留下新的线索。',
      actions: ['retry'],
      retryLabel: '再次追踪',
    },
  },
  'hunt.resolved.take': {
    id: 'hunt.resolved.take',
    phase: 'resolved',
    purpose: '结果',
    objective: '灯火已经恢复。选择“再度狩猎”重新开始。',
    status: () => '森林记住了你的选择',
    transitions: {},
    panel: {
      title: '灯火更亮了',
      text: '你带走了白兔。灯笼重新明亮，森林却比刚才更加安静。',
      actions: ['retry'],
      retryLabel: '再度狩猎',
    },
  },
  'hunt.resolved.release': {
    id: 'hunt.resolved.release',
    phase: 'resolved',
    purpose: '结果',
    objective: '你的放生会改变下一局。选择“前往下一夜”继续。',
    status: () => '森林记住了你的善意',
    transitions: {},
    panel: {
      title: '白兔离开了',
      text: '白兔带着围巾布条消失在线条深处。前方某处，它会记得你的放生。',
      actions: ['retry'],
      retryLabel: '前往下一夜',
    },
  },
  'bond.reunion': {
    id: 'bond.reunion',
    phase: 'reunion',
    purpose: '关系',
    objective: '靠近那只白兔。它不会再逃跑，而是在等待你跟上。',
    status: () => '那只白兔还记得你',
    transitions: { guideMoving: 'bond.guiding', guideComplete: 'bond.guided' },
  },
  'bond.guiding': {
    id: 'bond.guiding',
    phase: 'guiding',
    purpose: '引路',
    objective: '跟紧白兔；如果距离太远，它会停下来等待。',
    status: () => '跟随白兔 · 它知道围巾的线索',
    transitions: { guideWaiting: 'bond.reunion', guideComplete: 'bond.guided' },
  },
  'bond.guided': {
    id: 'bond.guided',
    phase: 'guided',
    purpose: '目标',
    objective: '你找到了主人留下的新线索。选择“继续追寻”开始下一段旅程。',
    status: () => '新的追踪线索已经开启',
    transitions: {},
    panel: {
      title: '围巾仍记得',
      text: '白兔把你带到一片古老空地。螺旋印记之下，埋着主人留下的下一段踪迹。',
      actions: ['retry'],
      retryLabel: '继续追寻',
    },
  },
}

export function transitionStory(current: StoryNodeId, event: StoryEvent): StoryNodeId {
  return STORY_NODES[current].transitions[event] ?? current
}

export function storyNodeForNewRun(guidePending: boolean): StoryNodeId {
  return guidePending ? 'bond.reunion' : 'hunt.search'
}
