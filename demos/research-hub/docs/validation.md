# 浏览器验收

## 本地组装

按 GitHub Pages 工作流将总入口、三个演示和对应研究记录组装到临时站点，并在 `http://127.0.0.1:4197/` 启动静态服务器。验收使用工作区内置 Playwright + Chromium Headless；预期的 `agent-browser` CLI 在当前环境没有可执行入口，因此使用真实 Chromium 完成同等检查。

截图保存在根目录已忽略的 `.tmp/research-hub-browser-evidence/`，不作为产品文件提交。

## 路由结果

| 路径 | HTTP | 标题 | 主体内容 | 控制台 / 页面错误 |
| --- | --- | --- | --- | --- |
| `/` | 200 | `0819 GitHub Code Study｜研究总入口` | pass | 0 / 0 |
| `/outfit-director/` | 200 | `Outfit Director｜能力实验室` | pass | 0 / 0 |
| `/punk-skill/` | 200 | `Punk Skill｜能力实验室` | pass | 0 / 0 |
| `/xianxia-visual-director/` | 200 | `Xianxia Visual Director · 场景研究` | pass | 0 / 0 |

总入口三张卡片均通过真实点击到达预期路径。总入口三张图片全部加载成功。

Outfit 页面中的一张长图采用懒加载，未滚动到对应位置时自动检查显示 `naturalWidth=0`；文件、复制后的部署路径和 HTTP 访问均已单独确认存在。Punk 页面引用的上游 `raw.githubusercontent.com` 图集在当前受限网络中不可达，这是既有外部资源边界，不影响总入口、本地内容和子项目路由。

## 响应式与可访问性

| 视口 | 项目卡片 | 横向溢出 | 焦点轮廓 | Reduced motion | 控制台错误 |
| --- | --- | --- | --- | --- | --- |
| 1440 × 1000 | 3 | 无 | `3px solid` | 常规过渡 | 0 |
| 900 × 900 | 3 | 无 | `3px solid` | 常规过渡 | 0 |
| 390 × 844 | 3 | 无 | `3px solid` | `0s` | 0 |

桌面、平板和手机截图经人工观察：标题、项目元数据、卡片按钮、研究方法和页脚均保持可读；390px 下卡片转为单列，无内容裁切。

## 结论

总入口与本地 Pages 组装在约定范围内通过浏览器验收。远端部署结果在本次提交推送后由 GitHub Actions 和在线 HTTP 复核。
