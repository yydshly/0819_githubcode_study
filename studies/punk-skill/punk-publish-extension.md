# `$punk-publish` 研究扩展

## 它解决什么

上游 `$punk-cover` 的终点是 Prompt 和可能存在的一张图片；现实内容任务的终点通常是可审核的发布草稿。`$punk-publish` 增加一个内容编排层，把图片纳入“文案 + 视觉 + 无障碍 + 追溯”的完整包。

```text
来源内容
  → $punk-publish：标题、正文、摘要、CTA、标签、Alt
  → $punk-cover：单一风格的视觉 Prompt
  → 图像 Provider：无字 artwork.png
  → 确定性排版：cover.png
  → 打包脚本：copy/ + visual/ + manifest.json
```

## 如何真实调用

仓库内 Skill 位于 [`extensions/punk-publish/`](extensions/punk-publish/)。在已能发现该 Skill 和上游 `$punk-cover` 的 Agent 会话中发送：

```text
Use $punk-publish to turn this source into a complete Xiaohongshu publication package.
Use $punk-cover for the visual subtask in 复古手撕拼贴 style (retro-torn-collage), aspect ratio 3:4.
Create editable title, post body, summary, CTA, hashtags and alt text.
Generate a no-text artwork, then define deterministic cover typography and save the complete prompt first.
Include manifest.json with truthful asset status. Do not log in, schedule, or publish to any account.

Source content:
这里粘贴文章、产品说明或笔记草稿。
```

Agent 应先准备文案和视觉任务，再调用图像 Provider。若 Provider 不可用，仍交付文案、视觉 brief 和 manifest，并把视觉资产标为缺失，不能伪造 `cover.png`。

上游仓库本身不包含 `$punk-publish`。在本研究工作区中，应先让 Agent 加载 `studies/punk-skill/extensions/punk-publish/`；部署到其他环境时复制完整 Skill 目录，并保留 `SKILL.md`、`agents/`、`scripts/` 与 `references/`。详细检查见 [`installation.md`](extensions/punk-publish/references/installation.md)。

## 确定性打包

脚本只写文案和元数据，不下载或伪造图片：

```powershell
python studies/punk-skill/extensions/punk-publish/scripts/package_publication.py `
  --input publication.json `
  --output punk-assets/punk-publish
```

输入定义见 [`package-schema.md`](extensions/punk-publish/references/package-schema.md)，平台写作目标见 [`platforms.md`](extensions/punk-publish/references/platforms.md)。

## 浏览器 ZIP 路径

能力实验室还提供不依赖后端的真实导出：

```text
当前编辑状态
→ Canvas 合成 900×1200 cover.png
→ 读取当前研究底图字节
→ 生成 6 个文案文件、调用 brief 与 cover-copy.json
→ Web Crypto 计算 SHA-256
→ 零依赖 ZIP writer 生成 <slug>-punk-publish.zip
```

浏览器导出 manifest 使用 `punk-publish/2`，明确记录 `browser-static-demo` 和 `research-pre-generated-demo-asset`。真实生产运行必须替换为 Provider 产物及完整编译 Prompt。

## 研究意义

这一扩展把研究问题从“能否生成符合风格的图”推进到“能否形成可追溯、可编辑、跨工具交接的内容生产单元”。可进一步比较：

- 图片单产物与完整发布包对人工补全时间的影响；
- 模型内生文字与确定性文字层的 OCR 正确率；
- manifest 是否提高多模型复现和故障定位效率；
- 人工确认门对错误发布、幻觉资产和品牌偏差的抑制效果。

当前实现仍是研究原型：没有平台账户连接或自动发布；浏览器 Canvas 已能导出真实 PNG，但尚未实现品牌字体嵌入、跨平台多尺寸批量导出、印刷级色彩管理或端到端模型评测。正式评测方案见 [`evaluation-protocol.md`](evaluation-protocol.md)，目前只有协议，没有主实验结果。
