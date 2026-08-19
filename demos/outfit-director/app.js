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
  video: "精简视频提示词",
  negative: "负面提示词",
};

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
const tabs = [...document.querySelectorAll("[role='tab']")];
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const toast = document.querySelector("#toast");

let activeTab = "params";
let outputs = {};
let timerIds = [];
let toastTimer;
let state = {
  subject: "woman",
  mode: "K",
  style: "urban",
  mechanism: "M1",
  note: noteInput.value,
  currentStep: 0,
  activeSide: -1,
  playing: false,
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

function getOutfits() {
  return STYLE_OUTFITS[state.subject][state.style].slice(0, MODES[state.mode].lookCount);
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
  const note = state.note.trim() || "无额外补充";
  const sideAssignments = mode.positions.map(([, label], index) => `${label}：${outfits[index + 1]}`).join("；");

  const paramsText = [
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

  const imagePrompt = `${mode.duration === 15 ? "竖版全身时尚摄影" : "竖版社交媒体拼贴摄影"}，${subject.route}，严格锁定${subject.anchors}。画面中正好 ${mode.lookCount} 个同一主体版本，只改变服装、配饰和编排姿势。中央为大型完整主体，穿“${outfits[0]}”；${sideAssignments}。${mode.layout}。侧边贴图沿真实主体轮廓裁切，使用独立白色虚线描边，不得出现矩形卡片。背景简洁，柔和轮廓光，服装面料和${state.subject === "pet" ? "毛发" : "发丝"}清晰，完整保留头部、四肢和脚部。造型方向为${STYLE_LABELS[state.style]}。${note}。硬性限制：主体身份完全一致，正好 ${mode.lookCount} 个版本，无额外主体，无肢体缺失，无服装叠穿。`;

  const videoPrompt = `${mode.duration} 秒${mode.name}，继承首帧中的${subject.label}身份、全部 ${mode.lookCount} 套造型、侧边位置、画面布局和摄影质感。中央主体保持${mode.camera}，使用${mechanism.label}。在 ${mode.points.map((point) => `${point.toFixed(1)} 秒`).join("、")}依次完成换装；激活顺序为${mode.positions.map(([, label]) => label).join(" → ")}。每个侧边贴图在激活同一帧从原位永久清空，不弹回、不复现；中央始终只有一个主体。换装前后保持重心、视线、手臂轨迹和${state.subject === "pet" ? "四足支点" : "旋转方向"}连续，衣摆、发丝或毛发保持重力与惯性。${mode.audio}。最终造型展示至 ${mode.duration.toFixed(1)} 秒并完成收尾。${note}`;

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

function applyFormState() {
  state.subject = getSelected("subject");
  state.mode = getSelected("mode");
  state.style = styleSelect.value;
  state.mechanism = mechanismSelect.value;
  state.note = noteInput.value;
  state.currentStep = 0;
  state.activeSide = -1;
  stopPlayback();
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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFormState();
  showToast(`已生成 ${SUBJECTS[state.subject].label} · ${MODES[state.mode].name} 方案`);
});

form.addEventListener("change", (event) => {
  if (event.target.name === "mode") updateMechanismOptions();
  if (event.target === mechanismSelect) updateMechanismHint();
});

noteInput.addEventListener("input", () => {
  noteCount.textContent = `${noteInput.value.length} / 120`;
});

playButton.addEventListener("click", playSequence);
resetButton.addEventListener("click", resetStage);
copyButton.addEventListener("click", copyCurrentOutput);

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
applyFormState();
