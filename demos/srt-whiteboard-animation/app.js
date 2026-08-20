const form = document.querySelector("#driver-form");
const durationInput = document.querySelector("#total-duration");
const durationOutput = document.querySelector("#duration-output");
const commandOutput = document.querySelector("#command-output");
const jsonOutput = document.querySelector("#json-output");
const timeline = document.querySelector("#annotation-timeline");
const timelineMid = document.querySelector("#timeline-mid");
const timelineEnd = document.querySelector("#timeline-end");
const copyButton = document.querySelector("#copy-command");
const copyStatus = document.querySelector("#copy-status");
const video = document.querySelector("#demo-video");
const videoPlayhead = document.querySelector("#video-playhead");
const videoShell = video.closest(".video-shell");
const videoFallback = document.querySelector("#video-fallback");
const caseButtons = [...document.querySelectorAll(".case-choice")];
const flowButtons = [...document.querySelectorAll(".flow-step")];
const caseVideo = document.querySelector("#case-video");
const caseMedia = caseVideo.closest(".case-media");
const caseMediaFallback = document.querySelector("#case-media-fallback");
const caseFallbackLink = document.querySelector("#case-fallback-link");
const caseVideoStatus = document.querySelector("#case-video-status");
const caseVideoSpec = document.querySelector("#case-video-spec");
const caseKind = document.querySelector("#case-kind");
const caseTitle = document.querySelector("#case-title");
const caseSummary = document.querySelector("#case-summary");
const caseTags = document.querySelector("#case-tags");
const caseInput = document.querySelector("#case-input");
const caseStrategy = document.querySelector("#case-strategy");
const caseFit = document.querySelector("#case-fit");
const caseDownload = document.querySelector("#case-download");
const flowKicker = document.querySelector("#flow-kicker");
const flowTitle = document.querySelector("#flow-title");
const flowDescription = document.querySelector("#flow-description");
const flowArtifactLink = document.querySelector("#flow-artifact-link");
const flowCode = document.querySelector("#flow-code");
const flowCodeText = flowCode.querySelector("code");
const flowImage = document.querySelector("#flow-image");
const flowImageElement = flowImage.querySelector("img");
const flowVideoWrap = document.querySelector("#flow-video-wrap");
const flowVideo = document.querySelector("#flow-video");

const caseLibrary = {
  monkey: {
    type: "STORY",
    kind: "故事叙事 · 区域事件",
    title: "猴子抢香蕉",
    summary: "三段字幕分别对应左侧场景、中间冲突主体和右侧观众反应，适合观察最典型的叙事顺序控制。",
    tags: ["grid", "contour-wipe", "hand", "60 fps"],
    input: "3 条字幕 + 1 张图 + 3 个区域",
    strategy: "Grid 路径 / Contour-wipe 上色 / 手部素材",
    fit: "人物少、事件明确的故事口播",
    duration: "8.6s",
    source: "./cases/monkey-story/source.png",
    srt: "./cases/monkey-story/narration.srt",
    annotation: "./cases/monkey-story/annotation.json",
    video: "./cases/monkey-story/output.mp4",
    poster: "./cases/monkey-story/poster.jpg",
    command: ".\\.venv\\Scripts\\python.exe scripts\\render_stream_whiteboard.py \\\n  examples\\scene-01-monkey-mountain-banana.png \\\n  examples\\scene-01-monkey-mountain-banana.annotation.json output.mp4 assets\\drawing-hand.png \\\n  --ink-path grid --color-fill contour-wipe --total-ms 8600 --fps 60",
  },
  photosynthesis: {
    type: "KNOWLEDGE",
    kind: "知识解释 · 因果链",
    title: "光合作用",
    summary: "阳光、叶片与水、植物和氧气被拆成三个独立概念区，字幕时间依次驱动“来源—转换—结果”。",
    tags: ["skeleton", "contour-wipe", "hand", "60 fps"],
    input: "3 条字幕 + 1 张图 + 3 个概念区",
    strategy: "Skeleton 路径 / Contour-wipe 上色 / 手部素材",
    fit: "因果明确、对象少的知识讲解",
    duration: "9.1s",
    source: "./cases/photosynthesis/source.png",
    srt: "./cases/photosynthesis/narration.srt",
    annotation: "./cases/photosynthesis/annotation.json",
    video: "./cases/photosynthesis/output.mp4",
    poster: "./cases/photosynthesis/poster.jpg",
    command: ".\\.venv\\Scripts\\python.exe scripts\\render_stream_whiteboard.py \\\n  cases\\photosynthesis\\source.png cases\\photosynthesis\\annotation.json output.mp4 assets\\drawing-hand.png \\\n  --ink-path skeleton --color-fill contour-wipe --total-ms 9000 --fps 60",
  },
  delivery: {
    type: "PROCESS",
    kind: "流程说明 · 输入处理输出",
    title: "从想法到交付",
    summary: "灯泡与草图、齿轮与任务、包裹与检查被划为三段，展示业务流程如何用区域顺序替代复杂镜头运动。",
    tags: ["grid", "brush", "bare-tip", "60 fps"],
    input: "3 条字幕 + 1 张图 + 3 个流程区",
    strategy: "Grid 路径 / Brush 上色 / Bare-tip 无手部",
    fit: "步骤稳定、输入输出清晰的流程说明",
    duration: "9.6s",
    source: "./cases/idea-to-delivery/source.png",
    srt: "./cases/idea-to-delivery/narration.srt",
    annotation: "./cases/idea-to-delivery/annotation.json",
    video: "./cases/idea-to-delivery/output.mp4",
    poster: "./cases/idea-to-delivery/poster.jpg",
    command: ".\\.venv\\Scripts\\python.exe scripts\\render_stream_whiteboard.py \\\n  cases\\idea-to-delivery\\source.png cases\\idea-to-delivery\\annotation.json output.mp4 assets\\drawing-hand.png \\\n  --ink-path grid --color-fill brush --bare-tip --total-ms 9600 --fps 60",
  },
  newton: {
    type: "PHYSICS",
    kind: "物理原理 · 作用力与反作用力",
    title: "火箭为什么升空",
    summary: "燃烧产生高压气体、气体向下喷出、火箭受到向上反作用力被拆成三个独立区域，完整演示静态物理插画如何按旁白变成 600 帧视频。",
    tags: ["skeleton", "brush", "hand", "600 frames"],
    input: "3 条物理旁白 + 1 张插画 + 3 个作用过程",
    strategy: "Skeleton 路径 / Brush 上色 / 手部素材",
    fit: "因果链清楚、可用静态示意图表达的物理原理",
    duration: "10.0s",
    source: "./cases/newton-third-law/source.png",
    srt: "./cases/newton-third-law/narration.srt",
    annotation: "./cases/newton-third-law/annotation.json",
    video: "./cases/newton-third-law/output.mp4",
    poster: "./cases/newton-third-law/poster.jpg",
    command: ".\\.venv\\Scripts\\python.exe scripts\\render_stream_whiteboard.py \\\n+  cases\\newton-third-law\\source.png cases\\newton-third-law\\annotation.json output.mp4 assets\\drawing-hand.png \\\n+  --ink-path skeleton --color-fill brush --total-ms 10000 --fps 60",
  },
};

const flowMeta = {
  srt: {
    kicker: "STEP 01 · CONTENT CLOCK",
    title: "SRT 是内容时钟，不是画面理解器",
    description: "每条字幕给出文本和起止时间。它告诉编排者“此时在讲什么”，但还不知道源图中的对象在哪里。",
  },
  source: {
    kicker: "STEP 02 · VISUAL SOURCE",
    title: "源图要先具备可分区结构",
    description: "把一个场景画成少量互不遮挡的大对象。对象越分散、轮廓越干净，后续遮罩和笔迹越稳定。",
  },
  annotation: {
    kicker: "STEP 03 · SEMANTIC MAP",
    title: "Annotation 把字幕事件映射到像素区域",
    description: "region 定位对象，sequence 决定顺序，startMs 和 durationMs 对齐字幕，protectedRegions 防止后续对象提前泄露。",
  },
  command: {
    kicker: "STEP 04 · RENDER POLICY",
    title: "CLI 决定笔迹、上色和输出节奏",
    description: "这一步选择 grid 或 skeleton 路径、contour-wipe 或 brush 上色，以及帧率、手部覆盖和总时长。",
  },
  output: {
    kicker: "STEP 05 · DETERMINISTIC OUTPUT",
    title: "OpenCV 按标注逐帧写出 H.264 MP4",
    description: "同一组输入和参数可重复得到稳定结果。库解决的是确定性绘制，不会额外生成配音、字幕烧录或镜头动作。",
  },
};

let activeCase = "monkey";
let activeFlowStep = "srt";
let flowRequestId = 0;
const artifactCache = new Map();

async function readArtifact(path) {
  if (artifactCache.has(path)) return artifactCache.get(path);
  const response = await fetch(path);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const text = await response.text();
  artifactCache.set(path, text);
  return text;
}

async function renderFlow() {
  const requestId = ++flowRequestId;
  const data = caseLibrary[activeCase];
  const meta = flowMeta[activeFlowStep];
  flowKicker.textContent = meta.kicker;
  flowTitle.textContent = meta.title;
  flowDescription.textContent = meta.description;
  flowCode.hidden = true;
  flowImage.hidden = true;
  flowVideoWrap.hidden = true;
  flowArtifactLink.removeAttribute("download");

  if (activeFlowStep === "source") {
    flowImageElement.src = data.source;
    flowImageElement.alt = `${data.title}案例的实际白板源图`;
    flowImage.hidden = false;
    flowArtifactLink.href = data.source;
    flowArtifactLink.textContent = "打开源图 ↗";
    return;
  }

  if (activeFlowStep === "command") {
    flowCodeText.textContent = data.command;
    flowCode.hidden = false;
    flowArtifactLink.href = "https://github.com/geeklee/srt-whiteboard-animation/blob/main/scripts/render_stream_whiteboard.py";
    flowArtifactLink.textContent = "查看上游渲染脚本 ↗";
    return;
  }

  if (activeFlowStep === "output") {
    flowVideo.src = data.video;
    flowVideo.poster = data.poster;
    flowVideoWrap.hidden = false;
    flowArtifactLink.href = data.video;
    flowArtifactLink.textContent = "下载真实 MP4 ↓";
    flowArtifactLink.setAttribute("download", "");
    return;
  }

  const artifactPath = activeFlowStep === "srt" ? data.srt : data.annotation;
  flowArtifactLink.href = artifactPath;
  flowArtifactLink.textContent = "打开真实工件 ↗";
  flowCodeText.textContent = "正在读取仓库内真实工件…";
  flowCode.hidden = false;
  try {
    const text = await readArtifact(artifactPath);
    if (requestId === flowRequestId) flowCodeText.textContent = text;
  } catch (error) {
    if (requestId === flowRequestId) flowCodeText.textContent = `工件读取失败：${error.message}`;
  }
}

function renderCase() {
  const data = caseLibrary[activeCase];
  caseButtons.forEach((button) => {
    const active = button.dataset.case === activeCase;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  caseVideo.pause();
  caseMedia.classList.remove("is-error");
  caseMediaFallback.hidden = true;
  caseVideo.poster = data.poster;
  caseVideo.src = data.video;
  caseVideo.load();
  caseFallbackLink.href = data.video;
  caseVideoStatus.textContent = `REAL RENDER · ${data.type}`;
  caseVideoSpec.textContent = `${data.duration} · 1080×600 · 60 FPS`;
  caseKind.textContent = data.kind;
  caseTitle.textContent = data.title;
  caseSummary.textContent = data.summary;
  caseInput.textContent = data.input;
  caseStrategy.textContent = data.strategy;
  caseFit.textContent = data.fit;
  caseDownload.href = data.video;
  caseTags.replaceChildren(...data.tags.map((tag) => {
    const item = document.createElement("span");
    item.textContent = tag;
    return item;
  }));
  renderFlow();
}

caseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCase = button.dataset.case;
    renderCase();
  });
});

flowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFlowStep = button.dataset.step;
    flowButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    renderFlow();
  });
});

function bindTabKeys(buttons, activate) {
  buttons.forEach((button, index) => {
    button.addEventListener("keydown", (event) => {
      let nextIndex = null;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % buttons.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = buttons.length - 1;
      if (nextIndex === null) return;
      event.preventDefault();
      buttons[nextIndex].focus();
      activate(buttons[nextIndex]);
    });
  });
}

bindTabKeys(caseButtons, (button) => button.click());
bindTabKeys(flowButtons, (button) => button.click());

function showCaseVideoFallback() {
  caseMedia.classList.add("is-error");
  caseMediaFallback.hidden = false;
}

caseVideo.addEventListener("error", showCaseVideoFallback);
caseVideo.addEventListener("loadeddata", () => {
  caseMedia.classList.remove("is-error");
  caseMediaFallback.hidden = true;
});

const schedulePresets = {
  narrative: [
    { id: "left", label: "左侧场景", start: 0.035, duration: 0.302 },
    { id: "center", label: "中间主体", start: 0.349, duration: 0.302 },
    { id: "right", label: "右侧反应", start: 0.663, duration: 0.279 },
  ],
  subject: [
    { id: "left", label: "左侧场景", start: 0.035, duration: 0.244 },
    { id: "center", label: "中间主体", start: 0.302, duration: 0.36 },
    { id: "right", label: "右侧反应", start: 0.686, duration: 0.256 },
  ],
  equal: [
    { id: "left", label: "左侧场景", start: 0.02, duration: 0.29 },
    { id: "center", label: "中间主体", start: 0.335, duration: 0.29 },
    { id: "right", label: "右侧反应", start: 0.65, duration: 0.292 },
  ],
};

function getState() {
  const data = new FormData(form);
  return {
    inkPath: data.get("inkPath"),
    colorFill: data.get("colorFill"),
    duration: Number(data.get("duration")),
    fps: Number(data.get("fps")),
    gridEdge: Number(data.get("gridEdge")),
    brushRadius: Number(data.get("brushRadius")),
    capLongEdge: Number(data.get("capLongEdge")),
    pause: data.get("pause"),
    showHand: data.get("showHand") === "on",
    schedule: data.get("schedule"),
  };
}

function scaledElements(state) {
  return schedulePresets[state.schedule].map((item, index) => ({
    id: item.id,
    label: item.label,
    sequence: index + 1,
    region: index === 0
      ? { x: 20, y: 120, width: 540, height: 780 }
      : index === 1
        ? { x: 560, y: 100, width: 560, height: 800 }
        : { x: 1120, y: 140, width: 532, height: 760 },
    reveal: {
      startMs: Math.round((state.duration * item.start) / 100) * 100,
      durationMs: Math.round((state.duration * item.duration) / 100) * 100,
      protectedRegions: [],
    },
  }));
}

function buildCommand(state) {
  const lines = [
    ".\\.venv\\Scripts\\python.exe scripts\\render_stream_whiteboard.py \\",
    "  scene.png scene.annotation.json output.mp4 assets\\drawing-hand.png \\",
    `  --total-ms ${state.duration} --ink-path ${state.inkPath} --color-fill ${state.colorFill} \\`,
    `  --pause ${state.pause} --fps ${state.fps} --grid-edge ${state.gridEdge} \\`,
    `  --brush-radius ${state.brushRadius} --cap-long-edge ${state.capLongEdge}${state.showHand ? "" : " --bare-tip"}`,
  ];
  return lines.join("\n");
}

function buildAnnotation(state, elements) {
  return {
    sceneId: "scene-01",
    canvas: { width: 1672, height: 941 },
    sceneDurationMs: state.duration,
    elements,
  };
}

function renderTimeline(state, elements) {
  timeline.replaceChildren();
  elements.forEach((element) => {
    const segment = document.createElement("div");
    segment.className = "timeline-segment";
    segment.style.left = `${(element.reveal.startMs / state.duration) * 100}%`;
    segment.style.width = `${(element.reveal.durationMs / state.duration) * 100}%`;
    const text = document.createElement("span");
    const title = document.createElement("strong");
    const timing = document.createElement("small");
    title.textContent = `${element.sequence}. ${element.label}`;
    timing.textContent = `${(element.reveal.startMs / 1000).toFixed(1)}s → ${((element.reveal.startMs + element.reveal.durationMs) / 1000).toFixed(1)}s`;
    text.append(title, timing);
    segment.append(text);
    timeline.append(segment);
  });
  timelineMid.textContent = `${(state.duration / 2000).toFixed(1)}s`;
  timelineEnd.textContent = `${(state.duration / 1000).toFixed(1)}s`;
}

function updateOutputs() {
  const state = getState();
  const elements = scaledElements(state);
  durationOutput.value = `${(state.duration / 1000).toFixed(1)} 秒`;
  durationOutput.textContent = durationOutput.value;
  commandOutput.textContent = buildCommand(state);
  jsonOutput.textContent = JSON.stringify(buildAnnotation(state, elements), null, 2);
  renderTimeline(state, elements);
  copyStatus.textContent = "";
}

form.addEventListener("input", updateOutputs);
form.addEventListener("change", updateOutputs);

document.querySelectorAll(".output-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.output;
    document.querySelectorAll(".output-tab").forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll(".output-view").forEach((view) => {
      const active = view.id === `${target}-panel`;
      view.classList.toggle("is-active", active);
      view.hidden = !active;
    });
  });
});

async function copyCommand() {
  const text = commandOutput.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "命令已复制到剪贴板。";
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.append(area);
    area.select();
    const copied = document.execCommand("copy");
    area.remove();
    copyStatus.textContent = copied ? "命令已复制到剪贴板。" : "复制失败，请手动选择命令文本。";
  }
}

copyButton.addEventListener("click", copyCommand);

const stageButtons = [...document.querySelectorAll(".stage-card")];
stageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const time = Number(button.dataset.seek);
    video.pause();
    video.currentTime = time;
    stageButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  });
});

video.addEventListener("timeupdate", () => {
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8.6;
  videoPlayhead.style.width = `${Math.min(100, (video.currentTime / duration) * 100)}%`;
  const nearest = stageButtons.reduce((best, item) => {
    const delta = Math.abs(Number(item.dataset.seek) - video.currentTime);
    return delta < best.delta ? { item, delta } : best;
  }, { item: stageButtons[0], delta: Infinity }).item;
  stageButtons.forEach((item) => item.classList.toggle("is-active", item === nearest));
});

function showVideoFallback() {
  videoShell.classList.add("is-error");
  videoFallback.hidden = false;
}

video.addEventListener("error", showVideoFallback);
video.querySelector("source")?.addEventListener("error", showVideoFallback);

updateOutputs();
renderCase();
