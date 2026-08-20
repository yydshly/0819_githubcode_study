# SRT Whiteboard Animation 研究 Web 交接

## 当前项目与阶段

这是 `geeklee/srt-whiteboard-animation` 的独立静态研究页。Revision 3 已完成前端精修流程 Stage 0–9，四案例演示、物理原理成片与驱动链路交付范围关闭。

## 已完成

- 真实复现 MP4 与四阶段跳转。
- 对应上游真实参数的驱动控制台。
- CLI 与 `annotation.json` 实时输出。
- 三区域动态标注时间线。
- 三层控制协议、适合/谨慎/不适合场景矩阵。
- 已验证能力、外部依赖、工程风险和阶段评分。
- 总研究入口卡片与 GitHub Pages 组装流程。
- 支持视频 Range 的零依赖本地服务器。
- MP4 失败时的 GIF 回退。
- 三个实际案例：故事叙事、知识解释、流程说明。
- 每个案例的源图、SRT、`annotation.json`、渲染命令与 H.264 MP4。
- 可点击的五步驱动链路，以及案例/步骤键盘方向键切换。
- 两条新增上游实际渲染视频与区域检查图、中间帧、poster。
- 第四个实际案例“牛顿第三定律：火箭为什么升空”，按燃烧、向下喷气、向上反作用三段渲染。
- 物理案例 10 秒 H.264 MP4（1080×600、60 FPS、600 帧）及源图、SRT、annotation、CLI、poster 和三张中间帧。
- 四案例选择器的 1440 / 768 / 390px 浏览器验收，以及键盘焦点、Range 与正常路径零错误证据。

## 未包含

没有引入后端、登录、真实 OpenCV Web API、在线重新渲染、配音或外部媒体服务。这些属于新的产品范围，不是当前延期项。

## 验证证据

- [设计契约](design-contract.md)
- [浏览器验收](validation.md)
- `node --check demos\srt-whiteboard-animation\app.js`
- 桌面、平板、390px 手机截图与驱动台截图
- 正常路径零 console error
- 阶段 seek、CLI/JSON、复制、键盘、reduced-motion、视频失败回退均通过
- `docs/evidence/revision-2-{desktop,tablet,mobile}.png`
- `docs/evidence/revision-3-{desktop,tablet,mobile}.png`
- 1440 / 768 / 390 的案例主旅程；平板与手机横向溢出均为 0
- `ffprobe`：知识案例 9.1 秒、流程案例 9.6 秒，均为 H.264 1080×600 60 FPS
- `ffprobe`：物理案例 10.0 秒、600 帧、1,142,911 bytes，H.264 1080×600 60 FPS

## 后续会话入口

如以后增加真实在线渲染，第一步应重新定义后端授权、任务队列、文件上传与成本边界，而不是直接把当前配置模拟器改名为生成器。新增案例时，复制 `cases/<case>/` 的五类工件结构，并在 `app.js` 的 `caseLibrary` 中登记；继续保持“真实证据”和“交互解释”分离。
