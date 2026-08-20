# Punk Skill 能力实验室 · 部署说明

## 线上地址

- 能力实验室：<https://yydshly.github.io/0819_githubcode_study/punk-skill/>
- 研究主库：<https://github.com/yydshly/0819_githubcode_study>

## 部署结构

GitHub Actions 工作流 `.github/workflows/deploy-outfit-director-pages.yml` 统一组装 Pages artifact：

```text
Pages /
├── index.html                 # Outfit Director，保留原有根入口
├── punk-skill/                # Punk Skill 能力实验室
└── studies/                   # 两个实验室对应的研究文档
```

工作流在 `main` 或当前研究分支 `agent/add-outfit-director-study` 的相关目录发生变化时自动执行，也支持 `workflow_dispatch` 手动部署。研究分支触发用于本次上线；合并回 `main` 后，主分支继续维护同一 Pages 地址。

## 本地验证

```powershell
python -m http.server 4174 --directory demos/punk-skill
```

打开 <http://127.0.0.1:4174/>。页面不需要构建步骤、后端或运行时密钥。

## 部署边界

- 在线页面仍是静态研究工作台，不连接文本模型、图像 Provider 或平台账号。
- ZIP、Canvas PNG、QA 和哈希在用户浏览器内执行。
- 上游 29 张样例通过远程来源引用；上游许可证未明确，不随 Pages artifact 复制。
- 浏览器导出的底图标注为研究预生成资产；真实生产使用时应由 Agent/Provider 替换。
