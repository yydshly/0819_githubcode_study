# Punk Skill 能力实验室

这是 `Punk-Skill` 研究子项目的静态交互演示。它解释上游 Skill 的编译原理，用八个实用场景展示任务适配，完整列出上游 24 个封面 / 海报风格与 5 个头像风格，并用研究扩展 `$punk-publish` 展示“图片如何成为完整发布包中的一个资产”。

## 本地运行

在研究主库根目录执行：

```powershell
python -m http.server 4174 --directory demos/punk-skill
```

打开：<http://127.0.0.1:4174/>

在线演示：<https://yydshly.github.io/0819_githubcode_study/punk-skill/>

页面没有依赖、构建步骤、后端或外部生成 API。只有“上游自带样例”区会从 GitHub 远程加载缩略图；场景实验和扩展实验使用本项目保存的研究样例图。

## 页面内容

### 00 · 真实使用台

页面第一段正文提供一个可以离开网页执行的调用指令构造器：

1. 运行页面给出的固定版本 bootstrap，获取并校验上游 `$punk-cover` / `$punk-avatar`，再加载本地 `$punk-publish`；
2. 选择 `$punk-cover` 或 `$punk-avatar`；
3. 填入文章、主体描述或照片补充信息；
4. 默认选择“小红书完整发布包”，也可退回“视觉素材 / 仅 Prompt”；
5. 复制生成的调用指令到真实 Agent 会话；
6. 运行 6 项发布前结构检查；
7. 导出包含真实 `cover.png`、文案、底图、调用 brief 和哈希 manifest 的 ZIP；Provider 没有返回图片时，Agent 文件系统包仍必须将视觉依赖标为缺失。

页面只负责构造和解释指令，不在后台模拟已经执行 Agent。真正的内容理解、Prompt 写入和图像生成发生在支持该 Skill 与图像工具的 Agent 中。

仓库内可重复准备命令：

```powershell
python studies/punk-skill/extensions/punk-publish/scripts/bootstrap_upstream.py fetch --run-checks
```

该命令读取研究锁文件，不会随上游 `main` 漂移；已有检出不是目标仓库或存在未提交修改时会停止，不会静默覆盖。

### 01 · 完整发布包工作台

默认小红书演示包含五个连续表面：

1. 可编辑的标题、正文、摘要、CTA、标签与 Alt 文本；
2. 可切换的无字底图和可靠文字封面；
3. 预期文件树和 `manifest.json`；
4. 读者实际看到的“封面 + 图片外正文”组合预览。
5. 真实 PNG/ZIP 导出和基于实际字节的 SHA-256 清单。

页面提供 AI Agent、产品发布、研究解读、活动宣传和课程知识五套完整预设。文案推导是规则化研究模拟，不是浏览器内 LLM。编辑来源内容会重新生成演示草稿；编辑文案字段会同步更新封面、Alt、QA 与平台预览。正文、Alt 文本、调用指令和 manifest 均可复制。

“导出 ZIP”是实际浏览器文件操作：Canvas 合成 900×1200 PNG，零依赖 ZIP writer 写入 11 个文件，Web Crypto 为除 manifest 自身外的每个条目计算 SHA-256。导出的 artwork 仍是研究预生成底图，manifest 会如实记录来源；真实 Agent 运行应以 Provider 返回物替换它。

### 02 · 原理与场景地图

页面先解释“任务结构 + 风格元数据 + 风格原子 → 融合编译 Prompt → 外部图像 Provider”的能力链路，并明确它是 Agent Skill / Prompt 编译器，不是图像模型。场景地图按内容发布、商业沟通、科研教育、人物 / 宠物与文化 IP 四类任务组织。

### 03 · 场景实验

八个预设分别对应：

- 公众号长文：`2.35:1`，黑白极简概念。
- 小红书知识卡：`3:4`，复古手撕拼贴。
- X 研究头图：`5:2`，复古油墨点阵隐喻。
- 宠物头像：`1:1`，像素头像。
- 投资人备忘录：`16:9`，咨询报告视觉。
- 医学科研科普：`3:4`，科研期刊概念。
- 企业集成发布：`5:2`，品牌协同连接。
- 城市展览活动：`3:4`，先锋复古建筑海报。

切换场景会同步更新使用目标、适配理由、交付物、原始输入、结构化内容理解、三种推荐风格、提示词摘要、画幅与样例图。风格按钮只用于展示重编译后的文本，样例图始终对应该场景的首选风格。

这里的内容理解字段是研究预设，不是浏览器内运行 LLM；Prompt 是独立研究实现，用来解释上游工作流形状，不复制上游完整提示词。

### 04 · 上游自带样例

该区域通过 `raw.githubusercontent.com` 直接读取全部 29 张上游样例并链接回原文件。每个卡片都包含风格名、风格描述、适用场景与视觉语言，可按全部 / 封面 / 头像筛选并按关键词搜索。由于上游截至研究提交没有明确许可证，本仓库不保存这些图片副本。

### 05 · 扩展实验

“人 × Agent 共创”播客封面展示四个扩展模块：

1. 品牌令牌锁定；
2. 无字底图与可靠文字层；
3. 跨平台版式编译；
4. 图像模型适配器与运行清单。

用户可以关闭任一模块，观察编译 manifest 的字段变化。

## 图片边界

`assets/` 下九张图片由本研究使用 OpenAI 内置图像生成工具创建：

- `scenario-wechat-ai-agents.webp`
- `scenario-xiaohongshu-productivity.webp`
- `scenario-x-agent-memory.webp`
- `scenario-pet-avatar.webp`
- `scenario-investor-memo.png`
- `scenario-medical-research.png`
- `scenario-enterprise-integration.png`
- `scenario-city-exhibition.png`
- `extension-brand-podcast.webp`

这些图片是预生成研究样例，不是 Punk-Skill 仓库自带输出，也不是本页面实时推理结果。图片均不包含生成式文字；可见标题由 HTML 叠加，这是本研究提出的可靠文字层扩展。

## 关联资料

- [完整研究记录](../../studies/punk-skill/README.md)
- [`$punk-publish` 扩展说明](../../studies/punk-skill/punk-publish-extension.md)
- [固定上游版本与复用方法](../../studies/punk-skill/extensions/punk-publish/references/upstream-reuse.md)
- [单图与发布包评测协议](../../studies/punk-skill/evaluation-protocol.md)
- [设计契约](../../studies/punk-skill/design-contract.md)
- [浏览器验收](docs/validation.md)
- [上游来源与许可](docs/upstream-attribution.md)
- [图片生成记录](docs/image-generation.md)
- [交接说明](docs/handoff.md)
- [部署说明](docs/deployment.md)
- [上游仓库](https://github.com/adrianpunk/Punk-Skill)
