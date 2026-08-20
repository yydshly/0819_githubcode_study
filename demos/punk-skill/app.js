(function () {
  "use strict";

  const scenarios = window.PUNK_SKILL_SCENARIOS || [];
  const extensions = window.PUNK_SKILL_EXTENSIONS || [];
  const upstreamStyles = window.PUNK_SKILL_UPSTREAM_STYLES || [];
  const publicationPresets = window.PUNK_PUBLISH_PRESETS || [];
  let activeScenario = scenarios[0];
  let activeStyleId = activeScenario?.selectedStyle;
  let activeGalleryFilter = "all";
  const enabledExtensions = new Set(extensions.map((item) => item.id));

  const $ = (selector) => document.querySelector(selector);
  const elements = {
    tabs: $("#scenario-tabs"),
    scenarioGoal: $("#scenario-goal"),
    scenarioFit: $("#scenario-fit"),
    scenarioAdaptation: $("#scenario-adaptation"),
    scenarioDeliverable: $("#scenario-deliverable"),
    sourcePlatform: $("#source-platform"),
    sourceText: $("#source-text"),
    summary: $("#field-summary"),
    subject: $("#field-subject"),
    mood: $("#field-mood"),
    metaphor: $("#field-metaphor"),
    audience: $("#field-audience"),
    previewRatio: $("#preview-ratio"),
    frame: $("#cover-frame"),
    previewImage: $("#preview-image"),
    kicker: $("#preview-kicker"),
    visualTitle: $("#preview-visual-title"),
    subtitle: $("#preview-subtitle"),
    styleOptions: $("#style-options"),
    styleReason: $("#style-reason"),
    promptStyleId: $("#prompt-style-id"),
    promptOutput: $("#prompt-output"),
    boundaryList: $("#boundary-list"),
    copyPrompt: $("#copy-prompt"),
    copyFeedback: $("#copy-feedback"),
    extensionOptions: $("#extension-options"),
    extensionCount: $("#extension-count"),
    extensionManifest: $("#extension-manifest"),
    copyManifest: $("#copy-manifest"),
    manifestFeedback: $("#manifest-feedback"),
    themeToggle: $("#theme-toggle"),
    themeIcon: $("#theme-icon"),
    galleryGrid: $("#upstream-grid"),
    galleryCount: $("#gallery-count"),
    gallerySearch: $("#gallery-search"),
    galleryFilters: document.querySelectorAll("[data-gallery-filter]"),
    galleryEmpty: $("#gallery-empty"),
    useModeButtons: document.querySelectorAll("[data-use-mode]"),
    useSource: $("#use-source"),
    useSourceLabel: $("#use-source-label"),
    useSourceHint: $("#use-source-hint"),
    usePlatformField: $("#use-platform-field"),
    usePlatform: $("#use-platform"),
    useInputModeField: $("#use-input-mode-field"),
    useInputMode: $("#use-input-mode"),
    useStyle: $("#use-style"),
    useSlug: $("#use-slug"),
    useOutputChoices: document.querySelectorAll('input[name="use-output"]'),
    useCommand: $("#use-command"),
    copyUseCommand: $("#copy-use-command"),
    useCommandFeedback: $("#use-command-feedback"),
    copyInstall: $("#copy-install"),
    installCommand: $("#install-command"),
    copyInstallExtension: $("#copy-install-extension"),
    installExtensionCommand: $("#install-extension-command"),
    installFeedback: $("#install-feedback"),
    usePromptPath: $("#use-prompt-path"),
    useImagePath: $("#use-image-path"),
    useImageArtifact: $("#use-image-artifact"),
    conversationUser: $("#conversation-user"),
    conversationSkill: $("#conversation-skill"),
    conversationPromptPath: $("#conversation-prompt-path"),
    conversationProvider: $("#conversation-provider"),
    publishPackage: $("#publish-package"),
    packagePresets: $("#package-presets"),
    packageTitle: $("#package-title"),
    packagePost: $("#package-post"),
    packageSummary: $("#package-summary"),
    packageCta: $("#package-cta"),
    packageHashtags: $("#package-hashtags"),
    packageAlt: $("#package-alt"),
    packageCover: $("#package-cover"),
    packageCoverImage: $("#package-cover-image"),
    packageCoverTitle: $("#package-cover-title"),
    packageCoverSubtitle: $("#package-cover-subtitle"),
    packageCoverKicker: $("#package-cover-kicker"),
    packageViewButtons: document.querySelectorAll("[data-package-view]"),
    packageFileTree: $("#package-file-tree"),
    packageManifest: $("#package-manifest"),
    copyPackagePost: $("#copy-package-post"),
    copyPackageAlt: $("#copy-package-alt"),
    resetPackageCopy: $("#reset-package-copy"),
    copyPackageManifest: $("#copy-package-manifest"),
    packageCopyFeedback: $("#package-copy-feedback"),
    packageManifestFeedback: $("#package-manifest-feedback"),
    packageQuality: $("#package-quality"),
    packageQualitySummary: $("#package-quality-summary"),
    exportPackage: $("#export-package"),
    packageExportStatus: $("#package-export-status"),
    publicationPreviewImage: $("#publication-preview-image"),
    publicationPreviewCoverTitle: $("#publication-preview-cover-title"),
    publicationPreviewTitle: $("#publication-preview-title-text"),
    publicationPreviewPost: $("#publication-preview-post"),
    publicationPreviewTags: $("#publication-preview-tags"),
  };

  let activeUseMode = "cover";
  let activePublicationPresetId = publicationPresets[0]?.id || null;
  const useDrafts = {
    cover: {
      source: "AI Agent 正在从单点编码助手变成软件交付参与者。它会读取上下文、调用工具并验证结果，研发流程正在从‘人操作工具’转向‘人与自主系统共同编排’。",
      slug: "ai-agent-rnd",
    },
    avatar: {
      source: "一只年轻金毛，左耳略微下垂，佩戴青绿色三角巾，眼神好奇。用于社交账号，缩小后也要容易识别。",
      slug: "cola-avatar",
    },
  };

  const platformConfig = {
    wechat: { instruction: "a WeChat public account cover", ratio: "2.35:1", label: "微信公众号" },
    xiaohongshu: { instruction: "a Xiaohongshu cover", ratio: "3:4", label: "小红书" },
    x: { instruction: "an X / Twitter cover", ratio: "5:2", label: "X / Twitter" },
    custom: { instruction: "a general-purpose landscape cover", ratio: "16:9", label: "通用横版" },
  };

  const ratioMap = {
    "2.35:1": "2.35 / 1",
    "3:4": "3 / 4",
    "5:2": "5 / 2",
    "1:1": "1 / 1",
    "16:9": "16 / 9",
  };

  const packagePlatformTags = {
    wechat: ["#AIAgent", "#软件研发", "#技术趋势"],
    xiaohongshu: ["#AIAgent", "#研发效率", "#产品思考"],
    x: ["#AIAgents", "#SoftwareEngineering", "#FutureOfWork"],
    custom: ["#AIAgent", "#软件交付", "#人机协作"],
  };

  function renderPackagePresets() {
    elements.packagePresets.replaceChildren();
    publicationPresets.forEach((preset) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(preset.id === activePublicationPresetId));
      button.className = preset.id === activePublicationPresetId ? "is-active" : "";
      const strong = document.createElement("strong");
      const small = document.createElement("small");
      strong.textContent = preset.label;
      small.textContent = preset.short;
      button.append(strong, small);
      button.addEventListener("click", () => applyPublicationPreset(preset.id));
      elements.packagePresets.appendChild(button);
    });
  }

  function applyPublicationPreset(id) {
    const preset = publicationPresets.find((item) => item.id === id);
    if (!preset) return;
    activePublicationPresetId = preset.id;
    elements.usePlatform.value = preset.platform;
    elements.useSource.value = preset.source;
    elements.useSlug.value = preset.slug;
    elements.useStyle.value = preset.styleId;
    elements.packageTitle.value = preset.title;
    elements.packagePost.value = preset.post;
    elements.packageSummary.value = preset.summary;
    elements.packageCta.value = preset.cta;
    elements.packageHashtags.value = preset.hashtags.join(" ");
    elements.packageAlt.value = preset.alt;
    elements.packageCoverImage.src = preset.asset;
    elements.packageCoverImage.alt = preset.alt;
    elements.packageCover.dataset.kicker = preset.kicker;
    elements.publicationPreviewImage.src = preset.asset;
    renderPackagePresets();
    renderUseBuilder();
  }

  function getPackageQuality() {
    const title = elements.packageTitle.value.trim();
    const post = elements.packagePost.value.trim();
    const hashtags = elements.packageHashtags.value.trim().split(/\s+/).filter(Boolean);
    const alt = elements.packageAlt.value.trim();
    const platform = platformConfig[elements.usePlatform.value] || platformConfig.xiaohongshu;
    return [
      { id: "title", label: "标题长度", pass: title.length >= 6 && title.length <= 24, detail: `${title.length} 字；建议 6–24 字` },
      { id: "body", label: "正文完整", pass: post.length >= 80 && post.length <= 1000, detail: `${post.length} 字；演示目标 80–1000 字` },
      { id: "hashtags", label: "标签数量", pass: hashtags.length >= 2 && hashtags.length <= 5 && hashtags.every((tag) => tag.startsWith("#")), detail: `${hashtags.length} 个；目标 2–5 个且以 # 开头` },
      { id: "alt", label: "Alt 与标题一致", pass: Boolean(title && alt.includes(title)), detail: alt.includes(title) ? "包含当前精确标题" : "Alt 未包含当前标题" },
      { id: "ratio", label: "平台比例", pass: elements.usePlatform.value !== "xiaohongshu" || platform.ratio === "3:4", detail: `${platform.label} · ${platform.ratio}` },
      { id: "status", label: "发布状态", pass: true, detail: "draft-not-published；不会自动发布" },
    ];
  }

  function renderPackageQuality() {
    const checks = getPackageQuality();
    elements.packageQuality.replaceChildren();
    checks.forEach((check) => {
      const item = document.createElement("li");
      item.className = check.pass ? "is-pass" : "is-warn";
      item.dataset.check = check.id;
      const copy = document.createElement("div");
      const strong = document.createElement("strong");
      const detail = document.createElement("span");
      strong.textContent = `${check.pass ? "通过" : "需检查"} · ${check.label}`;
      detail.textContent = check.detail;
      copy.append(strong, detail);
      item.appendChild(copy);
      elements.packageQuality.appendChild(item);
    });
    const passed = checks.filter((check) => check.pass).length;
    elements.packageQualitySummary.textContent = `${passed} / ${checks.length} PASS`;
    return checks;
  }

  function markExportStale() {
    if (elements.packageExportStatus.dataset.state === "success") {
      elements.packageExportStatus.dataset.state = "stale";
      elements.packageExportStatus.textContent = "内容已变化，请重新导出";
    }
  }

  function buildPrompt(scenario, style) {
    return [
      `# ${style.name} · ${scenario.label}`,
      "",
      `Create one ${scenario.platform} image at ${scenario.ratio}.`,
      `Title/topic: ${scenario.title}`,
      `Short context: ${scenario.summary}`,
      `Visual subject: ${scenario.subject}`,
      `Audience: ${scenario.audience}`,
      `Mood: ${scenario.mood}`,
      `Visual metaphor: ${scenario.metaphor}`,
      "",
      `Selected style: ${style.name} / ${style.id}`,
      `Style rationale: ${style.reason}`,
      "",
      scenario.promptLead,
      "",
      "Keep the topic readable at first glance and reveal the metaphor at second glance.",
      "Generate one cohesive image only; no grid, no alternatives, no watermark.",
    ].join("\n");
  }

  function populateUseStyles() {
    const previous = elements.useStyle.value;
    const eligible = upstreamStyles.filter((style) => style.type === activeUseMode);
    elements.useStyle.replaceChildren();
    eligible.forEach((style) => {
      const option = document.createElement("option");
      option.value = style.id;
      option.textContent = `${style.name} · ${style.id}`;
      elements.useStyle.appendChild(option);
    });
    const preferred = activeUseMode === "cover" ? "retro-torn-collage" : "pixel-avatar";
    elements.useStyle.value = eligible.some((style) => style.id === previous) ? previous : preferred;
  }

  function sanitizeSlug(value, fallback) {
    const slug = value.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
    return slug || fallback;
  }

  function derivePackageDraft() {
    const source = elements.useSource.value.trim() || "请补充真实来源内容。";
    const isDefaultAgentTopic = /AI\s*Agent|自主系统|软件交付/i.test(source);
    const firstSentence = source.split(/[。！？!?\n]/).find((part) => part.trim())?.trim() || "把复杂内容变成可行动的判断";
    const title = isDefaultAgentTopic ? "AI Agent 不是更快的按钮" : `${firstSentence.slice(0, 22)}${firstSentence.length > 22 ? "…" : ""}`;
    const summary = isDefaultAgentTopic
      ? "从工具加速到任务编排，AI Agent 正在改变软件交付的协作边界。"
      : `${firstSentence.slice(0, 72)}${firstSentence.length > 72 ? "……" : ""}`;
    const post = isDefaultAgentTopic
      ? [
          "真正发生变化的，不只是写代码更快。",
          "当 Agent 能读取上下文、调用工具并验证结果，研发工作的单位就从一次操作，变成了一个可编排的任务闭环。",
          "这也意味着团队需要重新设计权限、验证和交接，而不是只比较模型速度。",
          "先从一个边界清晰、结果可验证的任务开始，把它做成你和 Agent 可以共同复盘的闭环。",
        ].join("\n\n")
      : [`先说结论：${summary}`, `这条内容的核心不是堆叠信息，而是让读者快速理解“${title}”为什么与自己有关。`, "把方法拆成一个可以马上尝试的小步骤，再用结果决定是否继续扩展。"].join("\n\n");
    const cta = isDefaultAgentTopic
      ? "保存这份判断清单，并找出你的第一个可交给 Agent 的闭环任务。"
      : "收藏这份笔记，并选择一个最小步骤开始验证。";
    const tags = packagePlatformTags[elements.usePlatform.value] || packagePlatformTags.xiaohongshu;
    const alt = `一张${platformConfig[elements.usePlatform.value]?.label || "内容平台"}封面，标题为“${title}”，视觉使用${elements.useStyle.selectedOptions[0]?.textContent?.split(" · ")[0] || "单一选定"}风格，表现${summary}`;

    elements.packageTitle.value = title;
    elements.packagePost.value = post;
    elements.packageSummary.value = summary;
    elements.packageCta.value = cta;
    elements.packageHashtags.value = tags.join(" ");
    elements.packageAlt.value = alt;
    renderPublicationPackage();
  }

  function buildPackageManifest(slug, platform, style) {
    const quality = getPackageQuality();
    return JSON.stringify(
      {
        schema_version: "punk-publish/2-preview",
        status: "draft-not-published",
        package: `punk-assets/punk-publish/${slug}`,
        platform: elements.usePlatform.value,
        ratio: platform.ratio,
        copy: {
          title: "copy/title.md",
          post: "copy/post.md",
          summary: "copy/summary.md",
          cta: "copy/cta.md",
          hashtags: "copy/hashtags.md",
          alt_text: "copy/alt-text.md",
        },
        visual: {
          style_id: style?.id || "black-white-minimal-concept",
          prompt: "prompts/cover.md",
          artwork: { path: "visual/artwork.<source-extension>", status: "included-on-export" },
          cover: { path: "visual/cover.png", status: "generated-on-export" },
          exact_copy: "visual/cover-copy.json",
        },
        quality: Object.fromEntries(quality.map((check) => [check.id, check.pass ? "pass" : "review"])),
        evidence: {
          webpage: "deterministic-research-demo",
          upstream_capability: "$punk-cover prompt compilation",
          extension_capability: "$punk-publish package orchestration",
        },
      },
      null,
      2,
    );
  }

  function renderPublicationPackage() {
    const slug = sanitizeSlug(elements.useSlug.value, "my-publication");
    const platform = platformConfig[elements.usePlatform.value] || platformConfig.xiaohongshu;
    const style = upstreamStyles.find((item) => item.id === elements.useStyle.value);
    const title = elements.packageTitle.value.trim() || "待补充标题";
    const post = elements.packagePost.value.trim() || "待补充正文";
    const tags = elements.packageHashtags.value.trim();

    elements.packageCoverTitle.textContent = title;
    elements.packageCoverSubtitle.textContent = elements.packageSummary.value.trim() || "待补充一句话摘要";
    elements.packageCoverKicker.textContent = elements.packageCover.dataset.kicker || "PUNK PUBLISH / DRAFT";
    elements.publicationPreviewCoverTitle.textContent = title;
    elements.publicationPreviewTitle.textContent = title;
    elements.publicationPreviewPost.textContent = `${post}\n\n${elements.packageCta.value.trim()}`;
    elements.publicationPreviewTags.textContent = tags;
    elements.packageFileTree.textContent = [
      `punk-assets/punk-publish/${slug}/`,
      "├─ copy/",
      "│  ├─ title.md",
      "│  ├─ post.md",
      "│  ├─ summary.md",
      "│  ├─ cta.md",
      "│  ├─ hashtags.md",
      "│  └─ alt-text.md",
      "├─ prompts/cover.md",
      "├─ visual/",
      "│  ├─ artwork.png     ← Provider 返回后才存在",
      "│  ├─ cover-copy.json ← 精确文字层",
      "│  └─ cover.png       ← 最终合成",
      "└─ manifest.json",
    ].join("\n");
    elements.packageManifest.textContent = buildPackageManifest(slug, platform, style);
    renderPackageQuality();
    markExportStale();
  }

  function renderUseBuilder() {
    const style = upstreamStyles.find((item) => item.id === elements.useStyle.value);
    const outputMode = document.querySelector('input[name="use-output"]:checked')?.value || "package";
    const isPackage = activeUseMode === "cover" && outputMode === "package";
    const wantsImage = outputMode === "image" || isPackage;
    const slug = sanitizeSlug(elements.useSlug.value, activeUseMode === "cover" ? "my-cover" : "my-avatar");
    const source = elements.useSource.value.trim() || "请在这里补充你的真实素材。";
    let command;
    let promptPath;
    let imagePath;

    if (activeUseMode === "cover") {
      const platform = platformConfig[elements.usePlatform.value] || platformConfig.wechat;
      if (isPackage) {
        command = [
          `Use $punk-publish to turn this source into a complete ${platform.label} publication package.`,
          `Use $punk-cover for the visual subtask in ${style?.name || "黑白极简概念"} style (${style?.id || "black-white-minimal-concept"}), aspect ratio ${platform.ratio}.`,
          "Create editable title, post body, summary, CTA, hashtags and alt text. Generate a no-text artwork, then define deterministic cover typography and save the complete prompt first.",
          "Include manifest.json with truthful asset status. Do not log in, schedule, or publish to any account.",
          `Output slug: ${slug}`,
          "",
          "Source content:",
          source,
        ].join("\n");
        promptPath = `punk-assets/punk-publish/${slug}/prompts/cover.md`;
        imagePath = `punk-assets/punk-publish/${slug}/visual/cover.png`;
      } else {
        command = [
          `Use $punk-cover to create ${platform.instruction} in ${style?.name || "黑白极简概念"} style (${style?.id || "black-white-minimal-concept"}), aspect ratio ${platform.ratio}.`,
          wantsImage ? "Generate the image and save the complete prompt first." : "Create prompt-only output. Do not generate an image.",
          `Output slug: ${slug}`,
          "",
          "Source content:",
          source,
        ].join("\n");
        promptPath = `punk-assets/punk-cover/${slug}/prompts/cover.md`;
        imagePath = `punk-assets/punk-cover/${slug}/cover.png`;
      }
      elements.conversationUser.textContent = `发送内容、${platform.label} ${platform.ratio} 与 ${style?.name || "一个封面风格"}`;
      elements.conversationSkill.textContent = isPackage ? "先编排标题、正文、CTA 与 Alt，再把视觉子任务交给 $punk-cover" : "提炼标题、摘要、主体、受众、情绪和隐喻，并融合为封面 Prompt";
    } else {
      const inputMode = elements.useInputMode.value;
      const sourceLead = inputMode === "photo" ? "from the attached photo" : "from this text description";
      command = [
        `Use $punk-avatar to create a ${style?.name || "像素头像"} (${style?.id || "pixel-avatar"}) ${sourceLead}, aspect ratio 1:1.`,
        wantsImage ? "Generate the image and save the complete prompt first." : "Create prompt-only output. Do not generate an image.",
        `Output slug: ${slug}`,
        "",
        inputMode === "photo" ? "Additional context and traits to preserve:" : "Subject description:",
        source,
      ].join("\n");
      promptPath = `punk-assets/punk-avatar/${slug}/prompts/avatar.md`;
      imagePath = `punk-assets/punk-avatar/${slug}/avatar.png`;
      elements.conversationUser.textContent = inputMode === "photo" ? `附上照片、补充识别特征，并指定 ${style?.name || "头像风格"}` : `发送主体描述，并指定 ${style?.name || "头像风格"}`;
      elements.conversationSkill.textContent = "提炼主体身份与 3–5 个识别特征，并融合为头像 Prompt";
    }

    elements.useCommand.textContent = command;
    elements.usePromptPath.textContent = promptPath;
    elements.conversationPromptPath.textContent = promptPath;
    elements.useImagePath.textContent = imagePath;
    elements.useImageArtifact.hidden = !wantsImage;
    elements.publishPackage.hidden = !isPackage;
    elements.conversationProvider.textContent = isPackage ? "生成无字底图，再与可靠文字层组合成封面" : wantsImage ? "用保存的 Prompt 生成一张图" : "按你的要求跳过画图，只交付可复用 Prompt";
    renderPublicationPackage();
  }

  function selectUseMode(mode) {
    if (mode !== "cover" && mode !== "avatar") return;
    useDrafts[activeUseMode].source = elements.useSource.value;
    useDrafts[activeUseMode].slug = elements.useSlug.value;
    activeUseMode = mode;
    elements.useModeButtons.forEach((button) => {
      const active = button.dataset.useMode === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const isCover = mode === "cover";
    const packageChoice = document.querySelector('input[name="use-output"][value="package"]');
    packageChoice.disabled = !isCover;
    packageChoice.closest("label").hidden = !isCover;
    if (!isCover && packageChoice.checked) {
      document.querySelector('input[name="use-output"][value="image"]').checked = true;
    }
    elements.usePlatformField.hidden = !isCover;
    elements.useInputModeField.hidden = isCover;
    elements.useSourceLabel.textContent = isCover ? "粘贴文章、笔记或主题" : "描述主体，或补充照片中必须保留的特征";
    elements.useSourceHint.textContent = isCover ? "长文可以直接粘贴；Skill 会提炼，不会把全文塞进图片。" : "选择“随消息附上照片”时，请在真实 Agent 会话里同时上传图片。";
    elements.useSource.value = useDrafts[mode].source;
    elements.useSlug.value = useDrafts[mode].slug;
    populateUseStyles();
    renderUseBuilder();
  }

  function renderTabs() {
    elements.tabs.replaceChildren();
    scenarios.forEach((scenario, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `scenario-tab${scenario.id === activeScenario.id ? " is-active" : ""}`;
      button.id = `scenario-${scenario.id}-tab`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(scenario.id === activeScenario.id));
      const copy = document.createElement("span");
      const strong = document.createElement("strong");
      const small = document.createElement("small");
      const number = document.createElement("b");
      strong.textContent = scenario.label;
      small.textContent = scenario.short;
      number.textContent = String(index + 1).padStart(2, "0");
      copy.append(strong, small);
      button.append(copy, number);
      button.addEventListener("click", () => selectScenario(scenario.id));
      elements.tabs.appendChild(button);
    });
  }

  function renderStyleOptions() {
    elements.styleOptions.replaceChildren();
    activeScenario.styles.forEach((style) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `style-option${style.id === activeStyleId ? " is-active" : ""}`;
      button.textContent = style.name;
      button.setAttribute("aria-pressed", String(style.id === activeStyleId));
      button.addEventListener("click", () => {
        activeStyleId = style.id;
        renderStyleOptions();
        renderCompiler();
      });
      elements.styleOptions.appendChild(button);
    });
  }

  function renderCompiler() {
    const style = activeScenario.styles.find((item) => item.id === activeStyleId) || activeScenario.styles[0];
    elements.styleReason.textContent = style.reason;
    elements.promptStyleId.textContent = style.id;
    elements.promptOutput.textContent = buildPrompt(activeScenario, style);
  }

  function renderScenario() {
    elements.scenarioGoal.textContent = activeScenario.goal;
    elements.scenarioFit.textContent = activeScenario.fit;
    elements.scenarioAdaptation.textContent = activeScenario.adaptation;
    elements.scenarioDeliverable.textContent = activeScenario.deliverable;
    elements.sourcePlatform.textContent = `${activeScenario.platform} · ${activeScenario.ratio}`;
    elements.sourceText.value = activeScenario.source;
    elements.summary.textContent = activeScenario.summary;
    elements.subject.textContent = activeScenario.subject;
    elements.mood.textContent = activeScenario.mood;
    elements.metaphor.textContent = activeScenario.metaphor;
    elements.audience.textContent = activeScenario.audience;
    elements.previewRatio.textContent = activeScenario.ratio;
    elements.frame.dataset.scenario = activeScenario.id;
    elements.frame.style.aspectRatio = ratioMap[activeScenario.ratio] || "1 / 1";
    elements.frame.classList.add("is-changing");
    elements.previewImage.src = activeScenario.asset;
    elements.previewImage.alt = activeScenario.assetAlt;
    elements.kicker.textContent = activeScenario.kicker;
    elements.visualTitle.textContent = activeScenario.visualTitle;
    elements.subtitle.textContent = activeScenario.subtitle;
    elements.boundaryList.replaceChildren();
    activeScenario.boundaries.forEach((boundary) => {
      const item = document.createElement("li");
      item.textContent = boundary;
      elements.boundaryList.appendChild(item);
    });
    window.setTimeout(() => elements.frame.classList.remove("is-changing"), 180);
    renderTabs();
    renderStyleOptions();
    renderCompiler();
  }

  function createGalleryCard(style) {
    const card = document.createElement("article");
    card.className = "upstream-card";

    const link = document.createElement("a");
    link.className = "upstream-card__image";
    link.href = style.sourceUrl;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `查看上游 ${style.name} 原图`);

    const image = document.createElement("img");
    image.loading = "lazy";
    image.src = style.image;
    image.alt = `上游 ${style.name} 风格样例`;
    image.addEventListener("error", () => card.classList.add("has-image-error"), { once: true });

    const fallback = document.createElement("span");
    fallback.className = "upstream-card__fallback";
    fallback.textContent = "上游图片暂不可用";
    link.append(image, fallback);

    const body = document.createElement("div");
    body.className = "upstream-card__body";
    const meta = document.createElement("small");
    meta.textContent = `UPSTREAM / ${style.type.toUpperCase()} / ${style.id}`;
    const title = document.createElement("h3");
    title.textContent = style.name;
    const description = document.createElement("p");
    description.textContent = style.description;
    const useCases = document.createElement("dl");
    const useTerm = document.createElement("dt");
    const useValue = document.createElement("dd");
    const visualTerm = document.createElement("dt");
    const visualValue = document.createElement("dd");
    useTerm.textContent = "适用场景";
    useValue.textContent = style.useCases;
    visualTerm.textContent = "风格语言";
    visualValue.textContent = style.visual;
    useCases.append(useTerm, useValue, visualTerm, visualValue);
    body.append(meta, title, description, useCases);
    card.append(link, body);
    return card;
  }

  function renderGallery() {
    const query = elements.gallerySearch.value.trim().toLowerCase();
    const visibleStyles = upstreamStyles.filter((style) => {
      const matchesFilter = activeGalleryFilter === "all" || style.type === activeGalleryFilter;
      const haystack = [style.id, style.name, style.description, style.useCases, style.visual].join(" ").toLowerCase();
      return matchesFilter && (!query || haystack.includes(query));
    });

    elements.galleryGrid.replaceChildren(...visibleStyles.map(createGalleryCard));
    elements.galleryCount.textContent = `${visibleStyles.length} / ${upstreamStyles.length}`;
    elements.galleryEmpty.hidden = visibleStyles.length > 0;
    elements.galleryFilters.forEach((button) => {
      const isActive = button.dataset.galleryFilter === activeGalleryFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function selectScenario(id) {
    const next = scenarios.find((scenario) => scenario.id === id);
    if (!next || next.id === activeScenario.id) return;
    activeScenario = next;
    activeStyleId = next.selectedStyle;
    renderScenario();
  }

  function buildManifest() {
    const modules = extensions.filter((item) => enabledExtensions.has(item.id));
    return JSON.stringify(
      {
        project: "human-agent-co-creation",
        output_shape: "podcast-cover",
        ratio: "1:1",
        source_mode: "content-specification",
        selected_style: "brand-editorial-sculpture",
        extensions: modules.map((item) => item.id),
        compile_rules: modules.map((item) => item.prompt),
        evidence: {
          artwork: "research pre-generated",
          typography: "deterministic HTML layer",
          provider_run: "not executed in browser",
        },
      },
      null,
      2,
    );
  }

  function renderExtensions() {
    elements.extensionOptions.replaceChildren();
    extensions.forEach((extension) => {
      const label = document.createElement("label");
      label.className = "extension-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = enabledExtensions.has(extension.id);
      input.addEventListener("change", () => {
        if (input.checked) enabledExtensions.add(extension.id);
        else enabledExtensions.delete(extension.id);
        renderManifest();
      });
      const copy = document.createElement("span");
      const strong = document.createElement("strong");
      const small = document.createElement("small");
      strong.textContent = extension.label;
      small.textContent = extension.description;
      copy.append(strong, small);
      label.append(input, copy);
      elements.extensionOptions.appendChild(label);
    });
    renderManifest();
  }

  function renderManifest() {
    elements.extensionCount.textContent = `${enabledExtensions.size} / ${extensions.length}`;
    elements.extensionManifest.textContent = buildManifest();
  }

  async function copyText(text, feedbackElement) {
    try {
      await navigator.clipboard.writeText(text);
      feedbackElement.textContent = "已复制到剪贴板。";
    } catch (_error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      feedbackElement.textContent = "已使用兼容方式复制。";
    }
    window.setTimeout(() => {
      feedbackElement.textContent = "";
    }, 2200);
  }

  async function exportCurrentPackage() {
    if (!window.PunkPackageExport) {
      elements.packageExportStatus.dataset.state = "error";
      elements.packageExportStatus.textContent = "导出模块未加载，请刷新页面后重试。";
      return;
    }
    const slug = sanitizeSlug(elements.useSlug.value, "my-publication");
    const platform = platformConfig[elements.usePlatform.value] || platformConfig.xiaohongshu;
    const style = upstreamStyles.find((item) => item.id === elements.useStyle.value);
    const preset = publicationPresets.find((item) => item.id === activePublicationPresetId);
    const checks = getPackageQuality();
    elements.exportPackage.disabled = true;
    elements.publishPackage.setAttribute("aria-busy", "true");
    try {
      const result = await window.PunkPackageExport.exportPackage({
        slug,
        presetId: preset?.id || "custom",
        platform: elements.usePlatform.value,
        ratio: platform.ratio,
        styleId: style?.id || "black-white-minimal-concept",
        imageUrl: elements.packageCoverImage.currentSrc || elements.packageCoverImage.src,
        kicker: elements.packageCover.dataset.kicker || "PUNK PUBLISH / DRAFT",
        title: elements.packageTitle.value.trim(),
        post: elements.packagePost.value.trim(),
        summary: elements.packageSummary.value.trim(),
        cta: elements.packageCta.value.trim(),
        hashtags: elements.packageHashtags.value.trim(),
        altText: elements.packageAlt.value.trim(),
        command: elements.useCommand.textContent,
        quality: Object.fromEntries(checks.map((check) => [check.id, { status: check.pass ? "pass" : "review", detail: check.detail }])),
        onStatus: (state, message) => {
          elements.packageExportStatus.dataset.state = state;
          elements.packageExportStatus.textContent = message;
        },
      });
      elements.packageManifest.textContent = JSON.stringify(result.manifest, null, 2);
    } catch (error) {
      elements.packageExportStatus.dataset.state = "error";
      elements.packageExportStatus.textContent = error instanceof Error ? error.message : "导出失败，请重试。";
    } finally {
      elements.exportPackage.disabled = false;
      elements.publishPackage.removeAttribute("aria-busy");
    }
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    elements.themeIcon.textContent = theme === "dark" ? "☼" : "◐";
    elements.themeToggle.setAttribute("aria-label", theme === "dark" ? "切换为浅色主题" : "切换为深色主题");
    try { localStorage.setItem("punk-skill-theme", theme); } catch (_error) { /* storage is optional */ }
  }

  function initTheme() {
    let saved;
    try { saved = localStorage.getItem("punk-skill-theme"); } catch (_error) { saved = null; }
    const preferred = window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setTheme(saved === "light" || saved === "dark" ? saved : preferred);
  }

  elements.previewImage.addEventListener("load", () => elements.frame.classList.remove("is-changing"));
  elements.useModeButtons.forEach((button) => button.addEventListener("click", () => selectUseMode(button.dataset.useMode)));
  [elements.usePlatform, elements.useInputMode, elements.useStyle, elements.useSlug].forEach((control) => {
    control.addEventListener("input", renderUseBuilder);
    control.addEventListener("change", renderUseBuilder);
  });
  elements.useSource.addEventListener("input", () => {
    activePublicationPresetId = null;
    renderPackagePresets();
    derivePackageDraft();
    renderUseBuilder();
  });
  elements.usePlatform.addEventListener("change", derivePackageDraft);
  elements.useOutputChoices.forEach((choice) => choice.addEventListener("change", renderUseBuilder));
  [elements.packagePost, elements.packageSummary, elements.packageCta, elements.packageHashtags, elements.packageAlt].forEach((control) => {
    control.addEventListener("input", renderPublicationPackage);
  });
  elements.packageTitle.addEventListener("input", () => {
    elements.packageAlt.value = elements.packageAlt.value.replace(/标题为“[^”]*”/, `标题为“${elements.packageTitle.value.trim() || "待补充标题"}”`);
    renderPublicationPackage();
  });
  elements.packageViewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isArtwork = button.dataset.packageView === "artwork";
      elements.packageCover.classList.toggle("is-artwork", isArtwork);
      elements.packageViewButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("is-active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });
    });
  });
  elements.resetPackageCopy.addEventListener("click", () => {
    if (activePublicationPresetId) applyPublicationPreset(activePublicationPresetId);
    else derivePackageDraft();
  });
  elements.copyPackagePost.addEventListener("click", () => {
    const publication = [elements.packageTitle.value, "", elements.packagePost.value, "", elements.packageCta.value, "", elements.packageHashtags.value].join("\n").trim();
    copyText(publication, elements.packageCopyFeedback);
  });
  elements.copyPackageAlt.addEventListener("click", () => copyText(elements.packageAlt.value.trim(), elements.packageCopyFeedback));
  elements.copyPackageManifest.addEventListener("click", () => copyText(elements.packageManifest.textContent, elements.packageManifestFeedback));
  elements.copyInstall.addEventListener("click", () => copyText(elements.installCommand.textContent.trim(), elements.installFeedback));
  elements.copyInstallExtension.addEventListener("click", () => copyText(elements.installExtensionCommand.textContent.trim(), elements.installFeedback));
  elements.exportPackage.addEventListener("click", exportCurrentPackage);
  elements.copyUseCommand.addEventListener("click", () => copyText(elements.useCommand.textContent, elements.useCommandFeedback));
  elements.copyPrompt.addEventListener("click", () => copyText(elements.promptOutput.textContent, elements.copyFeedback));
  elements.copyManifest.addEventListener("click", () => copyText(elements.extensionManifest.textContent, elements.manifestFeedback));
  elements.themeToggle.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  elements.gallerySearch.addEventListener("input", renderGallery);
  elements.galleryFilters.forEach((button) => {
    button.addEventListener("click", () => {
      activeGalleryFilter = button.dataset.galleryFilter;
      renderGallery();
    });
  });

  initTheme();
  selectUseMode("cover");
  renderPackagePresets();
  if (activePublicationPresetId) applyPublicationPreset(activePublicationPresetId);
  else derivePackageDraft();
  renderScenario();
  renderGallery();
  renderExtensions();
})();
