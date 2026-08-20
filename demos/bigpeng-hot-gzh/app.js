const presets = {
  a: [
    {
      id: "xiaohongshu",
      label: "小红书封面 Skill",
      source: "我把最近两个月用 AI 做小红书封面的流程收成了 8 个 Skill，从选题、文案、出图到封面文字都覆盖。",
      audience: "自己做号的中文创作者",
      object: "小红书封面",
      count: 8,
      outcome: "从选题到出图不用再临时想",
      evidence: "8 个 Skill 的安装方法和真实用例",
      comparison: "每次让 AI 重新想封面"
    },
    {
      id: "research",
      label: "开源 Skill 研究",
      source: "我建立了一个开源 Agent Skill 研究库，用统一方法记录能力、原理、边界、可运行 Demo 和后续实验。",
      audience: "AI 工具研究者",
      object: "开源 Agent Skill",
      count: 7,
      outcome: "快速判断哪些值得深入研究",
      evidence: "7 个子项目的原理、边界与 Demo",
      comparison: "只看 GitHub Star 就判断价值"
    }
  ],
  b: [
    {
      id: "workbuddy",
      label: "WorkBuddy × 体制内",
      source: "WorkBuddy，体制内办公",
      audience: "体制内用户",
      object: "WorkBuddy",
      count: 6,
      outcome: "把周报、纪要和请示收成可复用流程",
      evidence: "一份真实周报的前后对比",
      comparison: "每次从空白聊天开始"
    },
    {
      id: "video",
      label: "Codex × 短视频",
      source: "Codex，普通人做短视频",
      audience: "中文短视频创作者",
      object: "Codex 短视频工作流",
      count: 5,
      outcome: "从选题、脚本到字幕一次跑通",
      evidence: "一条真实视频的流程、时间和产物",
      comparison: "在多个工具之间来回搬运"
    }
  ]
};

const state = { route: "a", preset: "xiaohongshu" };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const fields = {
  source: $("#source-input"),
  audience: $("#audience-input"),
  object: $("#object-input"),
  count: $("#count-input"),
  outcome: $("#outcome-input"),
  evidence: $("#evidence-input"),
  comparison: $("#comparison-input")
};

function visibleLength(value) {
  return [...value.replace(/\s/g, "")].length;
}

function currentValues() {
  return Object.fromEntries(Object.entries(fields).map(([key, element]) => [key, element.value.trim()]));
}

function applyPreset(preset) {
  Object.entries(fields).forEach(([key, element]) => {
    element.value = preset[key] ?? "";
  });
  state.preset = preset.id;
  $$(".preset-button").forEach((button) => button.classList.toggle("is-active", button.dataset.preset === preset.id));
  updateAgentCommand();
  renderResults();
}

function renderPresets() {
  const row = $("#preset-row");
  row.replaceChildren();
  presets[state.route].forEach((preset) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "preset-button";
    button.dataset.preset = preset.id;
    button.textContent = preset.label;
    button.addEventListener("click", () => applyPreset(preset));
    row.append(button);
  });
}

function setRoute(route, focus = false) {
  state.route = route;
  const isA = route === "a";
  $$("[role='tab']").forEach((tab) => {
    const active = tab.dataset.route === route;
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  $("#route-panel").setAttribute("aria-labelledby", isA ? "tab-a" : "tab-b");
  $("#route-code").textContent = isA ? "PATH A" : "PATH B";
  $("#result-route").textContent = isA ? "PATH A" : "PATH B";
  $("#source-label").textContent = isA ? "草稿 / 明确主题" : "关键词 / 一句话想法";
  $("#object-label").textContent = isA ? "对象 / 任务" : "核心关键词";
  $("#source-help").textContent = isA
    ? "真实 Skill 会从这里抽取槽位；Demo 用下方显式字段保证可复现。"
    : "本 Demo 不伪造当前热点；空输入时需要宿主 Agent 执行 Web Search。";
  $("#generate-label").textContent = isA ? "生成 6 条候选标题" : "生成 4 个选题方向";
  $("#understanding-label").textContent = isA ? "选题理解" : "输入理解";
  $("#result-summary").textContent = isA ? "已有选题 → 6 条候选" : "只有关键词 → 4 个方向";
  $$(".route-a-only").forEach((element) => { element.hidden = !isA; });
  renderPresets();
  applyPreset(presets[route][0]);
}

function makeCandidate(title, formula, why, promise) {
  const length = visibleLength(title);
  const hasBanned = /震惊|重磅|炸裂|干货满满|一系列|多个/.test(title);
  return {
    title,
    formula,
    why,
    promise,
    length,
    lengthStatus: length >= 18 && length <= 32,
    truthStatus: !hasBanned
  };
}

function generatePathA(values) {
  const n = Number(values.count);
  return [
    makeCandidate(`${values.audience}必装的${n}个${values.object} Skill`, "数字清单", "身份 + 具体数字 + 明确对象", `正文必须真有 ${n} 条，并提供${values.evidence}`),
    makeCandidate(`我把${values.object}拆成${n}步，${values.outcome}`, "我+代价+收获", "第一人称工作量 + 可感知结果", `必须解释 ${n} 步怎样得到该结果，并提供${values.evidence}`),
    makeCandidate(`做${values.object}，真正缺的不是灵感，是一套可复用流程`, "反转结论", "否定常见归因，给出更具体的机制", `需用${values.evidence}证明“流程”比灵感更关键`),
    makeCandidate(`${n}步速通${values.object}：${values.outcome}`, "速成教程", "用具体步数和结果降低阅读成本", `正文顺序必须能让读者跟着完成 ${n} 步`),
    makeCandidate(`与其${values.comparison || "每次从头开始"}，不如用${n}步做完${values.object}`, "对比站队", "把旧做法和可复用做法放在同一任务中", `需对比两种做法在同一个${values.object}任务上的产物或时间`),
    makeCandidate(`${values.object}这件事，终于不用每次从头来`, "情绪短句", "短、口语，只作一条备选", `短标题后必须有${values.evidence}支撑，默认不做首选`)
  ];
}

function generatePathB(values) {
  const n = Number(values.count);
  return [
    {
      template: "身份场景化",
      direction: `${values.audience}如何把${values.object}接入真实工作`,
      why: "新意不来自工具名，而来自具体身份的高频任务。",
      evidence: values.evidence,
      titles: [
        makeCandidate(`${values.audience}用${values.object}，真正省事的是这一套`, "情绪短句", "身份明确、口语化", values.evidence),
        makeCandidate(`我用${values.object}${values.outcome}，${values.audience}可直接照做`, "我+代价+收获", "真实场景 + 可复用结果", values.evidence),
        makeCandidate(`${values.audience}别只会聊天，${values.object}要这样用`, "反转结论", "挑战低效用法", values.evidence)
      ]
    },
    {
      template: "必装清单",
      direction: `为${values.audience}整理 ${n} 个${values.object}可执行流程`,
      why: "适合用户确实能提供多个可安装、可复用的工作单元。",
      evidence: `真有 ${n} 条，每条有一个应用场景；${values.evidence}`,
      titles: [
        makeCandidate(`${values.audience}必装的${n}个${values.object}工作流`, "数字清单", "身份 + 数字 + 对象", `提供 ${n} 条真实流程`),
        makeCandidate(`我整理了${n}个${values.object}用法，终于${values.outcome}`, "我+代价+收获", "整理代价 + 可感知收获", values.evidence),
        makeCandidate(`${n}个${values.object}工作流，把重复办公从头做成复用`, "反转结论", "从一次性对话变成可复用系统", values.evidence)
      ]
    },
    {
      template: "从 0 到 1 教程",
      direction: `让第一次接触${values.object}的${values.audience}跟着完成一个任务`,
      why: "弱化功能介绍，以能完成一件真实任务为终点。",
      evidence: values.evidence,
      titles: [
        makeCandidate(`${n}步把${values.object}从零用到${values.outcome}`, "速成教程", "步数 + 学习结果", values.evidence),
        makeCandidate(`${values.object}保姆级教程：${values.audience}第一次也能跑通`, "速成教程", "对象靠前 + 身份门槛", values.evidence),
        makeCandidate(`别先学${values.object}全部功能，先用它${values.outcome}`, "反转结论", "反对先学功能，改为任务驱动", values.evidence)
      ]
    },
    {
      template: "反常识 / 情绪钩",
      direction: `挑战“会用${values.object}就等于会工作”的直觉`,
      why: "把问题从工具操作转向可复用的任务结构。",
      evidence: values.evidence,
      titles: [
        makeCandidate(`你觉得${values.object}不好用，可能是因为还没把任务收成流程`, "反转结论", "给低效归因一个可验证的新解释", values.evidence),
        makeCandidate(`${values.audience}用${values.object}最贵的错，是每次都从头聊`, "反转结论", "身份 + 成本感", values.evidence),
        makeCandidate(`${values.object}不缺提示词，缺的是这${n}个可复用步骤`, "数字清单", "反转 + 具体数字", `列出 ${n} 个步骤并提供${values.evidence}`)
      ]
    }
  ];
}

function validate(values) {
  const required = ["source", "audience", "object", "count", "outcome", "evidence"];
  const missing = required.filter((key) => !values[key]);
  if (missing.length) return "请先填完输入、身份、对象、数字、结果和证据。";
  if (Number(values.count) < 2 || Number(values.count) > 99) return "数字必须是 2–99 之间的具体整数。";
  return "";
}

function candidateCard(candidate, index) {
  const article = document.createElement("article");
  article.className = "result-card";
  const header = document.createElement("div");
  header.className = "result-card-header";
  const number = document.createElement("span");
  number.className = "result-index";
  number.textContent = String(index + 1).padStart(2, "0");
  const title = document.createElement("h3");
  title.textContent = candidate.title;
  header.append(number, title);
  const meta = document.createElement("div");
  meta.className = "result-meta";
  [
    { text: candidate.formula, type: "" },
    { text: `${candidate.length} 字`, type: candidate.lengthStatus ? "pass" : "warn" },
    { text: candidate.lengthStatus ? "长度合格" : "长度待调", type: candidate.lengthStatus ? "pass" : "warn" },
    { text: candidate.truthStatus ? "禁用词通过" : "命中禁用词", type: candidate.truthStatus ? "pass" : "warn" }
  ].forEach(({ text, type }) => {
    const pill = document.createElement("span");
    pill.className = `pill${type ? ` pill--${type}` : ""}`;
    pill.textContent = text;
    meta.append(pill);
  });
  const detail = document.createElement("div");
  detail.className = "result-detail";
  const why = document.createElement("span");
  const whyStrong = document.createElement("strong");
  whyStrong.textContent = "为何可能点：";
  why.append(whyStrong, candidate.why);
  const promise = document.createElement("span");
  const promiseStrong = document.createElement("strong");
  promiseStrong.textContent = "兑现：";
  promise.append(promiseStrong, candidate.promise);
  detail.append(why, promise);
  article.append(header, meta, detail);
  return article;
}

function renderPathA(values) {
  const candidates = generatePathA(values);
  const results = $("#results");
  results.replaceChildren(...candidates.map(candidateCard));
  $("#understanding-text").textContent = `给${values.audience}看，围绕${values.object}，核心结果是“${values.outcome}”。`;
  const winner = candidates[0];
  $("#winner-title").textContent = winner.title;
  $("#winner-reason").textContent = "对象、身份和数字在前半段就成立；数字来自输入，且正文有明确兑现物。";
  return `## 选题理解\n给${values.audience}看，围绕${values.object}，核心结果是“${values.outcome}”。\n\n## 候选标题\n\n${candidates.map((item, index) => `${index + 1}. **${item.title}**\n   - 公式：${item.formula}\n   - 字数：${item.length}\n   - 兑现：${item.promise}`).join("\n\n")}\n\n## 首选\n**${winner.title}**`;
}

function renderPathB(values) {
  const directions = generatePathB(values);
  const results = $("#results");
  results.replaceChildren();
  directions.forEach((direction, directionIndex) => {
    const block = document.createElement("article");
    block.className = "direction-block";
    const header = document.createElement("div");
    header.className = "direction-header";
    const type = document.createElement("span");
    type.textContent = `DIRECTION ${String(directionIndex + 1).padStart(2, "0")} / ${direction.template}`;
    const title = document.createElement("h3");
    title.textContent = direction.direction;
    const description = document.createElement("p");
    description.textContent = `${direction.why} 建议证据：${direction.evidence}`;
    header.append(type, title, description);
    const titles = document.createElement("div");
    titles.className = "direction-titles";
    direction.titles.forEach((candidate, titleIndex) => {
      const row = document.createElement("div");
      row.className = "direction-title";
      const number = document.createElement("span");
      number.textContent = `${titleIndex + 1}.`;
      const content = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = candidate.title;
      const small = document.createElement("small");
      small.textContent = `${candidate.formula} / ${candidate.length} 字 / 兑现：${candidate.promise}`;
      content.append(strong, small);
      row.append(number, content);
      titles.append(row);
    });
    block.append(header, titles);
    results.append(block);
  });
  $("#understanding-text").textContent = `关键词：${values.object} × ${values.audience}。不绑定伪造的当前热点，先用可复用模板发散。`;
  const winner = directions[0].titles[0];
  $("#winner-title").textContent = `${directions[0].direction} · ${winner.title}`;
  $("#winner-reason").textContent = "身份明确、可执行，不依赖未经搜索验证的新品热度。";
  return `## 输入理解\n关键词：${values.object} × ${values.audience}\n\n${directions.map((direction, index) => `## 方向 ${index + 1}：${direction.direction}\n- 模板：${direction.template}\n- 建议证据：${direction.evidence}\n\n${direction.titles.map((item, titleIndex) => `${titleIndex + 1}. **${item.title}**（${item.formula} / ${item.length} 字）`).join("\n")}`).join("\n\n")}\n\n## 最值得先写\n**${directions[0].direction} · ${winner.title}**`;
}

function updateAgentCommand() {
  const values = currentValues();
  const command = state.route === "a"
    ? `用 bigpeng-hot-gzh 帮我起几个爆款公众号标题。\n\n草稿 / 想法：${values.source}\n目标读者：${values.audience}\n正文会兑现：${values.evidence}\n\n请走路径 A，用不同公式给 6 条候选并标一条首选。`
    : `用 bigpeng-hot-gzh 给我几个公众号选题。\n\n关键词：${values.source}\n目标读者：${values.audience}\n可提供证据：${values.evidence}\n\n请走路径 B，默认给 4 个不重复的选题方向，每个方向配 3 条标题。`;
  $("#agent-command").textContent = command;
}

function renderResults() {
  const values = currentValues();
  const error = validate(values);
  $("#form-error").hidden = !error;
  $("#form-error").textContent = error;
  updateAgentCommand();
  if (error) return false;
  const markdown = state.route === "a" ? renderPathA(values) : renderPathB(values);
  $("#results-text").value = markdown;
  return true;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 1800);
}

async function copyTarget(id, button) {
  const target = document.getElementById(id);
  const value = "value" in target ? target.value : target.textContent;
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = value;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  const original = button.textContent;
  button.textContent = "已复制";
  showToast("内容已复制");
  setTimeout(() => { button.textContent = original; }, 1800);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $(".theme-label").textContent = theme === "dark" ? "浅色" : "深色";
  try { localStorage.setItem("bigpeng-lab-theme", theme); } catch { /* storage may be disabled */ }
}

$$("[role='tab']").forEach((tab) => {
  tab.addEventListener("click", () => setRoute(tab.dataset.route));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    setRoute(tab.dataset.route === "a" ? "b" : "a", true);
  });
});

$("#generator-form").addEventListener("submit", (event) => {
  event.preventDefault();
  if (renderResults()) $(".result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
});

Object.values(fields).forEach((field) => field.addEventListener("input", updateAgentCommand));
$$('[data-copy-target]').forEach((button) => button.addEventListener("click", () => copyTarget(button.dataset.copyTarget, button)));
$("#theme-toggle").addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

let preferredTheme = "light";
try {
  preferredTheme = localStorage.getItem("bigpeng-lab-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch {
  preferredTheme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
setTheme(preferredTheme);
setRoute("a");
