# 贡献与维护约定

## 新增研究项目

1. 在 `studies/<project-slug>/README.md` 中复制并填写 `docs/research-template.md`。
2. 在根目录 `README.md` 的项目索引中新增一行，并保持项目名称与链接稳定。
3. 如果建立了独立研究仓库或演示站点，补充对应链接；尚未建立时使用 `—`，不要放占位网址。
4. 提交前确认原项目地址、许可证、研究版本或提交号准确无误。

`project-slug` 使用小写英文、数字和连字符，例如 `react-source-study`。

## 内容边界

- 本仓库优先保存索引、笔记、图示、复现说明和阶段结论。
- 完整源码、可独立运行的改造版或需要单独部署的内容，优先放在独立仓库中。
- 不直接复制许可证不明确的第三方代码。
- 引用外部资料时标注来源；结论与推测应明确区分。
- 不提交密钥、令牌、个人配置、构建产物或大型依赖目录。

## 提交建议

提交信息尽量说明意图，例如：

- `docs: add project-name study entry`
- `docs: update project-name findings`
- `chore: refresh project index links`

每次变更同时检查总索引和对应研究记录，避免二者状态不一致。
