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

总入口、四项目和 Snakey 归档状态已通过本地 Pages 发布候选验收。用户已授权提交并推送 `main`；远端部署结果在本次发布阶段由 GitHub Actions 和在线 HTTP 继续复核。
