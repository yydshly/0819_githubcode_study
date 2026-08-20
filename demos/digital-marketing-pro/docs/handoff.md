# Digital Marketing Pro 能力研究台：交接说明

## 项目与阶段

本项目是 `0819 GitHub Code Study` 下的 Digital Marketing Pro 研究子项目。目标是解释上游真实能力与边界，而不是复刻真实营销执行后台。

## 运行与部署

- 本地启动：`python -m http.server 4173 --directory .`
- 本地 URL：`http://127.0.0.1:4173/demos/digital-marketing-pro/`
- Pages 目标路径：`/digital-marketing-pro/`
- 无构建步骤和运行时依赖。
- 上游研究检出使用其自身 `.venv` 完成依赖与测试验证；该环境位于被忽略的 `vendor-projects/` 内，不属于网页部署产物。

## 文件职责

| 路径 | 职责 |
| --- | --- |
| `index.html` | 语义结构、研究事实与五类能力展示 |
| `styles.css` | 亮暗主题、编辑型布局、响应式与 reduced-motion |
| `app.js` | 场景映射、筛选、主题和研究视角交互 |
| `../../studies/digital-marketing-pro/` | 研究结论与上游版本锁 |
| `../../vendor-projects/digital-marketing-pro/` | 本地上游检出；根仓库不跟踪 |

## 边界

- 任务输入不会发送、分析或持久化。
- 页面没有模拟登录、账户数据或“正在执行真实广告”的假状态。
- 上游 README 的效率、成本和合规声明均按“上游声称”处理；页面只把可从锁定源码复核的结构写成事实。
- 真实营销连接器、模型与账号测试需要新的明确授权。

## 下一轮研究建议

优先建立 Skill 路由评测集，再做品牌上下文、脚本门禁和通用 Prompt 的消融对照；在此之前不要把网页扩展成伪生产仪表盘。

## 验收结论

浏览器已验证桌面、平板、390px 手机、深浅主题、任务映射、能力筛选、研究视角、键盘和 reduced-motion；上游隔离安装后 402 项测试完成并通过（6 项按设计跳过）。详情见 [`validation.md`](validation.md)。本次范围没有延期项或阻塞项。
