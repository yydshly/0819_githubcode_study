# 部署与交接

## 交付内容

- GitHub Pages 根路径的研究总入口。
- Outfit Director、Punk Skill、Xianxia Visual Director 三个独立演示路径。
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
| `/studies/<project>/` | 对应研究记录 |

工作流支持 `workflow_dispatch`，可从当前研究分支发布验证；推送到 `main` 且命中相关路径时也会自动部署。

## 边界

- 不合并 `main`、不创建 PR，除非另行授权。
- 不修改或提交工作区中不属于本次范围的 Punk Skill 实现。
- 各子项目仍保持独立研究结论与资源边界；总入口只负责导航和摘要。
- Xianxia 上游未声明许可证，本仓库不提交其本地研究检出源码。

## 后续维护

新增子项目时同步更新总入口卡片、根 README、工作流复制路径和浏览器路由验收。若删除或改名子项目，应保留旧路径重定向或明确更新外部链接。
