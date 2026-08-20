# BigPeng Hot GZH 能力实验台

这是 `bigpeng-hot-gzh` 研究子项目的零依赖静态演示，用来展示上游 Skill 的两条任务路由、7 种标题公式、8 种选题模板和发出前 QA。

一句话定位：**用户提供模糊想法，宿主大模型将它明确化，Skill 再依据预先沉淀的经验规则生成、检查和推荐可进入写作流程的选题与标题，最后由用户做决定。**

这里的“可发布主题”指选题、读者、结果和正文兑现要求已经明确，不代表正文、配图或公众号草稿已经生成。

## 本地运行

```powershell
python -m http.server 4178 --directory demos/bigpeng-hot-gzh
```

打开 <http://127.0.0.1:4178/> 。

## 怎么演示

1. 选择“路径 A”，加载“小红书封面 Skill”预设，观察 6 条不同公式的标题。
2. 检查每条的公式、字数、点击理由和正文兑现要求。
3. 切换到“路径 B”，加载“WorkBuddy × 体制内办公”，观察 4 个不重复的选题方向及其标题。
4. 修改字段后再次生成，验证这是可重复的规则组合，不是浏览器内的 LLM。
5. 复制“真实 Agent 调用指令”，在已安装上游 Skill 的 Agent 中获取语义理解与自由生成结果。

## 诚实边界

- 页面不包含或调用大模型。
- 页面不爬取公众号，不计算热度，不预测阅读量。
- 路径 B 只复现“关键词 → 模板方向”；空输入时的当前热点仍需宿主 Web Search。
- 演示中的自定义输入用显式槽位代替 LLM 语义抽取，以便结果可复现。

## 文档

- [完整研究记录](../../studies/bigpeng-hot-gzh/README.md)
- [设计契约](../../studies/bigpeng-hot-gzh/design-contract.md)
- [浏览器验收](docs/validation.md)
- [Web 部署说明](docs/deployment.md)
- [交接说明](docs/handoff.md)
- [上游仓库](https://github.com/BigPengSays/bigpeng-hot-gzh)
