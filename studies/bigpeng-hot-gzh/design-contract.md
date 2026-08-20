# BigPeng Hot GZH Demo 设计契约

```text
Entry mode: brief-led
Request revision: 1
Target user and context: 评估 Agent Skill 的研究者、内容运营者；在不接入后端的情况下理解上游能力。
Desired first impression: 一个可操作、诚实区分事实与模拟的内容策略实验台。
Visual ambition: Functional
Experience architecture: Editorial Flow
Visual constraints: 中文优先；暖白纸面、深墨色、朱砂红和青绿语义色；支持深浅主题。
Information constraints: 先说清“不是爬虫”，再让用户运行路径 A/B，最后展示原理、边界和研究价值。
Operation constraints: 零依赖静态页；不请求真实模型、不搜索网络、不发布内容；支持键盘。
State constraints: 路径 A、路径 B；预设/自定义输入；输出成功；复制反馈；输入缺失错误；深浅主题。
Environment constraints: 原生 HTML/CSS/JavaScript，可通过 python http.server 或 GitHub Pages 运行。
Primary journey: 选择 A/B 路径 → 加载预设或填写结构化输入 → 生成 → 检查公式、兑现和 QA → 复制真实 Agent 调用指令。
User-defined phases: 获取上游；建立研究子项目；完成实际 Demo；验证。
Required artifacts: 上游版本锁、研究 README、可运行演示、设计契约、浏览器验收、项目索引。
Autonomy authorization: 用户明确要求获取并作为研究子项目进行实际 Demo 演示。
User-decision boundary: 真实模型 API、实时搜索、账号登录或内容发布需要额外授权，不在本次范围。
Observable completion criteria: 本地 URL 可打开；A/B 路径可切换并生成不同输出；自定义输入、复制、主题和响应式通过验收；页面明示能力边界。
```

## 设计方向

| 决策 | 选择 | 可观测约束 | 验收标准 |
| --- | --- | --- | --- |
| 信息层级 | “两条路径”是首要操作，研究说明后置 | 首屏必须同时看到定位、路径和生成入口 | 用户不看 README 也能完成一次演示 |
| 类型角色 | 标题用现代宋体角色，正文用系统无衬线 | 中文字体无需外网加载 | Windows 和移动端都保持清晰层级 |
| 色彩语义 | 朱砂红表示路径/操作，青绿表示通过，琥珀表示需兑现 | 不仅依靠颜色传达状态 | 状态同时有文字与图形标识 |
| 密度 | 操作区和结果区在桌面端并排，移动端串行 | 不使用隐藏关键信息的弹窗 | 390px 下无横向滚动 |
| 动效 | 只用于路径和复制状态变化 | 遵守 `prefers-reduced-motion` | 关闭动效后信息不缺失 |

## Coverage manifest

| 用户阶段 | 要求 | 表面 / 状态 | 证据 | 阶段 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 获取上游 | 锁定来源、commit 和许可证 | 研究文档 | 锁文件与本地 Git 校验 | 0/9 | pass |
| 能力演示 | 路径 A | 桌面端/移动端、深/浅主题 | 真实浏览器操作与截图 | 1–7 | pass |
| 能力演示 | 路径 B | 桌面端/移动端、深/浅主题 | 真实浏览器操作与截图 | 1–7 | pass |
| 诚实边界 | 区分原生 Skill、确定性演示和外部能力 | 页面与 README | DOM 文本和文档复核 | 3/9 | pass |
| 交付 | 可复制指令、项目索引、部署路径 | 页面、README、workflow | 交互与文件检查 | 5/9 | pass |
| 验收 | 浏览器、响应式、键盘、减少动效 | 全表面 | 浏览器记录 | 7/9 | pass |
