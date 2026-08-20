const scenarios = {
  engagement: {
    index: "MAP 01",
    title: "新品牌全案",
    summary: "固定 12 阶段推进，建立可复用的品牌与项目状态",
    brief: "我们刚签下一家 B2B SaaS 客户，请建立品牌档案并制定未来 12 个月的完整营销策略。",
    pipeline: [
      ["ROUTE", "Skill 路由", "engagement-workflow 匹配需求", "skill"],
      ["CTX", "品牌建档", "语气、受众、地区、目标、竞品", "skill"],
      ["MODEL", "12 阶段研究", "宿主模型按 61 个明确步骤生成", "model"],
      ["PY", "状态与断点", "engagement-state + checkpoint", "script"],
      ["HUMAN", "客户验证", "接受、修改或触发选择性重跑", "human"],
      ["OUTPUT", "策略资产", "增长计划、年度日历、渠道文档", "skill"],
    ],
    deliverables: ["品牌 profile 与 Living Instruction File", "四份核心战略文档与竞争/市场分析", "增长计划、年度规划和渠道策略"],
    decisions: ["哪些客户观点可以视为事实", "是否接受定位与重跑方案", "预算、优先级和最终对外版本"],
    boundaries: ["市场研究一定完整或无偏", "60 分钟产物等同于数周咨询质量", "生成策略自动带来商业增长"],
  },
  content: {
    index: "MAP 02",
    title: "内容上线",
    summary: "把一次写作请求变成有工件、有检查、有发布边界的管线",
    brief: "为我们的数据安全产品写一篇面向 CTO 的博客，并确保声明有证据、符合品牌语气且可以发布。",
    pipeline: [
      ["ROUTE", "内容能力链", "content-brief → content-engine", "skill"],
      ["CTX", "品牌与证据", "profile、指南、来源、关键词", "skill"],
      ["MODEL", "提纲与草稿", "宿主模型负责开放式写作", "model"],
      ["PY", "确定性扫描", "声明、语气、结构、可读性", "script"],
      ["GATE", "发布前门禁", "PASS / WARN / BLOCKED", "human"],
      ["MCP", "CMS 准备", "有连接器和批准后才发布", "connector"],
    ],
    deliverables: ["研究、提纲、草稿与事实检查工件", "品牌语气、SEO 和结构检查结果", "发布就绪正文或明确的阻塞项"],
    decisions: ["来源是否足够支持关键声明", "法律/品牌风险是否可接受", "是否批准 CMS 写入或发布"],
    boundaries: ["AI 检测能证明文本由谁创作", "内容正确就一定获得排名或转化", "未连接 CMS 也能真正发布"],
  },
  search: {
    index: "MAP 03",
    title: "SEO / AEO",
    summary: "组合技术检查、关键词与六类 AI 搜索可见性框架",
    brief: "审计我们的网站 SEO，并检查品牌是否会在 ChatGPT、Perplexity 和 Google AI 搜索中被正确描述。",
    pipeline: [
      ["INPUT", "站点与查询", "URL、关键词、品牌实体、竞品", "skill"],
      ["ROUTE", "审计分流", "SEO / AEO / GEO 专项 Skill", "skill"],
      ["PY", "结构化分析", "页面、链接、实体、关键词和趋势", "script"],
      ["MODEL", "解释与建议", "宿主模型综合证据形成方案", "model"],
      ["GATE", "证据校验", "实际数据与推断分开标记", "human"],
      ["OUTPUT", "修复路线", "问题清单、优先级与监控计划", "skill"],
    ],
    deliverables: ["技术/页面/内容 SEO 问题清单", "六类 AI 搜索表面的可见性框架", "实体、内容缺口和 90 天优化路线"],
    decisions: ["是否提供 GSC、排名和站点爬取数据", "哪些建议进入开发排期", "如何验证 AI 回答的地区与时间差异"],
    boundaries: ["没有 API/搜索结果也能得出实时排名", "一次探测代表所有用户的 AI 回答", "修复建议自动带来流量增长"],
  },
  campaign: {
    index: "MAP 04",
    title: "广告投放",
    summary: "把策略、预算、创意和外部平台动作放进审批链",
    brief: "为新品制定 Google 与 Meta 广告计划，分配预算，创建创意，并准备在账户中启动广告。",
    pipeline: [
      ["CTX", "读取营销目标", "品牌、受众、报价、漏斗和 KPI", "skill"],
      ["MODEL", "媒介与创意", "计划、渠道、文案、测试矩阵", "model"],
      ["PY", "预算计算", "预算、节奏、ROI 与健康阈值", "script"],
      ["HUMAN", "高风险审批", "金额、受众、素材和启停确认", "human"],
      ["MCP", "请求 Manifest", "解析已配置广告连接器", "connector"],
      ["LOG", "执行与日志", "平台响应、结果和回滚信息", "script"],
    ],
    deliverables: ["跨渠道媒介计划与预算节奏", "广告文案、素材 brief 和 A/B 结构", "审批记录与平台请求 manifest"],
    decisions: ["真实预算和投放账户范围", "法规、品牌和受众排除条件", "是否批准创建、启用或暂停广告"],
    boundaries: ["默认拥有 Google/Meta 账户权限", "本地 approval 等同于企业授权", "预算模型能够保证 ROAS"],
  },
  report: {
    index: "MAP 05",
    title: "经营复盘",
    summary: "把连接器数据、确定性计算和管理层叙事分开处理",
    brief: "汇总过去 90 天的渠道表现，解释异常、归因和客户流失风险，并输出管理层月报。",
    pipeline: [
      ["MCP", "数据输入", "分析、CRM、广告与邮件连接器", "connector"],
      ["PY", "规范化", "指标、时间窗、基准与异常检查", "script"],
      ["AGENT", "专项分析", "归因、cohort、漏斗、流失风险", "skill"],
      ["MODEL", "管理层叙事", "解释变化、假设和建议", "model"],
      ["HUMAN", "业务校正", "核对事件、季节性和数据缺口", "human"],
      ["OUTPUT", "报告与追踪", "月报、仪表盘和下一步行动", "skill"],
    ],
    deliverables: ["趋势、异常、归因与 cohort 分析", "管理层摘要、风险和建议", "跨品牌 dashboard 与后续动作清单"],
    decisions: ["指标口径和归因窗口", "异常是否由业务事件造成", "哪些建议被批准进入执行"],
    boundaries: ["缺失或错误数据能被模型自动修复", "归因模型等同于因果证明", "报告建议无需业务负责人复核"],
  },
};

const perspectives = {
  engineering: {
    score: "8.2",
    width: "82%",
    label: "适合作为大规模 Skill 系统的工程样本",
    title: "它把“专业 SOP 如何变成 Agent 系统”展示得非常完整。",
    description: "Skill 路由、角色契约、确定性脚本、品牌状态、长任务恢复、质量门禁和外部执行边界都能从源码中直接研究。",
    points: ["163 个 Skill 的规模化路由", "LLM 与确定性脚本分工", "checkpoint 与多品牌状态"],
  },
  effectiveness: {
    score: "4.6",
    width: "46%",
    label: "营销效果仍需要独立实验",
    title: "软件测试很多，但尚不能证明它能稳定提升营销结果。",
    description: "现有测试主要覆盖代码、文档、状态和契约。README 中的时间、成本与效率数字还需要对照实验、专家盲评和真实业务指标验证。",
    points: ["缺少独立营销效果基准", "测试通过 ≠ 收入或排名提升", "效果高度依赖输入与连接器数据"],
  },
};

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

function appendList(target, items) {
  target.replaceChildren(...items.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));
}

function renderScenario(key, animate = true) {
  const scenario = scenarios[key];
  const stage = qs(".scenario-stage");
  qs(".status-index").textContent = scenario.index;
  qs("#scenario-title").textContent = scenario.title;
  qs("#scenario-summary").textContent = scenario.summary;

  const steps = scenario.pipeline.map(([tag, title, detail, type], index) => {
    const article = document.createElement("article");
    article.className = "pipeline-step";
    article.dataset.type = type;
    article.style.setProperty("--step", index);
    const badge = document.createElement("span");
    badge.textContent = tag;
    const strong = document.createElement("strong");
    strong.textContent = title;
    const small = document.createElement("small");
    small.textContent = detail;
    article.append(badge, strong, small);
    return article;
  });
  qs("#pipeline-track").replaceChildren(...steps);
  appendList(qs("#deliverables-list"), scenario.deliverables);
  appendList(qs("#decisions-list"), scenario.decisions);
  appendList(qs("#boundaries-list"), scenario.boundaries);

  if (animate) {
    stage.classList.remove("is-updating");
    requestAnimationFrame(() => stage.classList.add("is-updating"));
  }
}

function selectScenario(button) {
  qsa(".scenario-button").forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  const key = button.dataset.scenario;
  qs("#task-brief").value = scenarios[key].brief;
  renderScenario(key);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const toggle = qs(".theme-toggle");
  const dark = theme === "dark";
  toggle.setAttribute("aria-pressed", String(dark));
  qs(".theme-label", toggle).textContent = dark ? "浅色" : "深色";
  try { localStorage.setItem("dmp-lab-theme", theme); } catch (_) { /* storage may be unavailable */ }
}

function initializeTheme() {
  let stored = null;
  try { stored = localStorage.getItem("dmp-lab-theme"); } catch (_) { /* storage may be unavailable */ }
  const preferredDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  setTheme(stored || (preferredDark ? "dark" : "light"));
}

function filterCapabilities(filter, activeButton) {
  let visible = 0;
  qsa(".capability-card").forEach((card) => {
    const show = filter === "all" || card.dataset.domain === filter;
    card.classList.toggle("is-hidden", !show);
    if (show) visible += 1;
  });
  qsa(".filter-button").forEach((button) => {
    const active = button === activeButton;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  qs(".filter-count b").textContent = visible;
}

function renderPerspective(key, activeButton) {
  const perspective = perspectives[key];
  qs("#verdict-score").textContent = perspective.score;
  qs("#score-fill").style.width = perspective.width;
  qs("#verdict-label").textContent = perspective.label;
  qs("#verdict-title").textContent = perspective.title;
  qs("#verdict-description").textContent = perspective.description;
  appendList(qs("#verdict-points"), perspective.points);
  qsa(".perspective-button").forEach((button) => {
    const active = button === activeButton;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function initializeInteractions() {
  qsa(".scenario-button").forEach((button) => button.addEventListener("click", () => selectScenario(button)));

  qs(".map-button").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const active = qs(".scenario-button.is-active");
    button.classList.add("is-running");
    button.firstChild.textContent = "正在映射… ";
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      renderScenario(active.dataset.scenario);
      button.classList.remove("is-running");
      button.firstChild.textContent = "重新生成映射 ";
      qs(".status-badge").textContent = "映射完成";
    }, reduced ? 0 : 420);
  });

  qs(".theme-toggle").addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  qsa(".filter-button").forEach((button) => {
    button.addEventListener("click", () => filterCapabilities(button.dataset.filter, button));
  });

  qsa(".perspective-button").forEach((button) => {
    button.addEventListener("click", () => renderPerspective(button.dataset.perspective, button));
  });
}

initializeTheme();
renderScenario("engagement", false);
renderPerspective("engineering", qs('.perspective-button[data-perspective="engineering"]'));
initializeInteractions();
