# 上游来源与许可边界

## 上游

- 仓库：[adrianpunk/Punk-Skill](https://github.com/adrianpunk/Punk-Skill)
- 研究提交：`d62d99863ad860895425ef44bd81b5e680576b0d`
- 提示词设计与风格方向：上游 README 标注为 AdrianPunk
- 仓库维护：上游 README 标注为 jinchenma94

## 许可状态

研究时 GitHub 仓库没有 `LICENSE` 文件，仓库元数据也未声明许可证。上游已有 [Issue #6](https://github.com/adrianpunk/Punk-Skill/issues/6) 询问是否添加许可证。

因此本研究采用以下边界：

- 完整上游检出只保存在根目录已忽略的 `vendor-projects/Punk-Skill/`。
- 不把上游 SKILL、STYLE、META 或样例图片复制到本仓库受版本控制目录。
- 演示中的“上游自带样例”使用 GitHub 远程 URL，并链接回上游原文件。
- 本项目的场景数据、Prompt 摘要、页面代码和扩展规则为独立研究实现。
- 本地 WebP 场景图由本研究使用 OpenAI 内置图像工具创建，不是上游资产。

如果上游后续添加许可证，应重新检查许可条款、署名要求和衍生发布边界。
