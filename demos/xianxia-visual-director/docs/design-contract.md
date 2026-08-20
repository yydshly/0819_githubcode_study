# 展示页设计契约

```text
Entry mode: brief-led
Request revision: 0
Target user and context: 浏览 GitHub 项目研究索引、希望快速理解该 Skill 的中文读者
Desired first impression: 这是仙侠场景提示词导演，而不是图像模型
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 东方纸张、玉石与朱砂语义；主视觉必须服务于三类场景比较；不伪造上游输出
Information constraints: 先给结论，再展示三类场景，随后解释单一原理链路与研究边界
Operation constraints: 无后端；三个场景标签可用鼠标与键盘触发；提示词摘要可复制
State constraints: 单体仙境为默认；三个选中状态必须同步更新图像、路由、说明和提示词摘要
Environment constraints: 无依赖静态站点；GitHub Pages；现代桌面和移动浏览器
Primary journey: 打开页面 → 理解项目定位 → 切换三类场景 → 查看目标效果 → 理解提示词生成原理
User-defined phases: 获取上游；登记研究；展示场景与目标效果；不做深入研究
Required artifacts: 上游本地检出、研究 README、静态展示页、三张独立研究示意图、生成记录、部署入口
Autonomy authorization: 用户明确要求“作为子项目开始研究”，允许范围内直接实现
User-decision boundary: 真实图片 Provider 接入、扩大为算法研究或发布到外部账号
Observable completion criteria: 三类场景均可切换；图片和文字匹配；页面在桌面、平板和 390px 手机无阻断；无控制台错误；文档明确许可和能力边界
```

## 设计方向

| 决策 | 方向 | 可观察标准 |
| --- | --- | --- |
| 信息层级 | 项目结论 → 场景 → 原理 → 边界 | 首屏直接出现“提示词导演，不是图片模型”的说明 |
| 视觉锚点 | 三张仙侠环境示意图 | 切换场景时图像、路由和文案同步 |
| 字体角色 | 衬线标题 + 无衬线正文 + 等宽提示词 | 标题有编辑感，正文和 Prompt 保持清晰 |
| 色彩 | 纸白、墨绿、朱砂、旧金 | 颜色不依赖单一状态表达，正文保持可读 |
| 响应式 | 桌面双栏、移动单栏 | 390px 无横向溢出，标签与详情可顺序阅读 |
| 动效 | 仅用于场景状态切换 | `prefers-reduced-motion` 下取消过渡，不隐藏信息 |

## 覆盖记录

| 用户阶段 | 要求 | 表面 / 状态 | 证据 | 状态 |
| --- | --- | --- | --- | --- |
| 获取上游 | 固定研究版本 | 本地研究检出 | commit SHA 与文件清单 | pass |
| 登记研究 | 总索引和研究 README | 仓库文档 | 文件检查 | pass |
| 展示效果 | 默认场景和三种切换 | 桌面 1440px | 浏览器截图、DOM 和交互 | pass |
| 展示效果 | 场景与内容适配 | 平板 900px | 浏览器截图与溢出检查 | pass |
| 展示效果 | 可阅读和可操作 | 手机 390px | 浏览器截图、键盘路径和溢出检查 | pass |
| 能力边界 | 图片、许可和模型边界明确 | 页面与 README | 文本检查 | pass |
| 部署 | Pages 组装路径存在 | GitHub Actions YAML | 配置检查 | pass |
