# 子项目交接

## 1. 项目与阶段

`Xianxia Visual Director` 是研究主库的第三个子项目，当前处于“展示型研究完成”阶段。它说明上游如何为仙侠场景生成结构化图片提示词，不进行图像模型或训练算法复现。

## 2. 已完成

- 获取并固定上游提交 `bd886174f4d84659f2381c4f5baa610003c5bdda`。
- 上游源码保存在 `.gitignore` 排除的 `vendor-projects/xianxia-visual-director/`。
- 新增研究记录并登记到根目录索引。
- 新增三类仙侠场景交互展示页。
- 使用外部图像工具创建三张独立研究示意图，并记录完整生成提示词。
- 扩展 GitHub Pages 组装路径。
- 完成桌面、平板、手机、键盘、复制、图片、溢出、错误和 reduced-motion 验收。

## 3. 剩余或延期

约定范围内没有剩余项，也没有延期项。以下内容被用户明确排除在当前深入研究之外：模型训练、底层图像算法、复杂 A/B 评测和实时 Provider 接入。

## 4. 证据

- 浏览器验收：[`validation.md`](validation.md)
- 设计与覆盖：[`design-contract.md`](design-contract.md)
- 图片生成来源：[`image-generation.md`](image-generation.md)
- 完整研究记录：[`../../../studies/xianxia-visual-director/README.md`](../../../studies/xianxia-visual-director/README.md)

## 5. 下一次会话

如果不扩大研究范围，无需继续开发。若要对外发布，下一步只需审阅版本控制差异、提交并推送，让现有 GitHub Pages 工作流部署 `/xianxia-visual-director/`。
