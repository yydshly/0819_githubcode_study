const MODES = {
  K: {
    name: "卡点换装",
    duration: 9,
    lookCount: 5,
    points: [1.35, 3.05, 4.85, 6.85],
    positions: [
      ["left-top", "左上"],
      ["right-top", "右上"],
      ["left-bottom", "左下"],
      ["right-bottom", "右下"],
    ],
    layout: "中央大型主体 + 左上、右上、左下、右下四个轮廓贴图",
    camera: "固定正面全身机位",
    audio: "清晰重拍的卡点背景音乐，轻量转场音效",
  },
  D: {
    name: "15 秒换装舞蹈",
    duration: 15,
    lookCount: 7,
    points: [2.0, 4.1, 6.3, 8.5, 10.8, 13.0],
    positions: [
      ["left-top", "左上"],
      ["right-top", "右上"],
      ["left-mid", "左中"],
      ["right-mid", "右中"],
      ["left-bottom", "左下"],
      ["right-bottom", "右下"],
    ],
    layout: "中央全身主体 + 左右各三个完整轮廓贴图",
    camera: "固定正面全身机位，允许轻微呼吸式推近",
    audio: "15 秒卡点舞曲，仅背景音乐",
  },
};

const SUBJECTS = {
  woman: {
    label: "女性",
    route: "原创中国成年女性，视觉年龄 22–28 岁",
    anchors: "自然东亚面部特征、深色长发、匀称身形、清晰全身比例",
    chip: "FACE ID / W-01",
  },
  man: {
    label: "男性",
    route: "原创中国成年男性，视觉年龄 22–30 岁",
    anchors: "自然东亚面部特征、黑色短发、清爽无胡须、挺拔全身比例",
    chip: "FACE ID / M-01",
  },
  pet: {
    label: "宠物",
    route: "成年金色中型犬，保持真实四足解剖",
    anchors: "金色短毛、深棕眼睛、垂耳、黑色鼻头、完整尾巴与四爪",
    chip: "PET ID / P-01",
  },
};

const STYLE_LABELS = {
  urban: "都市元气",
  oriental: "东方叙事",
  lookbook: "拼贴 Lookbook",
  stage: "舞台高光",
};

const STYLE_OUTFITS = {
  woman: {
    urban: ["白衬衫学院风", "短款运动套装", "牛仔街头风", "轻熟通勤装", "甜酷黑色套装", "亮色派对装", "银白舞台装"],
    oriental: ["月白交领长衫", "雾蓝半臂襦裙", "灰粉披帛长裙", "深蓝绣纹大袖袍", "浅金神女常服", "青绿云纹礼服", "银白终场华服"],
    lookbook: ["极简白色套装", "清爽学院风", "都市轻熟风", "休闲街头风", "精致约会风", "黑金晚宴装", "银灰封面造型"],
    stage: ["黑色排练服", "亮红短夹克", "钴蓝舞台装", "金色流苏套装", "紫色高光礼服", "镜面银色套装", "白金终场造型"],
  },
  man: {
    urban: ["白衬衫学院风", "针织背心学院风", "运动夹克", "简约牛仔", "轻商务西装", "黑色舞台套装", "亮色街舞套装"],
    oriental: ["月白立领长衫", "墨蓝窄袖袍", "青灰圆领袍", "深绿束袖劲装", "黑金礼制长袍", "赤色武侠造型", "银白终场华服"],
    lookbook: ["白色基础套装", "灰调学院装", "丹宁休闲装", "机能街头装", "深色通勤装", "焦糖长风衣", "黑银封面造型"],
    stage: ["黑色排练服", "亮蓝运动套装", "红黑街舞造型", "金色演出夹克", "深紫舞台西装", "镜面银色套装", "白金终场礼服"],
  },
  pet: {
    urban: ["薄荷绿轻量领巾", "学院针织背心", "蓝色运动胸背", "短款牛仔背心", "轻薄城市斗篷", "珊瑚色胸饰", "亮色终场领结"],
    oriental: ["月白流苏领巾", "雾蓝纹样胸背", "青绿轻量小披风", "赤金节庆胸饰", "墨色云纹背心", "浅金礼仪领结", "银白终场胸饰"],
    lookbook: ["米白基础领巾", "灰蓝学院背心", "丹宁小背心", "橄榄运动胸背", "焦糖轻斗篷", "黑金精致领结", "银灰封面胸饰"],
    stage: ["黑色轻量胸背", "亮红节拍领巾", "钴蓝运动背心", "金色流苏胸饰", "紫色短斗篷", "镜面银色领结", "白金终场胸饰"],
  },
};

const PALETTES = {
  urban: ["#e8eee8", "#7ed7c4", "#4f83c2", "#b6a584", "#292e34", "#ff8f78", "#d8dfea"],
  oriental: ["#e5e4d7", "#9bb9c9", "#b89ca9", "#365873", "#cbb778", "#597a6b", "#d7dde1"],
  lookbook: ["#e8ebe6", "#9aaec2", "#6f8498", "#566b58", "#42474d", "#b17f5f", "#9aa0aa"],
  stage: ["#252a2e", "#d65449", "#3869be", "#d2a640", "#76549d", "#aab6bd", "#e1d8c3"],
};

const MECHANISMS = {
  M1: {
    label: "M1 · 完整主体飞入重合",
    hint: "侧边轮廓飞向中央并对齐，空间因果最清楚。",
    modes: ["K"],
  },
  M2: {
    label: "M2 · 长袖 / 袖摆遮镜",
    hint: "适合汉服与宽袖造型，在遮挡峰值完成换装。",
    modes: ["K"],
  },
  M8: {
    label: "M8 · 贴纸翻页",
    hint: "强化拼贴和平面设计感，轮廓贴纸向中央翻转。",
    modes: ["K"],
  },
  M10: {
    label: "M10 · 手势 / 步伐卡点",
    hint: "在拍手、落脚或转身回正的动作峰值切换服装。",
    modes: ["K", "D"],
  },
  M13: {
    label: "M13 · 侧边激活 + 舞蹈峰值",
    hint: "六个侧边造型依次清空，并在连续舞步峰值换装。",
    modes: ["D"],
  },
};

const OUTPUT_TITLES = {
  params: "参数锁定结果",
  timeline: "完整视频时间轴",
  image: "首帧图片提示词",
  video: "直接视频提示词",
  negative: "负面提示词",
};

const IMAGE_MODELS = {
  "generic-image": {
    label: "通用图像模型",
    directive: "使用清晰的自然语言描述构图、身份与材质；人物参考作为 Image 1，服装参考依次作为 Image 2–N",
  },
  "identity-image": {
    label: "身份一致性优先图像模型",
    directive: "提高人物参考权重，先锁定脸、发型、身形与站姿，再逐套替换完整服装；禁止融合不同参考图的人脸",
  },
  "layout-image": {
    label: "多主体构图优先图像模型",
    directive: "严格遵循中央主体与侧边完整轮廓的位置编号，保持所有人物版本同脸同身形，并保留安全边距",
  },
};

const VIDEO_MODELS = {
  "generic-i2v": {
    label: "通用视频模型",
    directive: "以生成后的首帧为唯一视觉锚点，使用秒级事件表描述换装顺序与运动连续性",
  },
  "identity-i2v": {
    label: "身份一致性优先视频模型",
    directive: "最大化首帧身份、服装和构图保持度；动作幅度适中，避免镜头变化引发身份漂移",
  },
  "motion-i2v": {
    label: "动作表现优先视频模型",
    directive: "用明确动作峰值触发换装，同时锁定脸、身体轴线、落脚点和衣料惯性",
  },
  "fast-i2v": {
    label: "快速预览视频模型",
    directive: "减少复杂运镜和物理效果，优先验证换装时点、顺序与侧边造型清空逻辑",
  },
};

const T2V_DIRECTIVES = {
  "generic-i2v": "按时间顺序理解同一镜头中的服装变化；不要把每套造型拆成互不相关的多个人或多个镜头",
  "identity-i2v": "反复强调同一人物的脸、发型、身形与机位不变；只允许服装在指定时间点发生变化",
  "motion-i2v": "用落脚、拍手或转身回正作为动作峰值，在峰值完成服装变化，并保持身体轴线和惯性连续",
  "fast-i2v": "使用固定机位、简单动作和清晰卡点，优先验证人物一致性、造型顺序与换装节奏",
};

const REAL_LOOKS = [
  { name: "白衬衫 · 炭灰长裙", short: "通勤基线", description: "适合作为初始身份锚点和通勤基线造型。", position: 0 },
  { name: "薄荷绿 · 运动套装", short: "轻运动", description: "以颜色和廓形的明显变化验证人物身份是否仍然稳定。", position: 25 },
  { name: "蓝色丹宁 · 街头造型", short: "丹宁街头", description: "验证同一站姿下更硬挺的牛仔材质与层次切换。", position: 50 },
  { name: "驼色西装 · 商务造型", short: "轻商务", description: "验证外套轮廓、长裤比例与商务语义的完整变化。", position: 75 },
  { name: "黑色礼服 · 夜间造型", short: "晚宴终场", description: "作为高反差终场造型，验证色调与场景语义切换。", position: 100 },
];

const ROADMAP_GOALS = [
  {
    phase: "M0–M2",
    status: "当前实验",
    tone: "current",
    title: "提示词生成换装视频",
    summary: "用 Outfit Director 把人物、服装、动作与卡点编成可执行提示词，再交给外部视频模型生成真实结果。",
    inputs: ["人物与服装要求", "参考图（I2V 可选）", "时长、节奏与转场"],
    capabilities: ["Skill 规则编排", "T2V / I2V 提示词", "换装时间轴与负面约束"],
    outputs: ["可复制的视频提示词", "外部模型生成的 MP4", "模型、参数与评估记录"],
    steps: ["生成并保存提示词", "在外部模型生成视频", "回填 MP4 与生成参数", "评估身份、服装、卡点和伪影"],
    done: "至少完成 1 个可复现的真实视频样例；只有页面预演或提示词不算完成。",
    dependency: "需要外部视频模型；当前网页不调用生成 API。",
    action: "prompt",
    actionLabel: "进入提示词实验",
  },
  {
    phase: "M3–M4",
    status: "下一阶段",
    tone: "next",
    title: "基于全身照的 2D AI 虚拟试衣",
    summary: "输入真实人物全身照与单件服装商品图，由专用虚拟试衣模型生成穿着该服装的新图片。",
    inputs: ["正面全身人物照", "平铺或模特服装图", "服装类别与遮挡信息"],
    capabilities: ["人体解析与姿态估计", "服装分割 / 形变", "VTON 扩散模型推理"],
    outputs: ["身份较稳定的试衣图", "服装保真对比", "失败案例与指标"],
    steps: ["建立人物与服装样例集", "比较开源模型或托管 API", "接入预处理和推理", "建立身份与服装保真评估"],
    done: "同一人物可切换多件真实服装，并以固定样例重复得到可评价结果。",
    dependency: "需选择专用 VTON 模型、GPU 或托管 API，并处理真实图像隐私。",
    action: "visual",
    actionLabel: "查看当前 2D 视觉原型",
  },
  {
    phase: "M5–M6",
    status: "规划中",
    tone: "planned",
    title: "3D 参数化虚拟试衣间",
    summary: "先用手动参数建立可控人体，再研究由照片估计参数；服装必须是可穿戴的 3D 资产而不是普通商品图。",
    inputs: ["身高、围度等人体参数", "参数化人体或扫描结果", "3D 服装网格与材质"],
    capabilities: ["人体捏形与骨骼绑定", "服装适配和碰撞", "布料模拟与动作驱动"],
    outputs: ["可旋转的 3D 试衣场景", "动作中的衣物表现", "近似松量与贴合反馈"],
    steps: ["先完成手动参数人体", "建立一套合规 3D 服装", "加入走路 / 转身动作", "再验证照片到参数估计"],
    done: "人物参数可控、服装不明显穿模，并能在至少一组动作中稳定展示。",
    dependency: "需要参数化人体许可、3D 服装资产、WebGL 引擎和布料技术选型。",
  },
  {
    phase: "M7+",
    status: "长期研究",
    tone: "longterm",
    title: "实时 AR 虚拟试衣镜",
    summary: "让用户面对摄像头时实时叠加服装，重点从离线画质转向人体跟踪、遮挡、延迟和设备兼容。",
    inputs: ["摄像头视频流", "实时人体关键点", "2D / 3D 服装资产"],
    capabilities: ["实时姿态和人体分割", "遮挡与深度排序", "低延迟 Web 渲染"],
    outputs: ["可交互 AR 镜面", "设备性能数据", "延迟与跟踪稳定性报告"],
    steps: ["验证摄像头权限与姿态", "叠加单件上装", "处理手臂遮挡", "扩展移动端性能矩阵"],
    done: "主流目标设备上可持续跟踪，交互延迟与遮挡错误达到预设阈值。",
    dependency: "需要摄像头授权、目标设备范围和实时模型性能预算。",
  },
  {
    phase: "M7+",
    status: "长期研究",
    tone: "longterm",
    title: "尺码与穿搭智能",
    summary: "在视觉效果之上增加尺码推荐、版型解释与造型建议，让系统从‘看起来如何’走向‘为什么适合’。",
    inputs: ["人体参数与偏好", "品牌尺码表", "服装版型和弹性数据"],
    capabilities: ["尺码规则与不确定性", "搭配检索与排序", "可解释推荐"],
    outputs: ["尺码区间建议", "松紧与版型解释", "可替换的搭配方案"],
    steps: ["统一服装和尺码数据", "建立规则基线", "收集试穿反馈", "再评估学习型推荐"],
    done: "建议可追溯到数据与规则，并明确置信度；不能只凭生成图判断真实合身。",
    dependency: "需要可信的商品结构化数据、真实反馈和隐私合规方案。",
  },
];

const NEGATIVES = [
  "主体数量错误",
  "身份漂移",
  "不同脸或毛纹",
  "贴图残留或回弹",
  "中央双影",
  "身体融合",
  "服装叠穿",
  "多余手指或爪",
  "头脚裁切",
  "镜头漂移",
  "背景突变",
  "物理动作断裂",
];

const form = document.querySelector("#director-form");
const mechanismSelect = document.querySelector("#mechanism-select");
const mechanismHint = document.querySelector("#mechanism-hint");
const styleSelect = document.querySelector("#style-select");
const noteInput = document.querySelector("#creative-note");
const noteCount = document.querySelector("#note-count");
const lookStage = document.querySelector("#look-stage");
const modeBadge = document.querySelector("#mode-badge");
const durationBadge = document.querySelector("#duration-badge");
const stageAnnouncement = document.querySelector("#stage-announcement");
const playButton = document.querySelector("#play-button");
const playLabel = document.querySelector("#play-label");
const resetButton = document.querySelector("#reset-button");
const timelineMarkers = document.querySelector("#timeline-markers");
const timelineProgress = document.querySelector("#timeline-progress");
const timelineReadout = document.querySelector("#timeline-readout");
const outputContent = document.querySelector("#output-content");
const outputTitle = document.querySelector("#output-document-title");
const copyButton = document.querySelector("#copy-button");
const tabs = [...document.querySelectorAll("[data-tab]")];
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const toast = document.querySelector("#toast");
const imageModelSelect = document.querySelector("#image-model-select");
const videoModelSelect = document.querySelector("#video-model-select");
const imageModelField = document.querySelector("#image-model-field");
const assetFieldset = document.querySelector("#asset-fieldset");
const routeGuidance = document.querySelector("#route-guidance");
const handoffRouteLabel = document.querySelector("#handoff-route-label");
const handoffSummary = document.querySelector("#handoff-summary");
const personUpload = document.querySelector("#person-upload");
const clothesUpload = document.querySelector("#clothes-upload");
const personInputPreview = document.querySelector("#person-input-preview");
const personFileName = document.querySelector("#person-file-name");
const clothesCount = document.querySelector("#clothes-count");
const clothesFileName = document.querySelector("#clothes-file-name");
const experimentTabs = [...document.querySelectorAll(".experiment-tab")];
const roadmapTabs = [...document.querySelectorAll(".roadmap-step")];
const roadmapDetail = document.querySelector("#roadmap-detail");
const promptWorkspace = document.querySelector("#workspace");
const visualLab = document.querySelector("#visual-lab");
const wardrobeList = document.querySelector("#wardrobe-list");
const realModelStage = document.querySelector("#real-model-stage");
const realModelLayerA = document.querySelector("#real-model-layer-a");
const realModelLayerB = document.querySelector("#real-model-layer-b");
const realLookNumber = document.querySelector("#real-look-number");
const realLookName = document.querySelector("#real-look-name");
const realLookStatus = document.querySelector("#real-look-status");
const realPlayButton = document.querySelector("#real-play-button");
const realPlayLabel = document.querySelector("#real-play-label");
const realResetButton = document.querySelector("#real-reset-button");
const realLookProgress = document.querySelector("#real-look-progress");
const proofLookName = document.querySelector("#proof-look-name");
const proofLookDescription = document.querySelector("#proof-look-description");
const realEffectSelect = document.querySelector("#real-effect-select");

let activeTab = "video";
let outputs = {};
let timerIds = [];
let toastTimer;
let personPreviewUrl = "";
let realAssetStatus = "idle";
let realTimerId;
let realEffectTimerId;
let realVisibleLayer = "a";
let realLookIndex = 0;
let realPlaying = false;
let state = {
  subject: "woman",
  mode: "K",
  style: "urban",
  mechanism: "M1",
  note: noteInput.value,
  currentStep: 0,
  activeSide: -1,
  playing: false,
  generationRoute: "t2v",
  imageModel: "generic-image",
  videoModel: "generic-i2v",
  personFileName: "内置虚构人物素材",
  clothingFileNames: [],
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getSelected(name) {
  return form.elements[name].value;
}

function fileLabel(fileName) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function getOutfits() {
  const builtIn = STYLE_OUTFITS[state.subject][state.style];
  const uploaded = state.generationRoute === "i2v"
    ? state.clothingFileNames.map(fileLabel).filter(Boolean)
    : [];
  return [...uploaded, ...builtIn.slice(uploaded.length)].slice(0, MODES[state.mode].lookCount);
}

function updateMechanismOptions() {
  const mode = getSelected("mode");
  const previous = mechanismSelect.value;
  const available = Object.entries(MECHANISMS).filter(([, item]) => item.modes.includes(mode));

  mechanismSelect.innerHTML = available
    .map(([key, item]) => `<option value="${key}">${item.label}</option>`)
    .join("");

  const fallback = mode === "D" ? "M13" : "M1";
  mechanismSelect.value = available.some(([key]) => key === previous) ? previous : fallback;
  updateMechanismHint();
}

function updateMechanismHint() {
  mechanismHint.textContent = MECHANISMS[mechanismSelect.value].hint;
}

function humanFigure(subject, color) {
  const isWoman = subject === "woman";
  const lower = isWoman
    ? '<path class="outfit-secondary" d="M38 110 L82 110 L101 192 Q60 210 19 192 Z" />'
    : '<path class="outfit-secondary" d="M39 111 L58 111 L56 198 L35 198 Z M62 111 L81 111 L85 198 L64 198 Z" />';

  return `
    <svg class="figure-svg" viewBox="0 0 120 220" style="--outfit-color:${color}" aria-hidden="true">
      <ellipse cx="60" cy="211" rx="36" ry="5" fill="rgba(0,0,0,.16)" />
      <circle class="skin" cx="60" cy="29" r="18" />
      <path class="hair" d="M42 29 Q42 7 60 7 Q80 8 79 31 L73 23 Q63 14 47 24 Z" />
      ${isWoman ? '<path class="hair" d="M43 26 Q36 55 46 74 L52 48 Z M77 25 Q85 53 73 75 L68 47 Z" />' : ""}
      <path class="outfit-primary" d="M39 54 Q60 44 81 54 L88 114 Q60 127 32 114 Z" />
      <path class="skin" d="M39 57 Q31 66 20 105 Q18 113 25 116 Q31 116 34 107 L49 75 Z" />
      <path class="skin" d="M81 57 Q90 67 101 104 Q103 112 96 115 Q90 115 86 106 L71 75 Z" />
      ${lower}
      <path class="line" d="M47 25 Q60 36 73 25 M55 32 L57 32 M65 32 L67 32 M57 39 Q60 41 64 39" />
      <path class="line" d="M42 59 Q60 68 78 59" />
    </svg>`;
}

function petFigure(color) {
  return `
    <svg class="figure-svg" viewBox="0 0 180 150" style="--outfit-color:${color}" aria-hidden="true">
      <ellipse cx="90" cy="139" rx="66" ry="7" fill="rgba(0,0,0,.16)" />
      <path class="pet-fur" d="M47 70 Q50 39 85 35 Q123 35 137 69 L139 110 Q118 128 70 124 Q43 116 47 70 Z" />
      <circle class="pet-fur" cx="53" cy="57" r="31" />
      <path class="pet-dark" d="M28 35 Q12 26 19 65 Q23 77 37 70 Z M68 32 Q87 20 79 59 Q75 69 67 67 Z" />
      <circle cx="43" cy="53" r="4" fill="#2d261f" />
      <circle cx="63" cy="53" r="4" fill="#2d261f" />
      <ellipse cx="53" cy="64" rx="7" ry="5" fill="#292622" />
      <path class="outfit-primary" d="M46 75 Q83 58 132 72 L133 100 Q84 91 49 102 Z" />
      <path class="outfit-secondary" d="M48 81 L28 96 L49 103 Z" />
      <path class="pet-fur" d="M61 108 L58 137 L72 137 L77 111 Z M113 109 L115 137 L130 137 L128 103 Z" />
      <path class="pet-fur" d="M135 72 Q167 57 160 36" fill="none" stroke="#d7b78e" stroke-width="12" stroke-linecap="round" />
      <path class="line" d="M45 69 Q53 74 62 69" />
    </svg>`;
}

function figureMarkup(subject, color) {
  return subject === "pet" ? petFigure(color) : humanFigure(subject, color);
}

function renderStage() {
  const mode = MODES[state.mode];
  const subject = SUBJECTS[state.subject];
  const outfits = getOutfits();
  const palette = PALETTES[state.style];
  const centralColor = palette[state.currentStep];

  const sideLooks = mode.positions
    .map(([position, label], index) => {
      const classes = ["look-card"];
      if (index < state.currentStep) classes.push("is-consumed");
      if (index === state.activeSide) classes.push("is-active");
      const status = index < state.currentStep ? "已清空" : index === state.activeSide ? "正在激活" : "等待激活";
      return `
        <article class="${classes.join(" ")}" data-position="${position}" aria-label="${label}造型：${escapeHtml(outfits[index + 1])}，${status}">
          <div class="figure-wrap">${figureMarkup(state.subject, palette[index + 1])}</div>
          <span class="look-position">${label} · ${String(index + 1).padStart(2, "0")}</span>
          <strong class="look-name">${escapeHtml(outfits[index + 1])}</strong>
        </article>`;
    })
    .join("");

  const center = `
    <article class="center-look" aria-label="中央当前造型：${escapeHtml(outfits[state.currentStep])}">
      <div class="figure-wrap">${figureMarkup(state.subject, centralColor)}</div>
      <span class="center-kicker">CENTRAL SUBJECT · ${String(state.currentStep + 1).padStart(2, "0")}</span>
      <strong class="center-name">${escapeHtml(outfits[state.currentStep])}</strong>
      <span class="identity-chip">${subject.chip} · 身份锁定</span>
    </article>`;

  lookStage.innerHTML = sideLooks + center;
  lookStage.setAttribute("aria-label", `${mode.lookCount} 造型拼贴首帧预览，中央主体为${outfits[state.currentStep]}`);
  modeBadge.textContent = `MODE ${state.mode}`;
  durationBadge.textContent = `${mode.duration.toFixed(1).padStart(4, "0")} SEC`;

  if (state.activeSide >= 0) {
    const point = mode.points[state.activeSide];
    const position = mode.positions[state.activeSide][1];
    stageAnnouncement.textContent = `${point.toFixed(1)} 秒：${position}造型正在激活，准备汇入中央`;
  } else if (state.currentStep === 0) {
    stageAnnouncement.textContent = "初始状态：全部造型待激活";
  } else if (state.currentStep === mode.points.length) {
    stageAnnouncement.textContent = `编排完成：${mode.points.length} 个侧边造型已清空，最终造型展示至 ${mode.duration.toFixed(1)} 秒`;
  } else {
    stageAnnouncement.textContent = `${mode.points[state.currentStep - 1].toFixed(1)} 秒：换装完成，中央主体继续原动作`;
  }

  renderTimeline();
}

function renderTimeline() {
  const mode = MODES[state.mode];
  const isFinal = state.currentStep === mode.points.length;
  const currentTime = state.currentStep === 0 ? 0 : isFinal ? mode.duration : mode.points[state.currentStep - 1];
  timelineProgress.style.width = `${(currentTime / mode.duration) * 100}%`;
  timelineReadout.textContent = `${currentTime.toFixed(1).padStart(4, "0")} / ${mode.duration.toFixed(1).padStart(4, "0")}s`;

  timelineMarkers.innerHTML = mode.points
    .map((point, index) => {
      const classes = ["timeline-marker"];
      if (index < state.currentStep) classes.push("is-complete");
      if (index === state.activeSide) classes.push("is-active");
      return `<button class="${classes.join(" ")}" type="button" style="left:${(point / mode.duration) * 100}%" data-step="${index + 1}" data-label="${point.toFixed(1)}" aria-label="跳到 ${point.toFixed(1)} 秒，第 ${index + 1} 次换装"></button>`;
    })
    .join("");

  timelineMarkers.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      stopPlayback();
      state.currentStep = Number(button.dataset.step);
      state.activeSide = -1;
      renderStage();
    });
  });
}

function buildOutputs() {
  const mode = MODES[state.mode];
  const subject = SUBJECTS[state.subject];
  const outfits = getOutfits();
  const mechanism = MECHANISMS[state.mechanism];
  const imageModel = IMAGE_MODELS[state.imageModel];
  const videoModel = VIDEO_MODELS[state.videoModel];
  const isI2V = state.generationRoute === "i2v";
  const note = state.note.trim() || "无额外补充";
  const sideAssignments = mode.positions.map(([, label], index) => `${label}：${outfits[index + 1]}`).join("；");
  const clothesSource = isI2V && state.clothingFileNames.length
    ? state.clothingFileNames.map((name, index) => `Image ${index + 2}「${name}」`).join("；")
    : isI2V ? "内置五套无品牌造型描述（无真实衣服图片）" : "纯文本造型描述";

  const paramsText = [
    `生成路线：${isI2V ? "首帧图生视频 I2V" : "纯文本生成视频 T2V"}`,
    `首帧图像模型：${isI2V ? imageModel.label : "不需要"}`,
    `目标视频模型：${videoModel.label}`,
    `人物素材：${isI2V ? `Image 1「${state.personFileName}」` : "提示词内置虚构主体描述"}`,
    `衣服素材：${clothesSource}`,
    `主体路线：${subject.label}`,
    `基础身份：${subject.route}`,
    `识别锚点：${subject.anchors}`,
    `视频模式：${state.mode}｜${mode.name}`,
    `造型方向：${STYLE_LABELS[state.style]}`,
    `造型数量：正好 ${mode.lookCount} 套`,
    `中央造型：${outfits[0]}`,
    `侧边造型：${sideAssignments}`,
    `画面布局：${mode.layout}`,
    `时长与机位：${mode.duration} 秒；${mode.camera}`,
    `换装机制：${mechanism.label}`,
    `声音：${mode.audio}`,
    `系统补全：${note}`,
  ].join("\n");

  const paramsHtml = `<dl>${paramsText
    .split("\n")
    .map((line) => {
      const separator = line.indexOf("：");
      return `<div><dt>${escapeHtml(line.slice(0, separator))}</dt><dd>${escapeHtml(line.slice(separator + 1))}</dd></div>`;
    })
    .join("")}</dl>`;

  const timelineRows = [];
  let previous = 0;
  mode.points.forEach((point, index) => {
    const position = mode.positions[index][1];
    const action = state.mode === "D"
      ? `中央主体延续连续舞步，${position}贴图在动作峰值激活并从原位清空，换为“${outfits[index + 1]}”。`
      : `${position}完整主体轮廓激活并从原位清空，通过${mechanism.label.replace(/^M\d+ · /, "")}与中央对齐，换为“${outfits[index + 1]}”。`;
    timelineRows.push({ range: `${previous.toFixed(1)}–${point.toFixed(1)}s`, title: `第 ${index + 1} 次换装 · ${point.toFixed(1)}s 完成`, action });
    previous = point;
  });
  timelineRows.push({
    range: `${previous.toFixed(1)}–${mode.duration.toFixed(1)}s`,
    title: "最终造型展示",
    action: `保持“${outfits.at(-1)}”，完成收尾动作；中央始终只保留一个主体，全部侧边位置保持清空。`,
  });

  const timelineText = timelineRows.map((row) => `${row.range}｜${row.title}\n${row.action}`).join("\n\n");
  const timelineHtml = timelineRows
    .map((row) => `<div class="timeline-row"><strong>${escapeHtml(row.range)}｜${escapeHtml(row.title)}</strong><span>${escapeHtml(row.action)}</span></div>`)
    .join("");

  const imagePrompt = isI2V
    ? `【目标模型】${imageModel.label}\n【参考素材】Image 1 是人物身份参考「${state.personFileName}」；${clothesSource}。仅依据素材角色与以下文字执行，不推断未提供的服装细节。\n【模型适配】${imageModel.directive}。\n【生成任务】${mode.duration === 15 ? "竖版全身时尚摄影" : "竖版社交媒体拼贴摄影"}，${subject.route}，严格锁定${subject.anchors}。画面中正好 ${mode.lookCount} 个同一主体版本，只改变服装、配饰和编排姿势。中央为大型完整主体，穿“${outfits[0]}”；${sideAssignments}。${mode.layout}。侧边贴图沿真实主体轮廓裁切，使用独立白色虚线描边，不得出现矩形卡片。背景简洁，柔和轮廓光，服装面料和${state.subject === "pet" ? "毛发" : "发丝"}清晰，完整保留头部、四肢和脚部。造型方向为${STYLE_LABELS[state.style]}。${note}。硬性限制：主体身份完全一致，正好 ${mode.lookCount} 个版本，无额外主体，无肢体缺失，无服装叠穿。`
    : `当前选择“纯文本生成视频 T2V”，不需要先生成首帧。若外部模型必须提供图片，可切换到“先做首帧，再生成视频 I2V”。`;

  const outfitSequence = outfits.map((outfit, index) => `${index + 1}. ${outfit}`).join("；");
  const videoPrompt = isI2V
    ? `【生成方式】首帧图生视频 I2V\n【目标模型】${videoModel.label}\n【输入】将“首帧”标签中生成并确认过的图片作为唯一视频首帧；不要把多张衣服参考直接当作视频首帧。\n【模型适配】${videoModel.directive}。\n【生成任务】${mode.duration} 秒${mode.name}，继承首帧中的${subject.label}身份、全部 ${mode.lookCount} 套造型、侧边位置、画面布局和摄影质感。中央主体保持${mode.camera}，使用${mechanism.label}。在 ${mode.points.map((point) => `${point.toFixed(1)} 秒`).join("、")}依次完成换装；激活顺序为${mode.positions.map(([, label]) => label).join(" → ")}。每个侧边贴图在激活同一帧从原位永久清空，不弹回、不复现；中央始终只有一个主体。换装前后保持重心、视线、手臂轨迹和${state.subject === "pet" ? "四足支点" : "旋转方向"}连续，衣摆、发丝或毛发保持重力与惯性。${mode.audio}。最终造型展示至 ${mode.duration.toFixed(1)} 秒并完成收尾。${note}`
    : `【生成方式】纯文本生成视频 T2V\n【目标模型】${videoModel.label}\n【画幅与时长】竖版 9:16，${mode.duration} 秒，单一连续镜头。\n【主体】${subject.route}；始终保持${subject.anchors}，从开头到结尾必须是同一个主体。\n【场景与机位】简洁摄影棚背景，${mode.camera}，完整保留头部、身体和脚部，柔和轮廓光，真实服装面料与${state.subject === "pet" ? "毛发" : "发丝"}细节。\n【造型顺序】${outfitSequence}。\n【动作与换装】${mode.name}，使用${mechanism.label}；在 ${mode.points.map((point, index) => `${point.toFixed(1)} 秒从“${outfits[index]}”换为“${outfits[index + 1]}”`).join("；")}。换装发生在同一动作峰值，人物位置、脸、身体比例、视线和运动方向保持连续，不切镜头。\n【模型适配】${T2V_DIRECTIVES[state.videoModel]}。\n【声音】${mode.audio}。\n【补充】${note}。\n【硬性限制】只有一个主体；不要生成拼贴、分屏或侧边人物；不要身份漂移、服装叠穿、双影、肢体变形、镜头跳切、背景突变；最终保持“${outfits.at(-1)}”完成收尾。`;

  const negativeText = NEGATIVES.join("，");
  const negativeHtml = `<p>以下约束随每次输出一起交付，用来抑制常见生成故障：</p><ul class="negative-list">${NEGATIVES.map((item) => `<li>${item}</li>`).join("")}</ul>`;

  outputs = {
    params: { text: paramsText, html: paramsHtml },
    timeline: { text: timelineText, html: timelineHtml },
    image: { text: imagePrompt, html: `<p class="prompt-block">${escapeHtml(imagePrompt)}</p>` },
    video: { text: videoPrompt, html: `<p class="prompt-block">${escapeHtml(videoPrompt)}</p>` },
    negative: { text: negativeText, html: negativeHtml },
  };
}

function renderActiveOutput() {
  outputTitle.textContent = OUTPUT_TITLES[activeTab];
  outputContent.innerHTML = outputs[activeTab].html;
  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === activeTab;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
}

function updateGenerationRouteUi() {
  const isI2V = getSelected("generationRoute") === "i2v";
  imageModelField.hidden = !isI2V;
  assetFieldset.hidden = !isI2V;
  imageModelSelect.disabled = !isI2V;
  personUpload.disabled = !isI2V;
  clothesUpload.disabled = !isI2V;
  routeGuidance.innerHTML = isI2V
    ? "<strong>当前路线：</strong>先用人物与衣服参考生成首帧，再把首帧交给视频模型。"
    : "<strong>当前路线：</strong>无需首帧，生成后直接复制“视频”结果。";
  handoffRouteLabel.textContent = isI2V ? "CONTROL / I2V" : "SIMPLE / T2V";
  handoffSummary.textContent = isI2V
    ? "先复制首帧提示词生成图片，再复制视频提示词生成视频"
    : "复制视频提示词，直接交给外部视频模型";
}

function applyFormState() {
  state.generationRoute = getSelected("generationRoute");
  state.subject = getSelected("subject");
  state.mode = getSelected("mode");
  state.style = styleSelect.value;
  state.mechanism = mechanismSelect.value;
  state.imageModel = imageModelSelect.value;
  state.videoModel = videoModelSelect.value;
  state.note = noteInput.value;
  state.currentStep = 0;
  state.activeSide = -1;
  stopPlayback();
  updateGenerationRouteUi();
  buildOutputs();
  renderStage();
  renderActiveOutput();
  playLabel.textContent = `播放 ${MODES[state.mode].duration} 秒编排`;
}

function clearTimers() {
  timerIds.forEach((id) => window.clearTimeout(id));
  timerIds = [];
}

function stopPlayback() {
  clearTimers();
  state.playing = false;
  state.activeSide = -1;
  playButton.querySelector(".play-button__icon").textContent = "▶";
  playLabel.textContent = `播放 ${MODES[state.mode].duration} 秒编排`;
}

function playSequence() {
  if (state.playing) {
    stopPlayback();
    renderStage();
    return;
  }

  const mode = MODES[state.mode];
  if (state.currentStep >= mode.points.length) {
    state.currentStep = 0;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    state.currentStep = mode.points.length;
    state.activeSide = -1;
    renderStage();
    showToast("已在减少动态效果模式下直接展示完成状态");
    return;
  }

  state.playing = true;
  playButton.querySelector(".play-button__icon").textContent = "Ⅱ";
  playLabel.textContent = "暂停预览";

  const runNext = () => {
    if (!state.playing) return;
    if (state.currentStep >= mode.points.length) {
      stopPlayback();
      renderStage();
      return;
    }

    state.activeSide = state.currentStep;
    renderStage();

    timerIds.push(window.setTimeout(() => {
      state.currentStep += 1;
      state.activeSide = -1;
      renderStage();

      if (state.currentStep >= mode.points.length) {
        timerIds.push(window.setTimeout(() => {
          stopPlayback();
          renderStage();
        }, 650));
      } else {
        timerIds.push(window.setTimeout(runNext, 430));
      }
    }, 380));
  };

  runNext();
}

function resetStage() {
  stopPlayback();
  state.currentStep = 0;
  renderStage();
  showToast("已恢复全部待激活造型");
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

async function copyCurrentOutput() {
  const text = outputs[activeTab].text;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  showToast(`已复制：${OUTPUT_TITLES[activeTab]}`);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const next = theme === "dark" ? "浅色" : "深色";
  themeToggle.setAttribute("aria-label", `切换为${next}主题`);
  themeIcon.textContent = theme === "dark" ? "☼" : "◐";
  try {
    localStorage.setItem("outfit-director-theme", theme);
  } catch {
    // Theme persistence is optional; the visible toggle remains functional.
  }
}

function updateAssetLabels() {
  personFileName.textContent = state.personFileName.replace("素材", "");
  const count = state.clothingFileNames.length || 5;
  clothesCount.textContent = String(count).padStart(2, "0");
  clothesFileName.textContent = state.clothingFileNames.length
    ? `${state.clothingFileNames.length} 个本地文件`
    : "内置五套造型";
}

function handlePersonUpload() {
  const [file] = personUpload.files;
  if (!file) return;
  state.personFileName = file.name;
  if (personPreviewUrl) URL.revokeObjectURL(personPreviewUrl);
  personPreviewUrl = URL.createObjectURL(file);
  personInputPreview.style.setProperty("--person-preview", `url("${personPreviewUrl}")`);
  personInputPreview.classList.add("has-upload");
  updateAssetLabels();
  applyFormState();
  showToast("人物参考已加入提示词素材清单（仅本地读取）");
}

function handleClothesUpload() {
  const files = [...clothesUpload.files].slice(0, 7);
  state.clothingFileNames = files.map((file) => file.name);
  updateAssetLabels();
  applyFormState();
  showToast(`已加入 ${files.length} 个衣服参考文件名`);
}

function renderRealWardrobe() {
  wardrobeList.innerHTML = REAL_LOOKS.map((look, index) => `
    <button class="wardrobe-item${index === realLookIndex ? " is-active" : ""}" type="button" data-real-look="${index}" aria-pressed="${index === realLookIndex}">
      <span class="wardrobe-thumb" style="--look-position:${look.position}%" aria-hidden="true"></span>
      <span><strong>${escapeHtml(look.name)}</strong><small>${escapeHtml(look.short)}</small></span>
      <small>0${index + 1}</small>
    </button>`).join("");

  realLookProgress.innerHTML = REAL_LOOKS.map((look, index) => `
    <button class="real-progress-button${index === realLookIndex ? " is-active" : ""}" type="button" data-real-look="${index}" aria-label="切换至第 ${index + 1} 套：${escapeHtml(look.name)}"></button>`).join("");

  [...wardrobeList.querySelectorAll("[data-real-look]"), ...realLookProgress.querySelectorAll("[data-real-look]")]
    .forEach((button) => button.addEventListener("click", () => {
      stopRealPlayback();
      setRealLook(Number(button.dataset.realLook));
    }));
}

function ensureRealAsset() {
  if (realAssetStatus !== "idle") return;
  realAssetStatus = "loading";
  realLookStatus.textContent = "正在载入本地写实造型素材…";
  const image = new Image();
  image.onload = () => {
    realAssetStatus = "ready";
    document.body.classList.add("real-assets-ready");
    realLookStatus.textContent = "已锁定同一人物身份与站姿";
  };
  image.onerror = () => {
    realAssetStatus = "error";
    document.body.classList.add("real-assets-error");
    realLookStatus.textContent = "素材未载入；当前显示降级色块";
    showToast("写实造型素材载入失败，已保留可操作降级状态");
  };
  image.src = "./assets/fictional-model-five-looks.png";
}

function updateRealLookText(index) {
  const look = REAL_LOOKS[index];
  realLookNumber.textContent = String(index + 1).padStart(2, "0");
  realLookName.textContent = look.name;
  proofLookName.textContent = look.name;
  proofLookDescription.textContent = look.description;
  realModelStage.setAttribute("aria-label", `当前造型：${look.name}`);
}

function setRealLook(index) {
  const nextIndex = Math.max(0, Math.min(index, REAL_LOOKS.length - 1));
  const nextLook = REAL_LOOKS[nextIndex];
  const visibleLayer = realVisibleLayer === "a" ? realModelLayerA : realModelLayerB;
  const nextLayer = realVisibleLayer === "a" ? realModelLayerB : realModelLayerA;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  window.clearTimeout(realEffectTimerId);
  realModelStage.classList.remove("is-changing");
  realModelStage.dataset.effect = realEffectSelect.value;
  if (!reducedMotion && nextIndex !== realLookIndex) {
    void realModelStage.offsetWidth;
    realModelStage.classList.add("is-changing");
    realLookStatus.textContent = `${realEffectSelect.options[realEffectSelect.selectedIndex].text} · 正在完成换装`;
    const duration = realEffectSelect.value === "veil" ? 760 : realEffectSelect.value === "beat" ? 300 : 650;
    realEffectTimerId = window.setTimeout(() => {
      realModelStage.classList.remove("is-changing");
      realLookStatus.textContent = "已锁定同一人物身份与站姿";
    }, duration);
  }

  nextLayer.style.setProperty("--look-position", `${nextLook.position}%`);
  nextLayer.classList.add("is-visible");
  visibleLayer.classList.remove("is-visible");
  realVisibleLayer = realVisibleLayer === "a" ? "b" : "a";
  realLookIndex = nextIndex;
  updateRealLookText(nextIndex);
  renderRealWardrobe();
}

function stopRealPlayback() {
  window.clearTimeout(realTimerId);
  realPlaying = false;
  realPlayButton.querySelector("span:first-child").textContent = "▶";
  realPlayLabel.textContent = "自动换装";
}

function playRealSequence() {
  if (realPlaying) {
    stopRealPlayback();
    return;
  }

  ensureRealAsset();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setRealLook(REAL_LOOKS.length - 1);
    showToast("已在减少动态效果模式下直接展示终场造型");
    return;
  }

  realPlaying = true;
  realPlayButton.querySelector("span:first-child").textContent = "Ⅱ";
  realPlayLabel.textContent = "暂停换装";
  let nextIndex = realLookIndex >= REAL_LOOKS.length - 1 ? 0 : realLookIndex + 1;

  const advance = () => {
    if (!realPlaying) return;
    setRealLook(nextIndex);
    nextIndex += 1;
    if (nextIndex >= REAL_LOOKS.length) {
      realTimerId = window.setTimeout(stopRealPlayback, 900);
      return;
    }
    realTimerId = window.setTimeout(advance, 1050);
  };

  advance();
}

function switchExperiment(experiment) {
  const showVisual = experiment === "visual";
  promptWorkspace.hidden = showVisual;
  visualLab.hidden = !showVisual;
  experimentTabs.forEach((tab) => {
    const selected = tab.dataset.experiment === experiment;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  if (showVisual) {
    ensureRealAsset();
    renderRealWardrobe();
  } else {
    stopRealPlayback();
  }
}

function renderRoadmapGoal(index) {
  const goal = ROADMAP_GOALS[index];
  roadmapTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });

  const list = (items) => items.map((item) => `<li>${item}</li>`).join("");
  const flow = goal.steps.map((step, stepIndex) => `<span><small>${String(stepIndex + 1).padStart(2, "0")}</small><strong>${step}</strong></span>`).join('<i aria-hidden="true">→</i>');
  const action = goal.action
    ? `<button class="roadmap-action" type="button" data-roadmap-action="${goal.action}">${goal.actionLabel}<span aria-hidden="true">↗</span></button>`
    : "";

  roadmapDetail.setAttribute("aria-labelledby", `roadmap-goal-${index + 1}`);
  roadmapDetail.innerHTML = `
    <header class="roadmap-detail__header">
      <div><span class="roadmap-status roadmap-status--${goal.tone}">${goal.status}</span><small>${goal.phase}</small></div>
      <h3>${goal.title}</h3>
      <p>${goal.summary}</p>
    </header>
    <div class="roadmap-flow" aria-label="目标实施步骤">${flow}</div>
    <div class="roadmap-capability-grid">
      <section><span>INPUT</span><h4>需要提供</h4><ul>${list(goal.inputs)}</ul></section>
      <section><span>CAPABILITY</span><h4>需要接入</h4><ul>${list(goal.capabilities)}</ul></section>
      <section><span>OUTPUT</span><h4>阶段产出</h4><ul>${list(goal.outputs)}</ul></section>
    </div>
    <div class="roadmap-acceptance">
      <div><span>完成标准</span><strong>${goal.done}</strong></div>
      <div><span>依赖与边界</span><p>${goal.dependency}</p></div>
    </div>
    <div class="roadmap-actions">
      ${action}
      <a href="#research-roadmap">回到五目标索引 <span aria-hidden="true">↑</span></a>
    </div>`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  activeTab = "video";
  applyFormState();
  showToast(state.generationRoute === "i2v" ? "已生成首帧 + 视频两步提示词" : "已生成可直接复制的视频提示词");
});

form.addEventListener("change", (event) => {
  if (event.target.name === "mode") updateMechanismOptions();
  if (event.target === mechanismSelect) updateMechanismHint();
  if (event.target.name === "generationRoute") {
    activeTab = "video";
    applyFormState();
  }
});

noteInput.addEventListener("input", () => {
  noteCount.textContent = `${noteInput.value.length} / 120`;
});

personUpload.addEventListener("change", handlePersonUpload);
clothesUpload.addEventListener("change", handleClothesUpload);

playButton.addEventListener("click", playSequence);
resetButton.addEventListener("click", resetStage);
copyButton.addEventListener("click", copyCurrentOutput);
realPlayButton.addEventListener("click", playRealSequence);
realEffectSelect.addEventListener("change", () => {
  realModelStage.dataset.effect = realEffectSelect.value;
  showToast(`换装效果：${realEffectSelect.options[realEffectSelect.selectedIndex].text}`);
});
realResetButton.addEventListener("click", () => {
  stopRealPlayback();
  setRealLook(0);
  showToast("已回到第一套通勤基线造型");
});

experimentTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => switchExperiment(tab.dataset.experiment));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + experimentTabs.length) % experimentTabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % experimentTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = experimentTabs.length - 1;
    experimentTabs[nextIndex].click();
    experimentTabs[nextIndex].focus();
  });
});

roadmapTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => renderRoadmapGoal(index));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) nextIndex = (index - 1 + roadmapTabs.length) % roadmapTabs.length;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % roadmapTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = roadmapTabs.length - 1;
    renderRoadmapGoal(nextIndex);
    roadmapTabs[nextIndex].focus();
  });
});

roadmapDetail.addEventListener("click", (event) => {
  const action = event.target.closest("[data-roadmap-action]");
  if (!action) return;
  switchExperiment(action.dataset.roadmapAction);
  const destination = action.dataset.roadmapAction === "visual" ? visualLab : promptWorkspace;
  destination.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
});

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    activeTab = tab.dataset.tab;
    renderActiveOutput();
  });

  tab.addEventListener("keydown", (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;
    tabs[nextIndex].click();
    tabs[nextIndex].focus();
  });
});

themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem("outfit-director-theme") || "dark";
} catch {
  savedTheme = "dark";
}

setTheme(savedTheme);
updateMechanismOptions();
noteCount.textContent = `${noteInput.value.length} / 120`;
updateAssetLabels();
realModelStage.dataset.effect = realEffectSelect.value;
renderRealWardrobe();
updateRealLookText(0);
renderRoadmapGoal(0);
applyFormState();
