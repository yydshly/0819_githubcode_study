# Punk Skill 能力实验室 · 交接

## 项目与阶段

本项目是主研究库的第二个可运行能力实验室，当前完成“上游获取与复现、原生能力说明、场景化示例、扩展示例和多表面验收”。

## 已完成

- 上游浅克隆固定到 `d62d998`，本地运行两个校验脚本。
- 将“真实怎么用”提升为首个正文任务：提供安装指令、封面 / 头像任务构造、平台与风格选择、生成 / 仅 Prompt 状态、复制操作和预期产物路径。
- 建立用户、Punk Skill、图像 Provider 与文件系统四方边界，明确网页只是教学与调用指令构造器，真实执行发生在 Agent 会话。
- 展示一条指令发出后的五步对话：输入、Skill 编译、Prompt 落盘、Provider 画图、人工检查与发布。
- 建立“任务结构 + META + STYLE → 融合 Prompt → Provider”的原理说明和能力边界。
- 建立内容发布、商业沟通、科研教育、人物 / 宠物与文化 IP 四类使用场景地图。
- 建立公众号、小红书、X、宠物头像、投资备忘录、医学科普、企业集成和城市展览八个交互场景。
- 生成九张自有研究样例并实现可靠文字层。
- 远程展示全部 29 张上游自带样例；每项补充风格描述、适用场景和视觉语言，并提供类型筛选与搜索。
- 实现品牌令牌、可靠文字、多平台变体和 provider adapter 扩展 manifest。
- 新增仓库内 `$punk-publish` 研究 Skill；通过结构校验和打包脚本 fixture 验证。
- 将真实使用台默认输出升级为小红书完整发布包，包含可编辑文案、Alt、可靠文字封面、平台预览、文件树与 manifest。
- 修复安装断点：页面分别提供上游视觉 Skills 和仓库内 `$punk-publish` 的发现指令，Skill 增加依赖检查与缺失停止条件。
- 增加 AI Agent、产品发布、研究解读、活动宣传和课程知识五套完整发布预设。
- 增加 6 项动态 QA；已验证通过状态、超长标题 warning 和 Alt 标题同步。
- 增加零依赖浏览器导出器：真实生成 900×1200 PNG 与 11 文件 ZIP，并记录实际字节 SHA-256。
- 建立 30 个来源、A/B 配对的单图 vs 完整发布包评测协议；尚未开展主实验。
- 将 Pages 工作流升级为统一研究实验室 artifact：保留 Outfit Director 根入口，新增 `/punk-skill/` 与 `/studies/`；本地组装路径已通过浏览器和 ZIP 验收。
- 完成桌面、平板、手机、主题、键盘、复制与 reduced-motion 验收。

## 延期与边界

- 没有部署真实图像模型或 Agent 运行时；触发条件是后续需要验证端到端生成质量。
- 没有在线发布 Punk Skill 演示；当前 GitHub Pages 工作流仍只部署 Outfit Director。需要发布时应先决定多演示入口结构，再调整 Pages 工作流。
- 没有复制上游源码或图片；触发条件是上游明确许可证并允许对应使用。
- 没有连接小红书或其他平台账号；`$punk-publish` 只生成 `draft-not-published` 草稿，不授权自动发布。
- 浏览器 ZIP 中的 artwork 是研究预生成资产，manifest 如实记录；真实生产必须以 Provider 返回物替换。

这些都是非阻塞边界，当前要求的本地研究演示已闭环。

## 验证证据

- 运行与浏览器结果：[validation.md](validation.md)
- 来源与许可：[upstream-attribution.md](upstream-attribution.md)
- 图片生成记录：[image-generation.md](image-generation.md)
- 研究结论：[`studies/punk-skill/README.md`](../../../studies/punk-skill/README.md)

## 下一次优先事项

如果继续研究，优先建立同一批内容的三路消融实验：固定完整 Prompt、通用规则直接拼接、风格原子编译；然后记录 OCR、语义、风格遵循、人评、成本和时延。
