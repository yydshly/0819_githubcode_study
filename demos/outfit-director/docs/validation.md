# 浏览器验收记录

规范运行地址：`http://127.0.0.1:4173/`。

## Runtime

- Start command：`python -m http.server 4173 --bind 127.0.0.1 --directory demos/outfit-director`
- Browser automation：`agent-browser 0.27.0`，Chromium 无头模式
- Timestamp：2026-08-20（Asia/Shanghai）

## Evidence

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Desktop | 1440×1000 / dark / K default | pass | 首屏、三列工作台、5 造型母图和参数输出可见；无错误覆盖 |
| Desktop | 1440×1000 / dark / pet D | pass | 7 套宠物造型、M13、6 个时间点和参数输出同步 |
| Desktop | 1440×1000 / light / final state | pass | 深浅主题切换后层级、边界和文字保持清晰 |
| Tablet | 1024×900 | pass | 输出面板转换为整行详情区；`scrollWidth <= clientWidth` |
| Mobile | 390×844 / dark | pass | 单列任务流、控件、舞台、标签和正文无横向溢出 |
| Pointer | Generate journey | pass | 滚入视口后点击生成，输出切换为女性 / K / 东方叙事 |
| Keyboard | Primary journey | pass | 聚焦生成按钮并按 Enter；标签、复制和主题操作均可用 |
| State | K playback | pass | 4 个侧边造型永久清空，中央为最终造型，读数 `09.0 / 09.0s` |
| State | Tabs and copy | pass | 切到精简视频提示词；反馈为“已复制：精简视频提示词” |
| Motion | Reduced motion | pass | 媒体查询为 true；播放立即完成并显示可读完成提示 |
| Runtime | Errors and resources | pass | 页面错误为空；HTML、CSS、JS、SVG 四个本地请求均为 200 |
| Performance | Local static server | pass | TTFB 0.7ms；FCP/LCP 48ms；CLS 0 |

## Final visual evidence

- Desktop dark：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787155635728.png`
- Desktop light：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787156092737.png`
- Tablet light：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787156122724.png`
- Mobile dark：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787156149014.png`

截图保存在浏览器工具的临时证据目录，不进入产品提交。

## Applicable boundaries

- 单一中文界面，不提供语言切换；已检查中文长标签在 390px 下的换行和控制宽度。
- 不使用模态框、抽屉、外部 API、Canvas 或 WebGL。Revision 2 新增一张延迟载入的本地写实图片，并提供色块与文字降级状态。
- 页面模拟规则输出和预生成视觉切换，不验证真实图像/视频模型的生成质量或真实虚拟试衣准确度。

## Revision 2 · 双实验验收

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Desktop | 1440px / A default | pass | A/B 导航、模型选择、人物/衣服素材和原三列工作台完整可见 |
| A interaction | 身份优先图像 + 动作优先 I2V | pass | 首帧输出出现模型适配、Image 1 与素材边界；视频输出出现目标模型与首帧输入规则 |
| A upload | 本地人物 + 单个衣服文件 | pass | 参数输出同步为 `Image 1「fictional-model-five-looks.png」` 与 `Image 2`；无网络上传 |
| Desktop | 1440px / B / look 01 | pass | 写实虚构人物全身、五套衣橱、证明面板和 2D 边界可见 |
| B interaction | look 05 | pass | 舞台切至黑色礼服；衣橱、造型名称和证明面板同步 |
| B autoplay | 从 look 05 重新开始 | pass | 自动回到第 1 套并依序运行，结束停留第 5 套且按钮恢复“自动换装” |
| Tablet | 1024×900 / B | pass | `scrollWidth = clientWidth = 1009`，无横向溢出 |
| Mobile | 390×844 / B | pass | 衣橱两列、写实舞台、证明面板与能力区按任务顺序单列展示 |
| Theme | Tablet / light | pass | `data-theme=light`，正文计算颜色 `rgb(21, 32, 27)` |
| Motion | B / reduced-motion | pass | 自动换装立即到达 `LOOK 05 · 黑色礼服`，结果可读 |
| Runtime | Errors | pass | 浏览器页面错误为空；JavaScript 语法检查通过 |
| Performance | Local static server | pass | 预生成素材 1,748,951 bytes，仅进入 B 时加载；FCP 84ms，DCL 52.4ms |

### Revision 2 visual evidence

- Desktop A：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157589431.png`
- Desktop B / look 01：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157617145.png`
- Desktop B / look 05：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157707477.png`
- Mobile B / look 05：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787157880046.png`

Revision 2 截图同样只保存在浏览器工具临时证据目录，不进入产品提交。

## Revision 3 · 提示词优先与网页效果优化

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Desktop | 1440px / A / T2V default | pass | SIMPLE / T2V 为默认路线；I2V 专用首帧和素材字段隐藏；视频标签默认激活 |
| A interaction | T2V submit | pass | 提交后仍停留视频标签；输出以“纯文本生成视频 T2V”开头，包含画幅、主体、造型顺序、时间点与硬性限制 |
| A interaction | Copy | pass | 复制反馈为“已复制：直接视频提示词” |
| A interaction | I2V selected | pass | 首帧模型、人物与衣服字段按需出现；输出明确要求把确认后的首帧作为唯一视频输入 |
| A state | I2V → T2V | pass | 路线切换后输出立即同步，不保留上一条路线的旧提示词 |
| Desktop | 1440px / B / veil | pass | 布料扫光触发 `is-changing`，舞台、衣橱和证明面板同步到第 4 套 |
| B interaction | Beat / manual | pass | 卡点闪切触发 `data-effect=beat`，结果同步到第 5 套 |
| B interaction | Autoplay | pass | 自动播放结束为 `LOOK 05`，按钮恢复“自动换装”，过渡类清理 |
| Mobile | 390×844 / A and B | pass | 两路线单列可读，效果选择器占完整一行；`scrollWidth = clientWidth = 375` |
| Tablet | 1024×900 / light | pass | 浅色主题正常，`scrollWidth = clientWidth = 1009` |
| Keyboard | Experiment navigation | pass | 焦点位于 A 标签时按 Enter 可切换；工作台显示、`aria-selected=true`、焦点 outline 为 solid |
| Motion | B / reduced-motion | pass | 重置后自动换装立即到达 `LOOK 05`，舞台无 `is-changing` 类 |
| Runtime | Errors and overlay | pass | 浏览器错误为空；正文非空；无框架错误覆盖；JavaScript 语法检查通过 |
| Performance | Static runtime | pass | 未新增图片或运行时依赖；首次绘制 64ms |

### Revision 3 visual evidence

- Desktop A / T2V：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787190761232.png`
- Desktop B / veil：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787190957022.png`
- Mobile A：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787191110919.png`
- Mobile B：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787191200437.png`

Revision 3 截图只保存在浏览器工具临时证据目录，不进入产品提交。

## Revision 4 · 技术路线与能力接入展示

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Repository | 总体规划 | pass | `docs/virtual-tryon-technology-roadmap.md` 包含五目标、M0–M7 阶段、能力矩阵、项目拆分、评估与决策门槛 |
| Root index | 路线入口 | pass | 根 README 提供路线链接、五目标状态和近期 E001 动作 |
| Desktop | 1440×1000 / dark / goal 01 | pass | 五目标导航、当前研究位置、目标一详情和 M0–M7 里程碑完整可见 |
| Roadmap | goal 02 | pass | 详情同步为“基于全身照的 2D AI 虚拟试衣”，状态为“下一阶段”，输入 / 能力 / 输出 / 完成标准同步更新 |
| Roadmap CTA | goal 01 → A | pass | CTA 后 `experiment=prompt`，A 显示、B 隐藏 |
| Roadmap CTA | goal 02 → B | pass | CTA 后 `experiment=visual`，B 显示、A 隐藏，并滚动至视觉原型 |
| Keyboard | goal 02 + ArrowRight | pass | 选中与焦点同步到 goal 03，详情标题为“3D 参数化虚拟试衣间” |
| Tablet | 1024×900 / light / goal 03 | pass | 左侧目标、右侧详情保持可读；`scrollWidth 1009 < innerWidth 1024` |
| Mobile | 390×844 / light / goal 02 | pass | 目标列表、详情、流程和三类能力按单列展开；`scrollWidth 375 < innerWidth 390` |
| Runtime | Errors and syntax | pass | 浏览器错误与控制台为空；`node --check` 与 `git diff --check` 通过 |
| Assets | Static runtime | pass | 路线展示仅新增 HTML / CSS / JS / Markdown，不新增图片、模型或运行时依赖 |

### Revision 4 visual evidence

- Desktop dark / goal 01：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787194809125.png`
- Tablet light / goal 03：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787194956407.png`
- Mobile light / goal list：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787194992138.png`
- Mobile light / goal 02 detail：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787195010047.png`

Revision 4 截图只保存在浏览器工具临时证据目录，不进入产品提交。

## Revision 5 · Female Outfit Director 规则接入

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Source | female variant pin | pass | 上游固定为 `2d30d40d09368aab333d054c035289061c9fcf47`；MIT、来源和适配边界已写入仓库 |
| Static data | profiles / mechanisms / presets | pass | 女性 profile、M1–M13 与四类预设分离；页面加载三个数据文件且回退数据仍可用 |
| Desktop A | 1440px / dark / female / M12 | pass | 女性专项字段展开；视频输出包含女性身份锚点、妆容/配饰/衣料和 M12 衣纹执行规则 |
| A route guard | female → male | pass | 自动切回 `general`，专项字段隐藏，K 机制由 12 个回到 4 个网页可预览项 |
| Desktop B | M1 / M2 / M8 / M10 | pass | 四种选择分别产生 `effect-person-fly`、`effect-veil`、`effect-sticker-flip`、`effect-beat`，造型名称与结果同步 |
| Capability boundary | A and B notices | pass | 页面明确 4 个网页模拟、8 个外部提示词专用；未声称真实服装迁移 |
| Keyboard | female profile | pass | 聚焦女性专项单选并按 Space 后保持焦点、选中状态与字段可见状态同步 |
| Tablet | 1024×900 / light / female | pass | `scrollWidth 1009 < innerWidth 1024`，新增配置和状态母图保持双栏可读 |
| Mobile A | 390×844 / dark / female | pass | 完整单列流程可读；`scrollWidth 375 < innerWidth 390` |
| Mobile B | 390×844 / dark | pass | 衣橱、写实舞台和效果说明按任务顺序单列，无横向溢出 |
| Motion | B / reduced-motion | pass | 媒体查询为 true；自动换装直接到“黑色礼服 · 夜间造型”，无 `is-changing`，按钮保持“自动换装” |
| Runtime | errors / console / syntax | pass | 页面错误和控制台为空；JavaScript 语法与 Git 空白检查通过 |

### Revision 5 visual evidence

- Desktop A / 女性专项 M12：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196349708.png`
- Desktop B / M1：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196280881.png`
- Tablet light / 女性专项：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196433422.png`
- Mobile A / 女性专项：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196590887.png`
- Mobile B：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787196650034.png`

Revision 5 截图只保存在浏览器工具临时证据目录，不进入产品提交。

## Revision 6 · E001 MiniMax H3 真实视频回填

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Asset | MP4 provenance | pass | 项目文件 1,819,595 bytes；SHA-256 `54EC7D3F50483CC786C3A505FC2D310B6DE7EE20819FD3DC885DE2008505A952` 与用户源文件一致 |
| Media | ffprobe | pass | 15.083333s；1344×768；H.264；24fps；AAC 32kHz 双声道；音轨平均约 -9.3dB |
| Baseline | eight planned samples | pass | 七套造型、单一全身女性和固定摄影棚可见；身份与服装精确度记为 partial；实际横版记为 fail |
| Timing | six change windows | pass | scene-change 近似点为 1.958 / 3.833 / 6.000 / 8.125 / 10.458 / 12.375 秒；平均绝对偏差约 0.325 秒 |
| Rule regression | T2V / D / M13 | pass | 选项与输出为“舞蹈峰值原地换装”；包含单一主体执行规则；不再输出“侧边激活” |
| Desktop | 1440×1000 / dark / E001 | pass | 播放器与基线观察形成双栏；媒体事实、状态、直接链接和提示词入口可见 |
| Playback | native controls | pass | 无 autoplay；`controls=true`、`preload=metadata`、duration 15.083333；点击播放后时间推进并可暂停 |
| Keyboard | prompt details | pass | `summary` 获得焦点后按 Enter，`details.open=true` 且焦点保留 |
| Tablet | 1024×900 / light | pass | 视频与观察区改为纵向层级；`scrollWidth 1009 < innerWidth 1024` |
| Mobile | 390×844 / dark | pass | 播放器、操作链接和评估卡单列；`scrollWidth 375 < innerWidth 390` |
| Fallback | static media | pass | MP4 返回 200 `video/mp4`；poster 返回 200 `image/jpeg`；播放器内含文字回退和直接 MP4 链接 |
| Performance | no autoplay / metadata | pass | 独立未播放会话观察到 poster 32,617B、MP4 metadata 响应 300B；视频不作为首屏交互依赖 |
| Runtime | errors / console / syntax | pass | 浏览器错误和控制台为空；`node --check` 与 `git diff --check` 通过 |

### Revision 6 visual evidence

- Desktop dark / E001：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787197567514.png`
- Tablet light / E001：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787197758311.png`
- Mobile dark / E001：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787197793977.png`
- Keyframe contact sheet：`E:\0819_codex_project\.tmp\e001-frames\contact-sheet.png`
- First-transition contact sheet：`E:\0819_codex_project\.tmp\e001-transition-01\contact-sheet.png`

浏览器截图和关键帧接触表属于临时验证证据，不进入产品提交；可复现结论保存在 E001 实验档案中。

## Revision 7 · E002 Seedance 2.0 VIP 首帧 I2V 回填

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Asset | MP4 provenance | pass | 项目文件 11,550,887 bytes；SHA-256 `F011AB1FEAFC9D540FEF24EC7551538ADB47EBA1283AF8D1090BD7662985C261` 与用户源文件一致 |
| Media | ffprobe | pass | 15.104s；720×1280 标准 9:16；H.264；24fps；AAC 32kHz 双声道；平均音量约 -21.3dB |
| Initial state | first frame | pass with caveat | 中央学院风人物和六个侧边造型均可见；没有独立首帧文件，因此只验证视频开头可观察的布局继承 |
| M13 | side activation state | pass | 左上 → 右上 → 左中 → 右中 → 左下 → 右下依次激活、汇入、永久清空，最终无侧边复现 |
| Identity / looks | planned samples | pass with caveat | 中央人物脸型、长卷发和全身比例在采样帧中明显稳定；七套造型顺序完整，但未做生物特征测量 |
| Timing | six change windows | partial | 粗粒度完成点约 1.6 / 4.1 / 6.6 / 8.5 / 10.0 / 13.0 秒；平均绝对偏差约 0.25 秒，第五次约提前 0.8 秒 |
| Comparison | E001 / E002 | pass | 明确标注模型、T2V/I2V、画幅和提示词同时变化；仅比较整体方案，不进行单变量归因 |
| Desktop | 1440×1000 / dark / E002 | pass | 双基线标签、比较限制、竖版原生播放器与证据面板层级清晰；截图 `screenshot-1787198803200.png` |
| Interaction | tab / playback | pass | E001 播放后切到 E002，隐藏播放器自动暂停；tabpanel 同步，E002 metadata 报告 15.104 秒、720×1280 |
| Keyboard | baseline tabs | pass | E002 获得焦点后按 ArrowLeft，焦点移动到 E001 且对应 panel 切换 |
| Tablet | 1024×900 / light / E002 | pass | `scrollWidth 1009 < innerWidth 1024`；播放器 394.875×702，比较说明两行，竖版内容完整 |
| Mobile | 390×844 / dark / E002 | pass | `scrollWidth 375 < innerWidth 390`；标签单列，播放器 345×613.33，9:16 内容不裁切 |
| Reduced motion | 390×844 / dark | pass | `prefers-reduced-motion=true`；tab animation 为 none，E001/E002 仍可连续切换 |
| Fallback | static media | pass | 两条视频均无 autoplay、使用 metadata preload、封面和直接 MP4 链接；播放器内含文字回退 |
| Runtime | syntax / HTTP / Git | pass | 浏览器 errors / console 均为空；`node --check`、静态媒体 HTTP、`git diff --check` 和工作树终审通过 |

### Revision 7 visual evidence

- Desktop dark / E002：`C:\Users\yun68\.agent-browser\tmp\screenshots\screenshot-1787198803200.png`
- Tablet light / E002：`C:\Users\yun68\.agent-browser\tmp\screenshots\e002-r7-tablet-light.png`
- Mobile dark / E002：`C:\Users\yun68\.agent-browser\tmp\screenshots\e002-r7-mobile-dark.png`
- Planned-point contact sheet：`E:\0819_codex_project\.tmp\e002-frames\contact-sheet.png`
- Transition windows：`E:\0819_codex_project\.tmp\e002-transitions\contact-sheet.png`
- Dense timing windows：`E:\0819_codex_project\.tmp\e002-timing-focus\contact-sheet.png`

浏览器截图和关键帧接触表属于临时证据，不进入产品提交；可复现结论保存在 E002 实验档案中。

## Revision 8 · E002.1 首帧安全区候选

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Source diagnosis | E002 frame 0 | pass | 原始关键帧确认六个侧边人物贴近左右边界并被视频像素裁切；播放器 `contain` 不是根因 |
| Generated asset | visual inspection | pass | 中央人物保持主视觉；六个侧边人物按原顺序完整显示头、肩、手臂、衣摆和鞋子 |
| Standard input | file / hash | pass | 720×1280 PNG，1,364,552 bytes；SHA-256 `706537ADBCC57CDC87ED6646A05AD148B9D8C147D595C4F37EDE4D9254A5122C` |
| Desktop | 1440×1000 / dark | pass | 候选图 258×459 完整展示；状态、唯一变量、下载和实验说明可见；`scrollWidth 1425 < 1440` |
| Tablet | 1024×900 / light | pass | 图片 258×459、信息列 639px，无横向溢出；`scrollWidth 1009 < 1024` |
| Mobile | 390×844 / dark | pass | 卡片单列，图片 278×494，操作纵向排列；`scrollWidth 375 < 390` |
| Loading | fresh E001 session | pass | 候选图 `loading=lazy`；E002 panel 隐藏时 resource entries 中没有 E002.1 图片请求 |
| Fallback | static image | pass | 图片返回 200 `image/png`、`Content-Length 1364552`；提供带 `download` 的直接链接 |
| Runtime | browser / syntax / Git | pass | 浏览器 errors / console 为空；`node --check` 与 `git diff --check` 通过 |

### Revision 8 visual evidence

- Desktop dark：`C:\Users\yun68\.agent-browser\tmp\screenshots\e002-1-desktop-dark.png`
- Mobile dark：`C:\Users\yun68\.agent-browser\tmp\screenshots\e002-1-mobile-dark.png`

E002.1 视频尚未生成；本轮完成的是可下载首帧和单变量实验入口，不将候选图表述为视频效果已通过。

## Revision 9 · E003 Seedance 2.5 安全区首帧视频

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Asset | MP4 provenance | pass | 项目文件 8,517,726 bytes；SHA-256 `85B308F0F6371F768AA63685FB4F069AA9FEE230C584559AFB283FEB2A41C72E` 与用户源文件一致 |
| Media | ffprobe / audio | pass | 15.072s；560×750；H.264 24fps；AAC 32kHz 双声道；约 4.52Mbps；平均 -24.5dB、峰值 -1.5dB |
| Safe layout | initial / planned frames | pass for current output | 六个侧边人物完整显示头、肩、衣摆和鞋子；E002 的左右边界裁切得到改善 |
| Platform aspect | entire sequence | limit | 实际 560×750，接近 3:4；用户确认生成界面没有 9:16 选项，不视为设置错误 |
| Full-body framing | entire sequence | fail | 持续推近使中央人物从全身逐步变为腿脚、手臂越界，最终接近上半身 |
| Looks / state | eight planned frames | pass | 七套造型顺序完整；六个侧边库存按左上 → 右上 → 左中 → 右中 → 左下 → 右下清空且不复现 |
| M13 visual | dense first two windows | partial | 库存消耗与中央换装同步，但没有 E002 中明显的侧边光束或发光轮廓汇入 |
| Timing | six change windows | partial | 完成点约 2.1 / 4.1 / 6.0 / 8.0 / 9.75 / 12.0 秒；粗粒度 MAE 约 0.49 秒，后两次约提前 1 秒 |
| Causal boundary | E002 / E003 | pass | 明确模型和首帧同时变化；不把侧边改善或构图退化单独归因于安全区布局或 Seedance 2.5 |
| Desktop | 1440×1000 / dark / E003 | pass | 三标签、真实播放器、黄色综合状态、媒体事实与六项结论双栏清晰；`scrollWidth 1425 < 1440` |
| Tablet | 1024×900 / light / E003 | pass | 三标签各约 314px；视频 524×702；`scrollWidth 1009 < 1024` |
| Mobile | 390×844 / dark / E003 | pass | 标签单列；视频 345×462；最终帧裁切可见；`scrollWidth 375 < 390` |
| Keyboard / playback | ArrowLeft / native player | pass | E003 元数据 15.072、560×750；原生播放时间推进；ArrowLeft 切换 E002、焦点同步并暂停 E003 |
| Reduced motion | mobile / dark | pass | `prefers-reduced-motion=true`；tab animation 为 none，E001/E003 仍可切换 |
| Lazy media | fresh E001 session | pass | E003 隐藏时 `poster=null`、`source src=null`、相关请求为 0；首次选择后才挂载 poster/source 并读取元数据 |
| Fallback | static media | pass | MP4 返回 200 `video/mp4` 8,517,726B；poster 返回 200 `image/jpeg` 63,674B；文字回退和直接链接存在 |
| Runtime | browser / syntax / Git | pass | 浏览器 errors / console 为空；`node --check` 与 `git diff --check` 通过 |

### Revision 9 visual evidence

- Desktop dark / E003：`C:\Users\yun68\.agent-browser\tmp\screenshots\e003-desktop-dark.png`
- Mobile dark / E003 final crop：`C:\Users\yun68\.agent-browser\tmp\screenshots\e003-mobile-dark.png`
- Planned-point contact sheet：`E:\0819_codex_project\.tmp\e003-frames\contact-sheet.png`
- Transition windows：`E:\0819_codex_project\.tmp\e003-transitions\contact-sheet.png`
- Timing focus：`E:\0819_codex_project\.tmp\e003-timing-focus\contact-sheet.png`
- Activation focus：`E:\0819_codex_project\.tmp\e003-activation\contact-sheet.png`

浏览器截图和关键帧接触表属于临时证据，不进入产品提交；可复现结论保存在 E003 实验档案中。

## Revision 10 · TEST C 真实 2D VTON 输入与接口准备

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Model selection | official docs / local GPU | pass | CatVTON 官方记录 `bf16` 1024×768 约需 8GB；本机 RTX 4070 Laptop 为 8188 MiB；IDM-VTON 保留对照；两者均记录 CC BY-NC-SA 4.0 |
| Empty state | no files / offline | pass | “开始真实试衣”禁用；结果区明确写明不会先放假结果 |
| Input pair | local PNG fixtures | pass | 两个文件可选择、预览、显示尺寸/大小；人物 720×1280 触发比例/尺寸建议，服装 1774×887 通过尺寸检查 |
| Privacy | before request | pass | Object URL 本地预览；界面显示“尚未发送”；源代码只在显式 submit 中创建 FormData |
| Service gate | files ready / service unchecked | pass | 双输入存在后推理仍保持禁用；模拟 `/health` 返回 `status=ok` 后才解锁 |
| Adapter contract | mocked localhost response | pass | `/health` JSON 与 `/api/v1/try-on` `image/png` 响应路径完成；结果图片和下载入口可见。这里只验证接口，不记为 E004 模型结果 |
| Host guard | external URL | pass | `https://example.com` 被拒绝，界面显示“仅允许本机地址” |
| Keyboard / semantics | experiment tabs | pass | TEST A 聚焦后连续 ArrowRight 到 TEST C，最终 `activeElement=experiment-c-tab`；无重复 ID、无失效 `aria-controls` |
| Desktop | 1440×1000 / dark | pass | 三列输入、预览和推理层级清楚；`scrollWidth - clientWidth = 0` |
| Tablet | 1024×900 / light | pass | 输入/预览双列、运行面板整行；主题稳定后无溢出，差值 0 |
| Mobile | 390×844 / dark | pass | 三个实验标签和三个工作面板单列；预览、控件和输出均可达；无横向溢出，差值 0 |
| Runtime | console / page / syntax | pass | 两次浏览器全流程 `errors=[]`；`node --check` 通过 |
| Capability boundary | real model absent | pass | 页面、README 与 M3 记录均声明模型权重尚未安装；当前结果只来自接口桩，不声称完成真实 VTON |

### Revision 10 visual evidence

- Desktop dark：`E:\0819_codex_project\.tmp\vton-evidence\desktop-dark.png`
- Tablet light：`E:\0819_codex_project\.tmp\vton-evidence\tablet-light.png`
- Mobile dark：`E:\0819_codex_project\.tmp\vton-evidence\mobile-dark.png`

截图与接口桩脚本位于 `.tmp`，仅作为本地验证证据，不进入产品提交。实际模型部署后的首张输出另建 E004，不能复用本轮接口桩的通过结论。

## Revision 11 · TEST C 演示模式

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Status copy | default / TEST C / roadmap | pass | 顶栏为“目标二输入演示”；TEST C 标明“模型按需接入”；路线标明“输入演示已就绪” |
| Empty state | model not installed | pass | 服务状态为“模型未安装”；结果区为“输入演示已就绪”；推理按钮禁用 |
| Local input demo | two fixture files | pass | 人物图和服装图均可预览与检查；上传后推理按钮仍禁用，结果保持空态 |
| Network boundary | no health/run click | pass | 完整输入演示期间对 `127.0.0.1:8000` 的请求计数为 0 |
| Keyboard | A → B → C | pass | 连续 ArrowRight 后焦点为 `experiment-c-tab`，对应 panel 可见 |
| Desktop | 1440×1000 / dark | pass | 演示、未安装和按需文案可见；三列无溢出，差值 0 |
| Tablet | 1024×900 / light | pass | 状态文案无截断；无横向溢出，差值 0 |
| Mobile | 390×844 / dark | pass | 上传、预览、模型状态和空结果单列可读；无横向溢出，差值 0 |
| Runtime | browser / syntax / diff | pass | 浏览器 `errors=[]`；JavaScript 语法与 Git 空白检查通过 |

### Revision 11 visual evidence

- Desktop dark：`E:\0819_codex_project\.tmp\vton-demo-evidence\desktop-dark.png`
- Mobile dark：`E:\0819_codex_project\.tmp\vton-demo-evidence\mobile-dark.png`

模型下载不是本轮 `defer` 或 `blocked`：用户已经把它明确移出当前演示范围。未来提出真实试衣需求时，再新建部署与 E004 验收契约。

## Terminal audit

- continue：无
- defer：无
- blocked：无

Revision 11 演示范围均为 `pass`。CatVTON 安装、权重下载与 E004 已移出当前范围，后续按需重新启动；公开 GitHub Pages 发布仍属于后续远端操作。

## Revision 12 · TEST C 内置默认演示

| Surface | State | Result | Evidence |
| --- | --- | --- | --- |
| Assets | local static files | pass | 人物 1024×1536 / 1,842,809B；服装 1254×1254 / 1,861,585B；结果 1024×1536 / 1,910,035B；三张素材人工检查通过 |
| Default demo | fresh TEST C | pass | 人物、服装、结果默认可见；结果持续显示 `PRE-GENERATED DEMO · 非模型推理`；推理按钮禁用 |
| Honest boundary | default result | pass | 结果说明明确“预生成”且“不代表 CatVTON 输出”；模型状态仍为“模型未安装” |
| Custom input | upload one image | pass | 结果图和演示标签立即隐藏；结果区显示“等待真实试衣结果”；适配器请求数仍为 0 |
| Restore | keyboard Enter | pass | 恢复内置人物、服装与结果，文件控件清空；恢复前后适配器请求数为 0 |
| Future adapter | mocked localhost | pass | 两张自定义输入加载完成且 `/health` 在线后按钮解锁；`image/png` 返回后隐藏演示标签并显示下载入口；总请求 2 |
| Keyboard | A → B → C / reset | pass | 方向键进入 C 后焦点为 `experiment-c-tab`；恢复按钮支持键盘 Enter |
| Desktop | 1440×1000 / dark | pass | 三图输入到结果关系完整可读；横向溢出 0 |
| Tablet | 1024×900 / light | pass | 默认演示与模型边界保持可读；横向溢出 0 |
| Mobile | 390×844 / dark | pass | 三列顺序降为单列，三张图片完整显示；横向溢出 0 |
| Runtime | browser / syntax / diff | pass | 浏览器 `errors=[]`；`node --check` 与 `git diff --check` 通过 |

### Revision 12 visual evidence

- Desktop dark：`E:\0819_codex_project\.tmp\vton-default-evidence\desktop-dark.png`
- Tablet light：`E:\0819_codex_project\.tmp\vton-default-evidence\tablet-light.png`
- Mobile dark：`E:\0819_codex_project\.tmp\vton-default-evidence\mobile-dark.png`

截图与接口桩脚本位于 `.tmp`，不进入产品提交。默认结果只用于解释页面流程；未来真实模型输出必须另建 E004，并记录模型、权重、参数、输入、耗时和显存。

## Terminal audit · Revision 12

- continue：无
- defer：无
- blocked：无

Revision 12 当前范围均为 `pass`。CatVTON 下载与真实 E004 仍按用户决定留待后续，不是本轮阻塞。
