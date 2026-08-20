# 浏览器验收

## 本地组装

既有三个演示按 GitHub Pages 工作流在 `http://127.0.0.1:4197/` 完成验收；新增 Snakey Locomotion 使用更新后的组装结构在 `http://127.0.0.1:4199/` 复核总入口卡片、响应式布局和 WebGL 子路径。归档发布候选又在 `http://127.0.0.1:4200/` 按完整工作流结构组装复验。验收均使用工作区内置 Playwright + Chromium Headless。

截图保存在根目录已忽略的 `.tmp/research-hub-browser-evidence/`，不作为产品文件提交。

## 路由结果

| 路径 | HTTP | 标题 | 主体内容 | 控制台 / 页面错误 |
| --- | --- | --- | --- | --- |
| `/` | 200 | `0819 GitHub Code Study｜研究总入口` | pass | 0 / 0 |
| `/outfit-director/` | 200 | `Outfit Director｜能力实验室` | pass | 0 / 0 |
| `/punk-skill/` | 200 | `Punk Skill｜能力实验室` | pass | 0 / 0 |
| `/xianxia-visual-director/` | 200 | `Xianxia Visual Director · 场景研究` | pass | 0 / 0 |
| `/snakey-locomotion/` | 200 | `Snakey Locomotion｜Three.js 程序化场景研究台` | pass | 0 / 0 |

既有三张卡片继续使用原路径；新增 Snakey 卡片的本地 SVG 预览加载成功，并通过真实点击到达 `/snakey-locomotion/`。构建后的 CSS、JS 和 WebGL Canvas 均成功加载。

Outfit 页面中的一张长图采用懒加载，未滚动到对应位置时自动检查显示 `naturalWidth=0`；文件、复制后的部署路径和 HTTP 访问均已单独确认存在。Punk 页面引用的上游 `raw.githubusercontent.com` 图集在当前受限网络中不可达，这是既有外部资源边界，不影响总入口、本地内容和子项目路由。

## 响应式与可访问性

| 视口 | 项目卡片 | 横向溢出 | 焦点轮廓 | Reduced motion | 控制台错误 |
| --- | --- | --- | --- | --- | --- |
| 1440 × 1000 | 4 | 无 | `3px solid` | 常规过渡 | 0 |
| 900 × 900 | 4 | 无 | `3px solid` | 常规过渡 | 0 |
| 390 × 844 | 4 | 无 | `3px solid` | `0s` | 0 |

加入第四张卡片后，900px 与 390px 重新检查为 4 张卡片、无横向溢出；Snakey 卡片标题、摘要、三条研究重点和主链接均可读。新增入口截图保存在 `.tmp/snakey-browser-evidence/hub-tablet.png` 与 `hub-mobile.png`。

归档发布候选确认 Snakey 卡片显示“已归档 / 按需复用”，归档文档返回 HTTP 200；真实点击进入构建后的 WebGL 演示，Canvas 正常创建，并成功从“地面蜿蜒”切换到“交互场”。桌面与 390px 截图分别保存为 `release-archive-desktop.png` 和 `release-archive-mobile.png`，页面错误和控制台错误为 0。

桌面、平板和手机截图经人工观察：标题、项目元数据、卡片按钮、研究方法和页脚均保持可读；390px 下卡片转为单列，无内容裁切。

## 结论

总入口、四项目和 Snakey 归档状态已通过本地与远端验收。实现与归档提交 `f027a41c347051028347c1434175fd9a98e614af` 已推送 `main`，GitHub Actions 运行 [`32358286573`](https://github.com/yydshly/0819_githubcode_study/actions/runs/32358286573) 成功。生产环境真实浏览器确认四张卡片、Snakey 归档状态、WebGL Canvas、“交互场”切换、390px 无溢出和归档文档 HTTP 200；控制台与页面错误为 0。

## Revision 3：SRT Whiteboard Animation Pages 接入

| 检查 | 生产结果 |
| --- | --- |
| GitHub Actions | [运行 32383473996](https://github.com/yydshly/0819_githubcode_study/actions/runs/32383473996) 成功 |
| 总入口 | 6 张项目卡片，计数 `06`，SRT 卡片与 1080px 时间线图加载成功 |
| SRT 路径 | `https://yydshly.github.io/0819_githubcode_study/srt-whiteboard-animation/`，标题和 4 个案例正确 |
| 视频 | 默认视频元数据 8.6 秒、无媒体错误；牛顿第三定律 MP4 Range 返回 206 与 `bytes 0-99/1142911` |
| 返回与研究链接 | 返回入口为 `../`；研究记录为 `../studies/srt-whiteboard-animation/README.md` |
| 桌面 1440px | 总入口与 SRT 页面横向溢出均为 0，SRT 主链接焦点轮廓为 `solid` |
| 手机 390px | 总入口 6 张卡片单列，SRT 页面 4 个案例可达，横向溢出均为 0 |
| 错误面 | `consoleErrors`、`pageErrors`、`requestFailures` 均为空 |

本地发布候选使用与工作流一致的目录结构组装，并通过支持 Range 的静态服务器复验；生产环境随后使用 bundled Chromium 重复相同主旅程，观察结果一致。Revision 3 判定为 `pass`。

## Revision 4：Blobatar Pages 接入

2026-08-21 在 `http://127.0.0.1:4208/` 按 Pages 目录结构组装 Blobatar 发布候选，并使用 Playwright Chromium 完成真实导航与交互验收。

| 检查 | 本地发布候选结果 |
| --- | --- |
| 总入口 | 8 张项目卡片，计数 `08`，Blobatar 预览 SVG 加载成功 |
| Blobatar 路径 | `/blobatar/`，标题、主头像 SVG、14 种表情和身份模型正确 |
| 社区场景 | 6 个稳定默认身份可见 |
| 多 Agent 场景 | 4 个角色；执行阶段为 2 已完成、1 执行中、1 待命 |
| 研究关联 | 页脚链接指向 GitHub 可渲染研究 README；Pages 研究副本 HTTP 200 且内容完整 |
| 桌面 / 手机 | 1440px 与 390px 横向溢出均为 0；手机主头像宽 292px |
| 键盘 / 动效 | Blobatar 门户链接焦点为 `solid`；reduced-motion 生效 |
| 错误面 | error overlay、console error、page error 均为空 |

Revision 4 本地发布候选判定为 `pass`；最终生产 URL 与 Actions 状态在发布后复验。
