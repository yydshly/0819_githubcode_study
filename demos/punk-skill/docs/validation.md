# Punk Skill 能力实验室 · 验收记录

## 规范运行环境

| 字段 | 内容 |
| --- | --- |
| 启动命令 | `python -m http.server 4174 --directory demos/punk-skill` |
| 规范地址 | `http://127.0.0.1:4174/` |
| 验收日期 | 2026-08-20 |
| 浏览器 | Playwright Chromium headless |
| 自动化脚本 | `.tmp/punk-publish-v5-check.cjs`、`.tmp/punk-publish-v5-surfaces.cjs`，不提交 |
| 截图目录 | `.tmp/punk-skill-evidence-v2/` 至 `v5/`，不提交 |

## 上游校验

固定提交：`d62d99863ad860895425ef44bd81b5e680576b0d`

```text
punk-cover validation passed for 24 cover/poster styles.
punk-avatar validation passed for 5 avatar styles.
```

## 浏览器检查结果

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 页面加载 | PASS | 标题为 `Punk Skill｜能力实验室`，正文长度大于 1000 字符 |
| 真实使用入口 | PASS | Hero 主按钮指向 `#real-use`；第一正文标题为“现实中怎么用：生成一套发布草稿” |
| 现实角色边界 | PASS | 用户、`$punk-publish`、`$punk-cover`、图像 Provider、发布包共 5 个角色；网页明确不执行真实 Agent 或自动发布 |
| 默认发布包 | PASS | 3 个输出选项，默认 `package`；指令含 `$punk-publish`、小红书、`3:4`、`retro-torn-collage` 与 `draft-not-published` 清单 |
| 发布文案 | PASS | 标题、正文、摘要、CTA、标签和 Alt 均有内容；正文长度 152，Alt 长度 79 |
| 来源推导 | PASS | 改写来源后标题、正文和封面同步更新；这是页面明确标注的规则化研究演示 |
| 可靠文字层 | PASS | 编辑标题后工作台封面、平台封面和平台标题三处一致；无字底图切换后文字层 opacity 为 0 |
| 发布复制 | PASS | 正文 + 标签、Alt、调用指令和 manifest 均可复制；剪贴板内容与页面一致 |
| truthful manifest | PASS | 编辑态使用 `punk-publish/2-preview`；下载后替换为 `punk-publish/2`，记录真实 artwork、cover、字节数与哈希 |
| 封面调用构造 | PASS | 保留 24 个封面风格；切换到视觉素材模式后仍可单独调用 `$punk-cover` |
| 渠道适配 | PASS | 切换小红书后指令更新为 `3:4`，可选择 `retro-torn-collage` 并更新 slug 路径 |
| 头像调用构造 | PASS | 5 个头像风格；照片模式含 `$punk-avatar`、attached photo、`1:1` 与头像产物路径 |
| 仅 Prompt 状态 | PASS | 保留原生 `image` 与 `prompt` 模式；Prompt-only 明确跳过图像生成 |
| 安装与调用复制 | PASS | 上游安装、扩展发现与调用指令均可复制，剪贴板内容与页面一致 |
| 错误覆盖层 | PASS | 0 |
| 控制台与 page errors | PASS | 空数组 |
| 原理说明 | PASS | 页面包含任务结构、META、STYLE、融合编译和 Provider 边界 |
| 场景地图 | PASS | 内容发布、商业沟通、科研教育、人物 / 宠物与文化 IP 共 4 类 |
| 场景入口 | PASS | 8 个 tab；每个都有使用目标、适配理由、适配动作和交付物 |
| 上游样例 | PASS | 29 个卡片、29 个描述、29 个风格信息区；29 张图全部加载，无 failed request |
| 图库筛选 | PASS | 全部 29、封面 24、头像 5；搜索“科研”显示 `1 / 29`，清空恢复 29 |
| 扩展模块 | PASS | 4 个 checkbox |
| 场景切换 | PASS | 8 个场景均同步更新 goal、fit、deliverable、ratio、图片和 3 个推荐风格 |
| 风格重编译 | PASS | 城市展览可从 `avant-retro-architecture-poster` 切换到 `color-neo-constructivist-megastructure-poster` |
| Prompt 复制 | PASS | 显示“已复制到剪贴板”，剪贴板包含选定 style id |
| 扩展 manifest | PASS | 关闭 provider 后计数 `3 / 4`，manifest 删除 provider |
| 键盘 | PASS | 焦点从 `scenario-wechat-tab` Tab 到 `scenario-xiaohongshu-tab` |
| 桌面暗色 | PASS | 1440×1000，0px 横向溢出 |
| 平板亮色 | PASS | 1024×900，0px 横向溢出，完整图库保持 3 列 |
| 手机暗色 | PASS | 390×844，0px 横向溢出，tabs、适配说明、compiler 与第 29 个样例可见 |
| 发布包手机暗色 | PASS | 390×844，0px 横向溢出；文案、封面、文件清单和平台预览单列完整可见 |
| reduced-motion | PASS | 图片 transition duration 为 `1e-05s` |

## `$punk-publish` Skill 与打包脚本

```text
Skill is valid!
{"status": "ok", "package": ".../.tmp/punk-publish-output/ai-agent-rnd"}
```

fixture 产物包含 6 个文案文件、`visual/cover-copy.json` 和 `manifest.json`。fixture 提供的三个视觉路径均不存在，manifest 如实将其列入 `missing_optional_assets`，`existing_optional_assets` 为空。

## Revision 5：安装、场景、QA 与真实导出

扩展前浏览器基线：1 条安装指令、0 个扩展发现按钮、0 个导出按钮、0 个发布场景预设、0 个质量检查项。

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 双依赖发现 | PASS | 2 条独立指令；扩展剪贴板包含 `studies/punk-skill/extensions/punk-publish/` 与 `$punk-cover` 依赖提醒 |
| 完整预设 | PASS | AI Agent、产品发布、研究解读、活动宣传、课程知识共 5 套；各自更新 source、slug、style、图片和完整文案 |
| 预设 QA | PASS | 5 套预设均为 `6 / 6 PASS` |
| QA 失败状态 | PASS | 33 字标题显示 `5 / 6 PASS` 和 `is-warn`，不会伪装为通过；Alt 同步新标题 |
| 实际下载 | PASS | Playwright 捕获 `ai-agent-rnd-punk-publish.zip`，保存大小 2,411,088 bytes |
| ZIP 内容 | PASS | 11 个文件；6 个文案、调用 brief、research artwork、PNG、cover-copy 和 manifest |
| PNG | PASS | 签名 `89504e470d0a1a0a`，尺寸 900×1200，视觉检查确认中文标题和摘要存在 |
| ZIP 结构 | PASS | Python `ZipFile.testzip()` 返回 null，无损坏条目 |
| 哈希 | PASS | manifest 中 10 个非自身文件的 SHA-256 全部与 ZIP 实际字节一致 |
| 导出状态 | PASS | idle → working → success；成功反馈“已导出 11 个真实文件” |
| 能力回退 | PASS | 移除导出模块后显示明确 error，按钮保持可用，发布包内容仍可阅读 |
| 桌面暗色 | PASS | 1440×1000，0px overflow，安装、五预设、QA 与导出操作可见 |
| 平板亮色 | PASS | 1024×900，0px overflow；工作台 2 列、交付区 2 列 |
| 手机暗色 | PASS | 390×844，0px overflow；预设与交付区均单列 |
| 键盘 | PASS | 焦点从上游复制按钮进入扩展复制按钮 |
| reduced-motion | PASS | transition duration 为 `1e-05s` |
| 运行错误 | PASS | 两轮控制台和 page errors 均为空；failed requests 为空 |

## Pages 组装验收

按 GitHub Actions 相同目录结构组装 `.tmp/pages-site-v1/` 并由 `http://127.0.0.1:4176/` 提供：

| 路径 | 结果 |
| --- | --- |
| `/` | `Outfit Director｜能力实验室`，保留原根入口，0px overflow |
| `/punk-skill/` | `Punk Skill｜能力实验室`，5 个预设、导出按钮和 11 文件 ZIP 正常，0px overflow |
| `/studies/outfit-director/README.md` | HTTP 200 |
| `/studies/punk-skill/README.md` | HTTP 200 |

组装后的两类研究链接均已重写为 Pages 子路径内地址。浏览器 errors 和非主动中止的 failed requests 均为空。

## 最终截图

- `.tmp/punk-skill-evidence-v2/desktop-dark.png`
- `.tmp/punk-skill-evidence-v2/upstream-all-29.png`
- `.tmp/punk-skill-evidence-v2/tablet-light.png`
- `.tmp/punk-skill-evidence-v2/mobile-dark.png`
- `.tmp/punk-skill-evidence-v3/real-use-desktop-dark.png`
- `.tmp/punk-skill-evidence-v3/real-use-tablet-light.png`
- `.tmp/punk-skill-evidence-v3/real-use-mobile-dark.png`
- `.tmp/punk-skill-evidence-v4/publish-package-desktop-dark.png`
- `.tmp/punk-skill-evidence-v4/publish-package-mobile-dark.png`
- `.tmp/punk-skill-evidence-v5/publish-export-desktop-dark.png`
- `.tmp/punk-skill-evidence-v5/publish-export-tablet-light.png`
- `.tmp/punk-skill-evidence-v5/publish-export-mobile-dark.png`
- `.tmp/punk-skill-evidence-v5/unpacked/ai-agent-rnd/visual/cover.png`

截图留在忽略目录，仅作为本地验收证据，不累计进入研究仓库。

## 能力边界复核

- 页面没有后端、登录、密钥或真实图像推理请求。
- 八个场景的内容理解字段均标注为研究预设。
- 九张本地样例均标注为研究预生成资产或扩展样例。
- 上游样例只远程引用，不复制到本仓库。
- 图片标题由 HTML 层渲染，页面明确标注这是研究扩展。
- `$punk-publish` 只准备草稿；没有平台认证、发布、定时或账号写入。
