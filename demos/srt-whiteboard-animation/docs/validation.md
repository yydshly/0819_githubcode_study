# SRT Whiteboard Animation 研究 Web 浏览器验收

## 运行环境

| 项目 | 记录 |
| --- | --- |
| 验收时间 | 2026-08-20（Asia/Shanghai） |
| 启动命令 | `node demos\srt-whiteboard-animation\serve.cjs 8879` |
| 规范 URL | `http://127.0.0.1:8879/demos/srt-whiteboard-animation/` |
| 浏览器 | Playwright bundled Chromium，headless |
| 页面类型 | 静态 HTML/CSS/JS，无构建、无后端 |
| 支持主题 | 浅色纸面主题；未声明暗色主题 |

Revision 2 浏览器证据保存在仓库内 `docs/evidence/`：

- `revision-2-desktop.png`
- `revision-2-tablet.png`
- `revision-2-mobile.png`

Revision 3 物理案例证据：

- `revision-3-desktop.png`
- `revision-3-tablet.png`
- `revision-3-mobile.png`

## 主旅程

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 页面载入 | 通过 | HTTP 200、正文 2962 字符、无错误覆盖层 |
| 真实视频 | 通过 | 1 个 MP4 video，支持 Range 请求 |
| 阶段跳转 | 通过 | 点击 3.2 秒阶段后 `currentTime = 3.2` |
| 键盘阶段跳转 | 通过 | 阶段按钮焦点环可见，Enter 可定位到 6.0 秒 |
| 参数到 CLI | 通过 | 12 秒、skeleton、brush、bare-tip 均同步到命令 |
| 参数到 JSON | 通过 | `sceneDurationMs = 12000`，3 个 elements |
| 叙事时间线 | 通过 | 3 个片段随时长和预设重排 |
| 复制反馈 | 通过 | 剪贴板成功后显示中文状态文本 |
| 视频回退 | 通过 | 拦截 MP4 后显示 GIF 预览入口 |
| 控制台错误 | 通过 | 正常路径无 console error；失败回退测试仅出现预期的拦截资源错误 |
| 三案例切换 | 通过 | monkey / photosynthesis / delivery 三种状态均更新标题、参数、视频与工件路径 |
| 五步生成链路 | 通过 | 5 个步骤可依次显示真实 SRT、1672px 源图、annotation、CLI、MP4 |
| 知识案例参数 | 通过 | 命令包含 `skeleton` 与 `contour-wipe`，视频可载入 |
| 流程案例参数 | 通过 | 命令包含 `grid`、`brush` 与 `bare-tip`，视频可载入 |
| 案例键盘切换 | 通过 | 聚焦故事案例后按 ArrowRight 选择知识案例 |
| 物理案例切换 | 通过 | 第四个案例更新为“火箭为什么升空”，视频元数据时长 10 秒 |
| 物理案例五步工件 | 通过 | SRT、1672px 源图、annotation、真实 CLI 与 MP4 均可点击查看 |
| 物理案例渲染参数 | 通过 | 命令包含 `skeleton`、`brush`、`--total-ms 10000` |
| 物理案例 Range | 通过 | MP4 返回 HTTP 206 与 `Content-Range: bytes 0-99/1142911` |

## 跨表面矩阵

| 表面 | 结果 |
| --- | --- |
| 1440 × 1000 桌面 | 四个案例为四列；视频/摘要双栏与五步工件台层级成立 |
| 768 × 900 平板 | 四个案例为 2×2；横向溢出为 0，五步按钮 3+2 排列 |
| 390 × 844 手机 | 四个案例单列；横向溢出为 0，五个步骤纵向可达 |
| 中文本地化 | 长中文标题、说明和控件标签在三种宽度均正常换行 |
| 键盘 | 原生按钮、radio、range、select、checkbox 可聚焦，统一焦点环可见 |
| Reduced motion | 媒体查询命中；页面滚动行为为 `auto`，非必要过渡关闭 |
| 媒体能力回退 | MP4 请求失败时保留正文，并显示 GIF 链接 |

页面只声明浅色主题，因此暗色切换不属于支持面，也不是延期项。页面没有弹窗、远程数据、加载骨架或业务提交状态，相应状态检查不适用。

## 性能观察

本地 Range 服务器、1440px Chromium 环境下：

- DOMContentLoaded：约 53 ms。
- load event：约 324 ms。
- 浏览器 `networkidle` 墙钟时间：约 820 ms。
- 首屏脚本与样式传输约 30 KB。
- MP4 约 1.20 MB，poster 与时间线图片合计约 105 KB。

Revision 2 新增两条 MP4（约 0.75 MB、0.22 MB）与两张 1672×941 源图。案例视频使用 `preload="metadata"`，流程中的第二张视频使用 `preload="none"`；正文、控制台和判断不依赖视频成功载入。

## Revision 2 实际媒体核验

| 案例 | 渲染参数 | ffprobe 结果 | 中间帧观察 |
| --- | --- | --- | --- |
| 光合作用 | `skeleton + contour-wipe + hand` | H.264、1080×600、60 FPS、9.1 秒、752,620 bytes | 4.5 秒仅左区完成、中区落墨，右区未出现 |
| 从想法到交付 | `grid + brush + bare-tip` | H.264、1080×600、60 FPS、9.6 秒、217,450 bytes | 4.8 秒左区完成、中区落墨，右区未出现 |

两条视频均由 `vendor-projects/srt-whiteboard-animation/scripts/render_stream_whiteboard.py` 实际执行产生；不是前端动画或替换 poster。

## Revision 3 物理案例实际媒体核验

| 案例 | 渲染参数 | ffprobe 结果 | 中间帧观察 |
| --- | --- | --- | --- |
| 牛顿第三定律：火箭为什么升空 | `skeleton + brush + hand` | H.264 High / yuv420p、1080×600、60 FPS、10.000 秒、600 帧、1,142,911 bytes | 2.8 秒仅发动机燃烧；5.2 秒向下喷气区落墨；8.1 秒火箭与向上反作用力出现；9.9 秒全图完成 |

该 MP4 由上游 `render_stream_whiteboard.py` 对本项目的真实源图和三个矩形标注区执行产生。浏览器正常路径 `consoleErrors`、`pageErrors`、`requestFailures` 均为空；案例选择器在 1440 / 768 / 390px 下分别为 4 / 2 / 1 列，横向溢出均为 0；方向键切换后焦点环为 `solid`。

## Refinement ledger（Revision 3）

```text
Current stage: Stage 1–9
User phase: 用物理原理观察真实效果并理解驱动链路
Coverage item: 牛顿第三定律真实动画 + 五步工件 + 四案例响应式
Browser environment: bundled Chromium / 1440, 768, 390
Observed evidence: 三个独立画面区域依次显现，最终输出为 600 帧 H.264；三视口无溢出
Problem category: explanatory fidelity + control discoverability
Root cause: 概念说明不能直接证明“静态图、区域、时间如何变成画笔动画”
Minimal intervention: 新增火箭案例，复用共享案例选择器和五步工件台，不另造一套交互
Adjacent regression surfaces: 原三案例、阶段 seek、控制台、sticky 导航、媒体回退
Observed result: 真实视频与输入工件同步可查，键盘、Range、移动端和错误面通过
Decision: pass
Next executable action: —
New authority required: no
```

## Refinement ledger（Revision 2）

```text
Current stage: Stage 2–7
User phase: 比较真实案例并理解生成链路
Coverage item: 三案例 + 五步工件台 + 390px
Browser environment: bundled Chromium / 1440, 768, 390
Observed evidence: 原先只有一条故事视频，无法比较不同输入结构和参数；新增结构在三视口均无溢出
Problem category: information hierarchy + control discoverability
Root cause: 单案例只能证明“能运行”，不能解释如何复用
Minimal intervention: 在原成片与通用控制台之间加入三案例选择器和共享五步工件台
Adjacent regression surfaces: 原视频阶段跳转、控制台、sticky 导航、媒体回退
Observed result: 三案例可切换，真实工件随状态同步，键盘与移动端通过
Decision: pass
Next executable action: —
New authority required: no
```

## 修复记录

1. 首轮桌面截图出现标题孤字换行，降低大屏标题字号后通过。
2. 阶段跳转在不支持 Range 的 Python 静态服务器中被重置；保留支持 Range 的 `serve.cjs` 作为规范本地入口。
3. 自定义手部开关装饰层拦截指针命中；将装饰层设为 `pointer-events: none`。
4. 剪贴板状态为异步更新；验收脚本改为等待 live region 更新。
5. MP4 请求失败最初只触发 `<source>` 错误；同时监听 video/source 后，GIF 回退通过。
6. Revision 2 的正常媒体切换会主动中断上一条 Range 请求，验收脚本将 `ERR_ABORTED` 与真实网络失败分开；正常路径 console/page/request error 均为 0。
7. 案例视频被故意改为不存在地址后，回退提示与下载入口可见；该故障注入产生的单条 404 是预期证据。

## Revision 4 生产部署验收

GitHub Pages 工作流 [32383473996](https://github.com/yydshly/0819_githubcode_study/actions/runs/32383473996) 成功，生产 URL 为 <https://yydshly.github.io/0819_githubcode_study/srt-whiteboard-animation/>。

- 页面标题正确，4 个案例均登记，默认 MP4 元数据时长 8.6 秒且无媒体错误。
- 牛顿第三定律视频 Range 请求返回 HTTP 206，`Content-Range: bytes 0-99/1142911`。
- 页头返回链接在部署组装后为 `../`，研究记录链接为 `../studies/srt-whiteboard-animation/README.md`。
- 1440px 与 390px 横向溢出均为 0；390px 下 4 个案例保持可达。
- 从生产研究总入口以键盘进入 SRT 页面，焦点轮廓可见。
- 正常主旅程的 console、page 和 request failure 均为 0。

Revision 4 的 Pages、根 README 与主入口关联均判定为 `pass`。
