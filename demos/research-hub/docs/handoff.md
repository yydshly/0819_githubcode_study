# 部署与交接

## 交付内容

- GitHub Pages 根路径的研究总入口。
- Outfit Director、Punk Skill、Xianxia Visual Director、Snakey Locomotion 四个独立演示路径。
- 根 README 的项目索引、定位说明与在线链接。
- Pages 工作流中的统一站点组装规则。
- 桌面、平板、手机、焦点、动效和路径浏览器验收。

## 发布方式

工作流：`.github/workflows/deploy-outfit-director-pages.yml`

发布路径：

| URL 路径 | 内容 |
| --- | --- |
| `/` | 研究总入口 |
| `/outfit-director/` | Outfit Director |
| `/punk-skill/` | Punk Skill |
| `/xianxia-visual-director/` | Xianxia Visual Director |
| `/snakey-locomotion/` | Snakey Locomotion WebGL 研究台 |
| `/studies/<project>/` | 对应研究记录 |

工作流支持 `workflow_dispatch`，可从当前研究分支发布验证；推送到 `main` 且命中相关路径时也会自动部署。

## 本次发布记录

| 项目 | 结果 |
| --- | --- |
| 实现与归档提交 | `f027a41c347051028347c1434175fd9a98e614af` |
| Actions 运行 | [32358286573](https://github.com/yydshly/0819_githubcode_study/actions/runs/32358286573)，成功 |
| 生产总入口 | <https://yydshly.github.io/0819_githubcode_study/> |
| Snakey 演示 | <https://yydshly.github.io/0819_githubcode_study/snakey-locomotion/> |
| 生产复验 | WebGL、交互场、归档状态、390px 布局和归档文档通过 |

## 边界

- 本次已获得直接提交并推送 `main` 的授权，不创建 PR。
- 不修改或提交工作区中不属于 Snakey 归档、总入口和 Pages 接入范围的实现。
- 各子项目仍保持独立研究结论与资源边界；总入口只负责导航和摘要。
- Xianxia 上游未声明许可证，本仓库不提交其本地研究检出源码。

## 后续维护

新增子项目时同步更新总入口卡片、根 README、工作流复制路径和浏览器路由验收。若删除或改名子项目，应保留旧路径重定向或明确更新外部链接。

## Revision 3：SRT Whiteboard Animation

- Pages 工作流已复制 `demos/srt-whiteboard-animation/` 与 `studies/srt-whiteboard-animation/`。
- 生产演示：<https://yydshly.github.io/0819_githubcode_study/srt-whiteboard-animation/>
- 根 README 的“在线演示”已指向生产 URL，不再指向 GitHub 内的 HTML 源码。
- 研究总入口已增加第六张 SRT 卡片，并延续现有三列、两列、单列响应式体系。
- GitHub Actions [32383473996](https://github.com/yydshly/0819_githubcode_study/actions/runs/32383473996) 成功；生产浏览器的入口、视频 Range、键盘、桌面与 390px 路径均通过。
- 本次范围不改变其他研究项目实现，也不删除原有入口。

## Revision 4：Blobatar

- 新增 `/blobatar/` 程序化身份研究台和 `/studies/blobatar/` 研究记录副本。
- 根 README、研究门户第八张卡片和 Pages 组装工作流已互相关联。
- 页面明确描述确定性 SVG 头像、14 种表情、社区默认身份、多 Agent 角色与五阶段状态适配。
- 研究记录链接指向 GitHub 可渲染 README，避免浏览器把 Pages 中的 Markdown 当作下载文件。
- 本地发布候选已通过门户 → Blobatar、Agent 状态、桌面、390px、键盘与 reduced-motion 验收。
- 生产演示：<https://yydshly.github.io/0819_githubcode_study/blobatar/>；GitHub Actions [32393725188](https://github.com/yydshly/0819_githubcode_study/actions/runs/32393725188) 成功，生产浏览器复验无控制台或资源错误。
