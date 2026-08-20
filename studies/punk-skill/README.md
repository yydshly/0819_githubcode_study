# Punk Skill

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 原项目 | [adrianpunk/Punk-Skill](https://github.com/adrianpunk/Punk-Skill) |
| 原作者/组织 | AdrianPunk；仓库维护者 jinchenma94 |
| 许可证 | 未声明；见上游 [Issue #6](https://github.com/adrianpunk/Punk-Skill/issues/6) |
| 研究版本 | `d62d99863ad860895425ef44bd81b5e680576b0d` |
| 研究检出 | `vendor-projects/Punk-Skill/`，由根目录 `.gitignore` 排除，不作为第三方源码再分发 |
| 交互演示 | [本地能力实验室](../../demos/punk-skill/README.md) |
| 当前状态 | 已复现 / 扩展实验中 |
| 最后更新 | 2026-08-20 |

## 为什么研究它

Punk-Skill 把设计师积累的视觉提示词重构为可由 AI Agent 执行的工作流。它不是图像模型，而是一个小型的视觉 Prompt 编译架构：任务 Skill 负责内容理解和输出形状，风格目录提供可复用视觉原子，宿主图像工具负责真正生成。

对本研究主库而言，它适合作为第二个研究对象，重点回答：

- 如何把非结构化的视觉经验转成 Agent 可执行资产；
- “任务蓝图 × 风格原子”的分离是否具有工程可维护性；
- 如何从一次性生成扩展到品牌系统、可靠文字、多平台变体与模型适配；
- 如何诚实区分 Prompt 编排能力与底层模型能力。

## 已确认能力

上游提供两个 Skills：

| Skill | 输入 | 主要输出 | 工作流特征 |
| --- | --- | --- | --- |
| `punk-cover` | 文章、笔记、推文、主题 | 社媒封面或完整 Prompt | 要求确认平台/比例与风格；长文先摘要；每次只编译一个风格 |
| `punk-avatar` | 人物、宠物、物品图片或描述 | 头像、宠物肖像、纪念卡 | 默认 `1:1`；按主体类型推荐风格；强调识别特征与裁剪安全 |

本次检出统计到 29 个 `styles/` 目录，其中上游校验识别出：

- 24 个 `cover` / `poster` 风格；
- 5 个头像风格。

## 原理

```text
文章 / 图片 / 主体描述
  → Agent 提炼内容字段
  → 根据 META 路由候选风格
  → 选择一个 STYLE 视觉原子
  → 注入 Cover 或 Avatar Blueprint
  → 保存完整 Prompt
  → 调用宿主 image_gen 等外部工具
```

### 三层结构

1. **任务层**：`skills/punk-cover/SKILL.md` 和 `skills/punk-avatar/SKILL.md` 规定确认门、输入提炼、输出路径和工具调用纪律。
2. **形状层**：`cover-prompt-blueprint.md` 与 `avatar-prompt-blueprint.md` 分别规定标题层级、平台传播，或主体识别、裁剪安全等结构。
3. **风格层**：`styles/{style-id}/META.md` 提供路由元数据，`STYLE.md` 提供材质、构图、色彩、文字关系与负面约束。

最重要的设计规则是“编译”而不是“拼接”：最终 Prompt 应将风格落实到标题、主体、背景、材质和隐喻中，而不是把通用封面说明与风格描述首尾相接。

## 本地获取与原生复现

上游源码保存在根目录已忽略的 `vendor-projects/`，避免在许可证未明确时通过本仓库重新分发。

```powershell
git clone --depth 1 https://github.com/adrianpunk/Punk-Skill.git vendor-projects/Punk-Skill
node vendor-projects/Punk-Skill/scripts/validate-punk-cover.mjs
node vendor-projects/Punk-Skill/scripts/validate-punk-avatar.mjs
```

2026-08-20 本机结果：

```text
punk-cover validation passed for 24 cover/poster styles.
punk-avatar validation passed for 5 avatar styles.
```

这些脚本只验证目录、字段和关键短语，不生成图片，也不评价最终视觉质量。

## 现实使用方法

Punk-Skill 不是一个需要单独打开的绘图应用，而是安装进支持 Skills 的 AI Agent 后，由对话触发的工作流。

### 1. 安装一次

把下面的话发送给支持 Skills 的 Agent：

```text
请安装这个仓库里的全部 Skills：https://github.com/adrianpunk/Punk-Skill
```

### 2. 发起真实任务

封面任务：

```text
Use $punk-cover to create a WeChat public account cover in 黑白极简概念 style, aspect ratio 2.35:1.
Generate the image and save the complete prompt first.

Source content:
这里粘贴文章、笔记或主题草稿。
```

头像任务：

```text
Use $punk-avatar to create a 像素头像 from the attached photo, aspect ratio 1:1.
Generate the image and save the complete prompt first.

Additional context and traits to preserve:
这里描述必须保留的五官、毛色、服装或配饰。
```

### 3. 理解真实产物

一次封面运行首先应保存 `punk-assets/punk-cover/{slug}/prompts/cover.md`；只有宿主图像工具明确返回本次运行的文件时，才会保存 `cover.png`。头像任务对应 `punk-assets/punk-avatar/{slug}/prompts/avatar.md` 和可能存在的 `avatar.png`。

因此，上游现实链路是：用户素材 → Agent 调用 Skill → Skill 编译并保存 Prompt → 宿主图像 Provider 生成图片 → 用户检查与发布。交互演示的“真实使用台”可以直接构造这些调用指令，但不会在网页后台假装执行 Agent。

## 研究扩展：从图片到完整发布包

用户实际发布内容时，图片通常只是入口。研究新增仓库内 `$punk-publish` Skill，将上游 `$punk-cover` 作为视觉子任务，额外编排：

- 可编辑标题、正文、摘要与 CTA；
- 平台相关标签；
- 描述画面和可见标题的 Alt 文本；
- 无字 `artwork.png` 与可靠文字 `cover.png` 的分层约定；
- Prompt、精确文字规范和 `manifest.json`；
- `draft-not-published` 状态与缺失视觉资产的诚实记录。

它不会登录、定时或发布到任何账号。实现、调用范例和产物结构见 [`punk-publish-extension.md`](punk-publish-extension.md)。

### 安装发现边界

上游安装指令只提供 `$punk-cover` 和 `$punk-avatar`，不包含研究扩展。真实运行必须同时让 Agent 发现本仓库的 `studies/punk-skill/extensions/punk-publish/`。页面已将两个来源拆成独立复制指令；Skill 在执行前也要求报告 `$punk-cover` 是已发现、缺失还是主动跳过。

### 浏览器真实导出

静态页面现在可直接导出 ZIP，而非只展示预期路径：

- Canvas 生成 900×1200 的确定性文字 `cover.png`；
- 保存 6 个 Markdown 文案文件、调用 brief、研究底图和 `cover-copy.json`；
- 使用 Web Crypto 对所有非 manifest 条目计算 SHA-256；
- 以 `punk-publish/2` manifest 标注 `draft-not-published`、研究底图来源和 QA 状态。

该导出用于展示完整交付形状；它不会把规则化文案或研究预生成底图冒充为真实 Agent/Provider 输出。

## 场景化示例

| 场景 | 输入特征 | 输出形状 | 首选风格 | 本研究展示重点 |
| --- | --- | --- | --- | --- |
| 公众号 AI 长文 | 长文本、趋势与组织变化 | `2.35:1` 封面 | 黑白极简概念 | 长文摘要、视觉隐喻、左侧标题安全区 |
| 小红书效率笔记 | 数字清单、轻批判、强传播 | `3:4` 封面 | 复古手撕拼贴 | 五扇门的直接隐喻与移动端标题 |
| X 开源研究帖 | 英文技术主题、系统机制 | `5:2` 头图 | 复古油墨点阵隐喻 | 技术档案感和横向留白 |
| 宠物社交头像 | 宠物描述与三个识别特征 | `1:1` 头像 | 像素头像 | 小尺寸轮廓、纯色背景、裁剪安全 |
| AI 基础设施投资备忘录 | 商业判断、分层能力、可信度 | `16:9` 封面 | 咨询报告视觉 | 分层数据塔、增长路径、投资沟通安全区 |
| 免疫细胞医学科普 | 论文机制、对象关系、准确边界 | `3:4` 封面 | 科研期刊概念 | 细胞协同、非奇观化、上方标题安全区 |
| 企业产品集成发布 | 两套系统、双向同步、审计 | `5:2` 横幅 | 品牌协同连接 | 双模块与连接桥、不伪造 UI 和 Logo |
| 城市建筑展览 | 场馆、活动信息、城市文化 | `3:4` 海报 | 先锋复古建筑海报 | 建筑识别、限色、确定性活动文字层 |

可运行演示见 [`demos/punk-skill/`](../../demos/punk-skill/README.md)。

## 扩展实验：品牌视觉编译器

原生 Punk-Skill 更接近“一次任务生成一张图”。本研究用播客封面展示四个可以产品化的扩展模块：

### 1. 品牌令牌

将色板、材质、字体角色、安全区、栏目编号和禁用项升级为结构化字段，并在编译前验证，而不是全部放在自由文本中。

### 2. 可靠文字层

让图像模型只生成无字底图，再由 HTML/SVG/Canvas 精确渲染标题。这能显著降低中文错字、标题裁切和跨平台字号不一致问题。

### 3. 多平台变体编译

同一内容规格分别生成 `1:1`、`3:4`、`2.35:1` 和 `5:2` 的构图描述与安全区；不能把单一母图简单居中裁切。

### 4. Provider Adapter

针对不同图像模型转换负面提示、参考图策略、文字策略和参数，并记录 provider、model、生成时间、源 Prompt 与产物哈希。

## 可进一步扩展方向

| 方向 | 最小实现 | 研究问题 |
| --- | --- | --- |
| Prompt DSL | JSON Schema + 编译器 + 占位符检查 | 结构化约束能否提高完整性并降低维护成本？ |
| 自动风格路由 | 内容 embedding + metadata 排序 | 相比 LLM 自由推荐，路由准确率是否提高？ |
| 视觉评测 | OCR、语义相似度、风格分类、人评 | 如何衡量“封面好看且能传播”？ |
| 跨模型适配 | GPT Image / Flux / SD provider profiles | 风格原子在不同模型间的迁移损失多大？ |
| 品牌一致性 | 品牌 token、参考图、历史产物检索 | 多次生成能否保持系列感而非模板重复？ |
| Prompt 安全 | 用户正文与指令分区、内容清洗 | 如何避免文章中的 prompt injection 改写 Skill 行为？ |
| 批量工作流 | RSS/CMS → 审核 → 生成 → 发布清单 | 怎样在保留人工确认门的同时降低成本？ |

## 现有限制与代码观察

- 仓库不包含图像模型、权重、推理服务或模型训练代码。
- 视觉质量完全依赖宿主 Agent、所选图像模型和最终 Prompt 的执行情况。
- 两个验证脚本都是静态结构检查，没有端到端生成测试或视觉基准。
- `validate-punk-avatar.mjs` 中 `stylePath` 与 `promptPath` 都指向 `STYLE.md`，因此“Missing style metadata”检查实际上不会验证 `META.md`。
- `pixel-avatar/META.md` 声明 `input_modes: [image]`，但 Avatar Skill 同时支持文字描述，元数据与实际工作流存在范围差异。
- 当前没有 provider 版本、随机种子、成本、时延和产物哈希记录，难以复现。
- 上游没有明确许可证；在许可澄清前，本研究不复制其完整源码、提示词与图片资产到受版本控制目录。

## 研究价值判断

| 维度 | 判断 |
| --- | --- |
| 工程实践 | 高：适合作为 Agent Skill、Prompt 资产化与视觉知识库范例 |
| Agent / HCI | 中高：确认门、风格推荐与产物纪律可以进行用户实验 |
| Prompt 工程 | 中高：任务形状与风格原子分离值得做消融比较 |
| 基础算法 | 低：没有新模型或训练方法 |
| 当前科研成熟度 | 原型阶段：缺少数据集、基准、对照实验与统计结论 |

## 建议实验

构造同一批文章和主体，比较三条路线：

1. 每种场景一份完整固定 Prompt；
2. 通用任务 Prompt 与 STYLE 文本直接拼接；
3. Punk-Skill 式“任务蓝图 × 风格原子”融合编译。

至少记录 OCR 标题准确率、内容语义一致性、风格遵循、构图安全、视觉多样性、人工偏好、成本、时延和跨模型表现。只有完成这类对照，才能把“可维护的 Prompt 架构”进一步提升为研究结论。

## 代码地图

| 路径 | 职责 |
| --- | --- |
| `vendor-projects/Punk-Skill/` | 本地忽略的上游研究检出 |
| `demos/punk-skill/index.html` | 能力、场景、上游样例与扩展实验界面 |
| `demos/punk-skill/data/scenarios.js` | 独立构造的场景输入、语义字段和扩展规则 |
| `demos/punk-skill/data/upstream-styles.js` | 29 个上游样例的名称、说明、适用场景、视觉语言和远程来源 |
| `demos/punk-skill/app.js` | 场景切换、Prompt 摘要编译、manifest 与主题交互 |
| `demos/punk-skill/assets/` | 本研究预生成样例图，不含上游图片副本 |
| `studies/punk-skill/extensions/punk-publish/` | 可校验的完整发布包研究 Skill、schema、平台规则和打包脚本 |
| `studies/punk-skill/punk-publish-extension.md` | 扩展边界、真实调用与产物说明 |
| `studies/punk-skill/evaluation-protocol.md` | 单图与完整发布包的 A/B 评测预注册草案 |
| `studies/punk-skill/design-contract.md` | 范围、视觉与验收契约 |

## 关联资源

- [上游 README](https://github.com/adrianpunk/Punk-Skill/blob/main/README.md)
- [Cover Skill](https://github.com/adrianpunk/Punk-Skill/blob/main/skills/punk-cover/SKILL.md)
- [Avatar Skill](https://github.com/adrianpunk/Punk-Skill/blob/main/skills/punk-avatar/SKILL.md)
- [交互演示说明](../../demos/punk-skill/README.md)
