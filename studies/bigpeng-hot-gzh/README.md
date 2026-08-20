# BigPeng Hot GZH：公众号选题与标题 Skill

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 原项目 | [BigPengSays/bigpeng-hot-gzh](https://github.com/BigPengSays/bigpeng-hot-gzh) |
| 原作者 | BigPengSays |
| 许可证 | MIT |
| 研究版本 | `8967879bbd59bfacfeb2d66214f095dc92b6f6bc` |
| 本地检出 | `vendor-projects/bigpeng-hot-gzh/`（被根 `.gitignore` 排除） |
| 交互演示 | [`demos/bigpeng-hot-gzh/`](../../demos/bigpeng-hot-gzh/README.md) |
| 当前状态 | 已复现能力形状 |
| 最后更新 | 2026-08-20 |

## 核心研究结论

1. **作用**：帮助用户把模糊想法沉淀为可以进入写作与发布流程的明确选题和候选标题。“可发布主题”不等于已生成正文，而是读者、对象、结果和兑现物已经足够明确的写作任务。
2. **原理**：这是规则驱动的 Skill。规则负责任务路由、选题模板、标题公式、禁用项、兑现要求和首选条件；它不包含热度预测模型。
3. **人机分工**：用户提供模糊想法，宿主大模型理解并明确想法，Skill 基于已明确的身份、对象、数字、结果和证据按规则生成、检查和推荐候选，最终由用户确认并沉淀。

```text
用户的模糊想法
  → 宿主大模型明确意图与关键槽位
  → Skill 按规则路由、生成、质检与推荐
  → 用户做最终选择
  → 明确选题 + 候选标题 + 正文兑现要求
```

## 它实际解决什么

这是一个面向支持 `SKILL.md` 的 Agent 的规则型能力包，不是独立应用。它接收文章描述、草稿、明确主题或关键词，将用户的模糊想法逐步收敛为可进入写作与发布流程的选题与标题：

- 路径 A：已有明确选题，默认生成 6 条不同公式的候选标题。
- 路径 B：只有关键词或没定题，默认生成 4 个不同模板的方向，每个方向配 3 条标题。

它只写选题和标题，不写正文，不生成配图，不发布公众号内容。

## 规则驱动原理

```text
用户输入模糊想法或明确草稿
  → 宿主 LLM 理解意图，抽取对象、身份、数字、结果、冲突、代价和附赠物
  → Skill 路由（A 只出标题 / B 先选题后标题）
  → Skill 使用 7 种标题公式 / 8 种选题模板约束生成
  → Skill 执行多样性、长度、真实性和兑现检查
  → 用户从 Markdown 候选与首选中做最终确认
```

这是“语料归纳 + 显式槽位 + 大模型生成 + 自检”，不是微调、训练或热度预测算法。上游声称从 100 多篇文章蒸馏出规则，但当前入库的 `title-corpus.md` 只呈现了约 45 条标题，且没有阅读量标签、负样本和对照实验。

## 本次复现方法

上游没有可单独启动的程序；其真实执行需要 Codex、Claude Code 或 Cursor 等宿主模型。本研究因此将演示拆成两层：

1. **确定性规则演示**：在浏览器中显式填写对象、身份、数字和结果，可重复地展示路由、公式、选题模板和 QA 结果。
2. **真实 Agent 调用入口**：页面根据当前输入构造可复制的 `用 bigpeng-hot-gzh ...` 指令，交给已安装该 Skill 的 Agent 执行语义理解与自由生成。

浏览器演示不会声称自己已经运行了大模型，也不会在路径 B 的空输入下伪造“当前热点”。

## 快速运行

```powershell
python -m http.server 4178 --directory demos/bigpeng-hot-gzh
```

打开 <http://127.0.0.1:4178/> 。页面不需要安装依赖或配置密钥。

## 代码地图

| 路径 | 职责 |
| --- | --- |
| `vendor-projects/bigpeng-hot-gzh/` | 已忽略的上游本地检出 |
| `studies/bigpeng-hot-gzh/upstream-lock.json` | 上游 commit、入口、必需文件和许可证锁定 |
| `studies/bigpeng-hot-gzh/design-contract.md` | 页面范围、边界与验收契约 |
| `demos/bigpeng-hot-gzh/index.html` | 能力实验台结构 |
| `demos/bigpeng-hot-gzh/app.js` | A/B 路由、确定性候选生成、QA 和复制交互 |
| `demos/bigpeng-hot-gzh/styles.css` | 深浅主题与响应式界面 |
| `demos/bigpeng-hot-gzh/docs/validation.md` | 浏览器验收记录 |

## 能力边界

| 能力 | 上游 Skill | 浏览器 Demo | 外部系统 |
| --- | --- | --- | --- |
| 路由、公式、模板、QA | 有 | 确定性复现 | 不需要 |
| 理解任意草稿 | 由宿主 LLM 完成 | 无，改用显式字段 | LLM |
| 实时热点搜索 | 仅空输入路径要求宿主搜索 | 无 | Web Search / 热点数据源 |
| 爆款效果预测 | 无 | 无 | 需真实曝光、点击与 A/B 数据 |
| 正文、配图、发布 | 明确排除 | 无 | 其他 Skill / CMS |

## 研究价值与下一步

它的主要研究价值是“如何把运营经验封装成 Agent Skill”，而不是新的基础算法。最有价值的后续实验是建立带曝光、点击率、阅读完成率和账号规模的正负样本，对比：

1. 不带 Skill 的通用大模型；
2. 只提供少量示例的 Prompt；
3. 完整 `bigpeng-hot-gzh` Skill；
4. 人类运营编辑。

至少记录公式覆盖、标题多样性、事实幻觉率、人评偏好、编辑采用率和线上点击率。

## 关联资源

- [上游 README](https://github.com/BigPengSays/bigpeng-hot-gzh/blob/main/README.md)
- [上游 SKILL.md](https://github.com/BigPengSays/bigpeng-hot-gzh/blob/main/SKILL.md)
- [标题公式](https://github.com/BigPengSays/bigpeng-hot-gzh/blob/main/references/title-formulas.md)
- [选题模板](https://github.com/BigPengSays/bigpeng-hot-gzh/blob/main/references/topic-templates.md)
- [交互演示说明](../../demos/bigpeng-hot-gzh/README.md)
