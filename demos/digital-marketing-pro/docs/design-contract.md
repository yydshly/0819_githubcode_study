# Digital Marketing Pro 能力研究台：设计契约

```text
Entry mode: Brief-led / greenfield research demo
Request revision: 1
Target user and context: 希望快速理解开源 Agent 项目真实能力的研究者、产品负责人和营销从业者
Desired first impression: 这不是“又一个营销 AI”，而是一套可检查、可恢复、可连接外部工具的营销 Agent SOP
Visual ambition: Editorial
Experience architecture: Editorial Flow
Visual constraints: 中文优先；研究仪器感；高信息密度但首屏结论明确；不使用装饰性 3D 或生成图片
Information constraints: 所有数字来自锁定的上游版本；明确区分 Skill、Python 脚本、外部连接器和宿主模型；不把 README 声明写成独立验证结论
Operation constraints: 纯静态 HTML/CSS/JavaScript；无后端、登录、真实营销 API 或真实外部执行
State constraints: 支持五类任务场景、能力域筛选、研究视角切换、亮暗主题；交互只演示能力映射，不伪装真实执行
Environment constraints: 兼容 GitHub Pages；本地可由静态 HTTP 服务器直接运行；不增加构建依赖
Primary journey: 选择营销任务 → 运行能力映射 → 查看输入、处理链、交付物、人工决策点和能力边界 → 进入研究证据
User-defined phases: 安装上游；研究能力；制作网页；接入研究总入口；验证并交接
Required artifacts: 上游版本锁、研究 README、可运行能力网页、设计契约、浏览器验收、交接说明、根索引与 Pages 部署入口
Autonomy authorization: 用户已明确授权“作为研究子项目进行安装并研究，用网页展现能力”；范围内可逆实现无需二次确认
User-decision boundary: 真实账户连接、发布/投放、密钥配置、修改上游源码、对外部署或提交均不在本次授权内
Observable completion criteria: 页面能在桌面/平板/390px 手机运行；五种场景可切换；能力筛选与研究视角有效；亮暗主题、键盘焦点和 reduced-motion 可用；上游事实与边界可追溯；Pages 工作流包含新子项目
Coverage record: 见下表
```

## 设计方向

| 层级 | 选择 | 可观察结果 |
| --- | --- | --- |
| 构图 | 结论型首屏 + 能力工作台 + 证据型长页 | 用户先理解定位，再用场景交互验证理解 |
| 焦点 | “营销 SOP，不是模型”作为首屏主结论 | 首屏不以 163 这个数量抢占产品定义 |
| 字体 | 中文无衬线正文 + 等宽数据标签 | 阅读内容与系统证据角色明确 |
| 色彩 | 墨色、纸白、信号绿、审批橙 | 绿代表确定性脚本，橙代表人工/外部边界 |
| 材质 | 细线、网格、状态条和审计标签 | 保持研究台质感，不使用拟物仪表盘 |
| 动效 | 仅用于场景映射和筛选状态 | reduced-motion 下直接切换，不隐藏信息 |

## 覆盖清单

| 用户阶段 | 要求或产物 | 页面/状态 | 证据 | 所属阶段 | 状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| 安装上游 | 上游源码本地检出并锁定版本 | `vendor-projects/digital-marketing-pro` | commit/tree/license/counts | 0–1 | pass | 写入版本锁 |
| 研究能力 | 研究结论与真实边界 | `studies/digital-marketing-pro` | README + upstream-lock | 3 | pass | — |
| 制作网页 | 首屏准确解释项目定位 | 桌面亮色 | 浏览器截图/DOM | 2 | pass | — |
| 制作网页 | 五种任务能力映射 | 工作台五个状态 | 交互记录 | 4–6 | pass | — |
| 制作网页 | 能力域筛选与研究视角 | 筛选/切换状态 | 交互记录 | 4–6 | pass | — |
| 制作网页 | 亮暗主题 | 两种主题及双向切换 | 浏览器截图/样式观察 | 6–7 | pass | — |
| 制作网页 | 响应式布局 | 1440 / 1024 / 390 | 浏览器截图 | 7 | pass | — |
| 制作网页 | 键盘与焦点 | 主旅程 | Tab/Enter/焦点观察 | 7 | pass | — |
| 制作网页 | reduced-motion | 系统偏好状态 | 浏览器观察或有效延期记录 | 7–8 | pass | — |
| 接入入口 | 根 README、研究门户和 Pages 流程 | 导航与部署路径 | 文件检查 | 9 | pass | — |
| 验证交接 | 设计、验收、交接文档 | `docs/` | 文件与运行记录 | 9 | pass | — |
