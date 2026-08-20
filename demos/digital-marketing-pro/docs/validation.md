# Digital Marketing Pro 能力研究台：浏览器验收

- 验收日期：2026-08-20
- 工具：`agent-browser 0.27.0` / Chromium
- 本地静态服务：`python -m http.server 4173 --bind 127.0.0.1 --directory .tmp/dmp-pages-validation-20260820`
- 验收 URL：`http://127.0.0.1:4173/digital-marketing-pro/`

## 运行基线

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 页面加载 | PASS | 标题为“Digital Marketing Pro｜能力研究台” |
| 空白页/错误覆盖层 | PASS | `HAS_CONTENT`；框架错误覆盖层 `OK` |
| 浏览器错误 | PASS | `agent-browser errors` 无输出 |
| 控制台错误 | PASS | `agent-browser console` 无输出 |
| 静态资源 | PASS | `index.html`、`styles.css`、`app.js`、研究 README 与版本锁均 HTTP 200 |
| JavaScript 语法 | PASS | `node --check app.js` 退出码 0 |
| 研究总入口导航 | PASS | LAB 06 卡片、SVG 预览均存在；真实点击后标题变为“Digital Marketing Pro｜能力研究台” |

## 上游安装基线

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 隔离依赖安装 | PASS | 上游本地检出的 `.venv` 成功安装 `scripts/requirements.txt`；未污染主项目或全局 Python |
| 上游测试 | PASS | Python UTF-8 模式运行 `tests/run_all.py`：402 项完成，`OK (skipped=6)`，耗时 37.109 秒 |
| 外部资源边界 | PASS | NLTK 可选语料下载被当前网络安全策略拦截；上游回退路径生效，无测试失败；未据此宣称第三方平台已连通 |

## 主旅程与状态

| 操作 | 观察结果 | 状态 |
| --- | --- | --- |
| 选择“广告投放” | 活动场景变为 `campaign`，标题更新为“广告投放” | PASS |
| 点击“生成能力映射” | 状态从“已映射”变为“映射完成”，按钮变为“重新生成映射” | PASS |
| 筛选“SEO / AEO” | 12 张代表卡片缩减为 2 张，计数同步为 2 | PASS |
| 筛选“分析与质检” | 键盘 Enter 后显示 3 张，计数同步为 3 | PASS |
| 切换“营销效果”研究视角 | 评分由 8.2 更新为 4.6，结论与证据说明同步更新 | PASS |
| 深色 → 浅色 → 深色 | `data-theme` 与 `aria-pressed` 双向同步 | PASS |

## 跨尺寸与可访问性

| 表面 | 结果 | 证据 |
| --- | --- | --- |
| 1440 × 1000 桌面亮色 | 无遮挡；首屏结论、系统构成和主操作层级明确 | [`evidence-desktop-light.png`](evidence-desktop-light.png) |
| 1024 × 900 平板 | 文档宽度 1009 ≤ 1024；工作台保持 236px / 731px 双栏，无页面横向溢出 | [`evidence-tablet.png`](evidence-tablet.png) |
| 390 × 844 手机深色 | 文档宽度 375 ≤ 390；工作台为 349px 单栏，场景轨道内部可横向滚动 | [`evidence-mobile-dark.png`](evidence-mobile-dark.png) |
| 键盘入口 | 首次 Tab 聚焦跳转链接，焦点轮廓为 `solid`；Enter 到达 `#workbench` | PASS |
| 键盘场景切换 | 聚焦 `data-scenario=search` 后按 Enter，活动状态更新为 `search` | PASS |
| reduced-motion | 390px 环境中媒体查询返回 `true`；CSS 将动画/过渡压缩到 `0.01ms` | PASS |
| 中文标签宽度 | 桌面、平板、390px 均未出现文档级横向溢出；移动筛选器两列换行 | PASS |

## 边界验证

- 页面没有发出业务 API、模型、账户或表单提交请求。
- 任务文本仅保存在 textarea 当前值中；未写入 localStorage。localStorage 只保存主题。
- 页面明确标注“演示模式 · 不发送数据”以及连接器、审批、营销效果和法律认证边界。
- 当前没有弹窗、菜单或异步数据，因此 loading、empty、error dialog、Escape/focus return 不适用。

## 结论

设计契约中的页面、主交互、主题、三个视口、键盘和 reduced-motion 项均通过；无 `continue`、`defer` 或 `blocked` 项。
