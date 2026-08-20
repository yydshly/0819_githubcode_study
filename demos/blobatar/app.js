import {
  blobatar,
  _layout,
  _parts,
  normalizeSeed,
  serializeVars,
  VERSION,
  idle,
  happy,
  sad,
  mad,
  surprised,
  wink,
  sleepy,
  smug,
  unsure,
  scared,
  love,
  shy,
  sick,
  thinking,
} from "./blobatar-vendor.js";

const expressions = {
  idle, happy, sad, mad, surprised, wink, sleepy,
  smug, unsure, scared, love, shy, sick, thinking,
};

const expressionLabels = {
  idle: "待机", happy: "开心", sad: "难过", mad: "生气",
  surprised: "惊讶", wink: "眨眼", sleepy: "困倦", smug: "得意",
  unsure: "迟疑", scared: "害怕", love: "喜欢", shy: "害羞",
  sick: "不适", thinking: "思考",
};

const crowds = {
  agents: [
    ["Research", "agent.researcher@lab"], ["Search", "agent.search@lab"],
    ["Writer", "agent.writer@lab"], ["Coder", "agent.coder@lab"],
    ["Reviewer", "agent.reviewer@lab"], ["Planner", "agent.planner@lab"],
    ["Operator", "agent.operator@lab"], ["Safety", "agent.safety@lab"],
  ],
  community: [
    ["Lin", "user-8f3a2c"], ["Maya", "user-447a10"],
    ["Noah", "user-12bc90"], ["Aiko", "user-cc521a"],
    ["Ravi", "user-a81dd2"], ["Emma", "user-902ca7"],
    ["Leo", "user-3b7a19"], ["Zoe", "user-68d0af"],
  ],
  repos: [
    ["Core", "repo/core"], ["Web", "repo/web"], ["Docs", "repo/docs"],
    ["API", "repo/api"], ["Mobile", "repo/mobile"], ["Design", "repo/design"],
    ["Infra", "repo/infra"], ["Labs", "repo/labs"],
  ],
};

const sampleSeeds = [
  "agent.researcher@lab", "agent.thinking@lab", "team-aurora",
  "repo/procedural-identity", "用户-042", "🦊-field-agent",
];

const communityTags = ["新成员", "贡献者", "版主", "设计", "开发", "研究"];

const agentRoles = [
  { name: "Research", seed: "agent.researcher@lab", role: "整合证据" },
  { name: "Search", seed: "agent.search@lab", role: "检索来源" },
  { name: "Writer", seed: "agent.writer@lab", role: "组织表达" },
  { name: "Reviewer", seed: "agent.reviewer@lab", role: "复核结论" },
];

const agentPhases = {
  standby: {
    summary: "四个 Agent 保持固定外观，当前全部待命。",
    agents: [
      ["idle", "queued", "待命", "等待任务"], ["idle", "queued", "待命", "等待任务"],
      ["idle", "queued", "待命", "等待任务"], ["idle", "queued", "待命", "等待任务"],
    ],
  },
  analyze: {
    summary: "研究与搜索 Agent 正在分析，写作和审核 Agent 等待上游结果。",
    agents: [
      ["thinking", "active", "分析中", "整理问题与证据边界"], ["thinking", "active", "检索中", "查找一手资料与实现线索"],
      ["idle", "queued", "待命", "等待研究材料"], ["idle", "queued", "待命", "等待初稿"],
    ],
  },
  execute: {
    summary: "研究材料已就绪，写作 Agent 正在执行，审核 Agent 等待初稿。",
    agents: [
      ["happy", "done", "已完成", "证据包已交付"], ["happy", "done", "已完成", "来源清单已交付"],
      ["thinking", "active", "执行中", "汇总结构与撰写说明"], ["idle", "queued", "待命", "等待初稿"],
    ],
  },
  review: {
    summary: "初稿进入复核；外观仍表示角色，表情和状态标签表达任务进度。",
    agents: [
      ["idle", "done", "已完成", "回答复核问题"], ["idle", "done", "已完成", "补充来源定位"],
      ["unsure", "review", "修订中", "响应审核意见"], ["thinking", "active", "复核中", "检查事实、边界与表达"],
    ],
  },
  complete: {
    summary: "任务完成。四个 Agent 的身份没有改变，只有运行状态发生变化。",
    agents: [
      ["happy", "done", "完成", "研究结论已确认"], ["happy", "done", "完成", "引用来源已确认"],
      ["happy", "done", "完成", "最终说明已生成"], ["happy", "done", "完成", "质量检查已通过"],
    ],
  },
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const state = { expression: "thinking", crowd: "agents", sampleIndex: 0, protocol: "community", agentPhase: "analyze" };

const elements = {
  seed: $("#seedInput"), normalize: $("#normalizeInput"), shape: $("#shapeInput"),
  background: $("#backgroundInput"), hue: $("#hueInput"), hueOutput: $("#hueOutput"),
  lockHue: $("#lockHue"), tone: $("#toneInput"), toneOutput: $("#toneOutput"),
  lockTone: $("#lockTone"), animate: $("#animateInput"), main: $("#mainAvatar"),
  hero: $("#heroAvatar"), crowd: $("#crowdGrid"), expressionButtons: $("#expressionButtons"),
};

function options({ animated = true, expressive = true } = {}) {
  const opts = {
    normalize: elements.normalize.checked,
    background: elements.background.value === "false" ? false : elements.background.value,
  };
  if (elements.shape.value) opts.traits = { shape: Number(elements.shape.value) };
  if (elements.lockHue.checked) opts.hue = Number(elements.hue.value);
  if (elements.lockTone.checked) opts.tone = Number(elements.tone.value) / 100;
  if (expressive) opts.expression = expressions[state.expression];
  if (animated && elements.animate.checked) opts.animate = "always";
  return opts;
}

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function animatedSvg(name, opts, label) {
  const parts = _parts(name, opts);
  const bg = parts.bg ? `<path d="${parts.bg.d}" fill="${parts.bg.fill}"/>` : "";
  const cls = parts.cls ? ` class="${parts.cls}"` : "";
  const vars = parts.vars ? ` style="${serializeVars(parts.vars)}"` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="${escapeAttribute(label)}">${bg}<g${cls}${vars}>${parts.inner}</g></svg>`;
}

function dataUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function rounded(value, digits = 1) {
  return Number(value).toFixed(digits).replace(/\.0$/, "");
}

function updateMetrics(layout) {
  $("#metricShape").textContent = layout.shape;
  $("#metricBody").textContent = `${rounded(layout.body.rx)} × ${rounded(layout.body.ry)}`;
  $("#metricEyes").textContent = `${rounded(layout.eyes[0].rx)} / ${rounded(layout.eyes[1].rx)}`;
  $("#metricPalette").textContent = `${layout.palette.head} · ${layout.palette.eye}`;
  $("#heroShape").textContent = layout.shape.toUpperCase();
}

function updateChecks(seed, opts) {
  const staticOpts = { ...opts };
  delete staticOpts.animate;
  const first = blobatar(seed, staticOpts);
  const second = blobatar(seed, staticOpts);
  $("#stableResult").textContent = first === second ? "PASS · 字节完全一致" : "FAIL · 输出发生漂移";

  const normalizedVariant = `  ${seed.toUpperCase()}  `;
  const same = first === blobatar(normalizedVariant, { ...staticOpts, normalize: true });
  const raw = normalizeSeed(seed);
  $("#normalizationResult").textContent = elements.normalize.checked
    ? `${same ? "PASS" : "CHECK"} · “${normalizedVariant.trim()}” 归一为 “${raw}”`
    : "RAW · 已关闭名称规范化，大小写和空格会改变身份";
}

function renderCrowd(kind = state.crowd) {
  state.crowd = kind;
  const crowdOpts = options({ animated: false, expressive: false });
  elements.crowd.innerHTML = crowds[kind].map(([name, seed]) => {
    const svg = blobatar(seed, crowdOpts);
    const shape = _layout(seed, crowdOpts).shape;
    return `<article class="crowd-card"><img src="${dataUri(svg)}" alt="${escapeAttribute(name)} 的 Blobatar"/><strong>${escapeAttribute(name)}</strong><span>${shape} · ${escapeAttribute(seed)}</span></article>`;
  }).join("");
  $$('[data-crowd]').forEach((button) => button.classList.toggle("active", button.dataset.crowd === kind));
}

function render() {
  const seed = elements.seed.value || "anonymous";
  const opts = options();
  const layout = _layout(seed, opts);
  const label = `${seed} 的 ${layout.shape} Blobatar，${expressionLabels[state.expression]}表情`;
  const svg = animatedSvg(seed, opts, label);
  elements.main.innerHTML = svg;
  elements.hero.innerHTML = svg;
  $("#heroIdentity").textContent = seed;
  updateMetrics(layout);
  updateChecks(seed, opts);
  renderCrowd();
}

function initializeExpressions() {
  elements.expressionButtons.innerHTML = Object.keys(expressions).map((name) =>
    `<button type="button" data-expression="${name}" title="${name}">${expressionLabels[name]}</button>`
  ).join("");
  $$('[data-expression]').forEach((button) => {
    button.addEventListener("click", () => {
      state.expression = button.dataset.expression;
      $$('[data-expression]').forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });
  $(`[data-expression="${state.expression}"]`).classList.add("active");
}

function renderMiniCrowds() {
  $$('[data-mini]').forEach((container) => {
    const kind = container.dataset.mini;
    const opts = { background: "squircle" };
    container.innerHTML = crowds[kind].slice(0, 3).map(([name, seed]) =>
      `<img src="${dataUri(blobatar(seed, opts))}" alt="${escapeAttribute(name)}"/>`
    ).join("");
  });
}

function renderCommunityProtocol() {
  $("#identityCommunityGrid").innerHTML = crowds.community.slice(0, 6).map(([name, seed], index) =>
    `<article class="identity-person">
      <img src="${dataUri(blobatar(seed, { background: "squircle" }))}" alt="${escapeAttribute(name)} 的稳定默认头像"/>
      <strong>${escapeAttribute(name)}</strong>
      <span>${escapeAttribute(seed)}</span>
      <small>${communityTags[index]}</small>
    </article>`
  ).join("");
}

function renderAgentProtocol() {
  const phase = agentPhases[state.agentPhase];
  $("#agentPhaseSummary").textContent = phase.summary;
  $("#agentIdentityGrid").innerHTML = agentRoles.map((agent, index) => {
    const [expression, visualState, status, task] = phase.agents[index];
    const label = `${agent.name} Agent，角色为${agent.role}，当前状态${status}：${task}`;
    const agentOpts = { background: "squircle", expression: expressions[expression] };
    if (visualState === "active") agentOpts.animate = "always";
    const svg = animatedSvg(agent.seed, agentOpts, label);
    return `<article class="agent-identity-card">
      <div class="agent-avatar-frame">${svg}<span class="agent-state-dot" data-state="${visualState}" aria-hidden="true"></span></div>
      <div class="agent-card-heading"><strong>${agent.name}</strong><span>${status}</span></div>
      <p>${task}</p>
      <code>${agent.seed} · ${agent.role}</code>
    </article>`;
  }).join("");
  $$('[data-agent-phase]').forEach((button) => {
    const active = button.dataset.agentPhase === state.agentPhase;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function switchProtocol(protocol) {
  state.protocol = protocol;
  $$('[data-protocol]').forEach((button) => {
    const selected = button.dataset.protocol === protocol;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  $("#communityProtocol").hidden = protocol !== "community";
  $("#agentsProtocol").hidden = protocol !== "agents";
  if (protocol === "agents") renderAgentProtocol();
}

function updateRangeState() {
  elements.hue.disabled = !elements.lockHue.checked;
  elements.tone.disabled = !elements.lockTone.checked;
  elements.hueOutput.textContent = elements.lockHue.checked ? `${elements.hue.value}°` : "Seed";
  elements.toneOutput.textContent = elements.lockTone.checked ? `${elements.tone.value}%` : "Seed";
}

function downloadCurrent() {
  const seed = elements.seed.value || "anonymous";
  const svg = blobatar(seed, options({ animated: false }));
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `blobatar-${seed.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "anonymous"}.svg`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

initializeExpressions();
renderMiniCrowds();
renderCommunityProtocol();
renderAgentProtocol();
updateRangeState();
$("#footerVersion").textContent = VERSION;

elements.seed.addEventListener("input", render);
[elements.normalize, elements.shape, elements.background, elements.animate].forEach((input) => input.addEventListener("change", render));
[elements.hue, elements.tone].forEach((input) => input.addEventListener("input", () => { updateRangeState(); render(); }));
[elements.lockHue, elements.lockTone].forEach((input) => input.addEventListener("change", () => { updateRangeState(); render(); }));
$("#randomSeed").addEventListener("click", () => {
  state.sampleIndex = (state.sampleIndex + 1) % sampleSeeds.length;
  elements.seed.value = sampleSeeds[state.sampleIndex];
  render();
});
$("#downloadAvatar").addEventListener("click", downloadCurrent);
$$('[data-crowd]').forEach((button) => button.addEventListener("click", () => renderCrowd(button.dataset.crowd)));
$$('[data-protocol]').forEach((button, index, buttons) => {
  button.addEventListener("click", () => switchProtocol(button.dataset.protocol));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const targetIndex = event.key === "Home" ? 0
      : event.key === "End" ? buttons.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
    buttons[targetIndex].focus();
    switchProtocol(buttons[targetIndex].dataset.protocol);
  });
});
$$('[data-agent-phase]').forEach((button) => button.addEventListener("click", () => {
  state.agentPhase = button.dataset.agentPhase;
  renderAgentProtocol();
}));

render();
switchProtocol(state.protocol);
