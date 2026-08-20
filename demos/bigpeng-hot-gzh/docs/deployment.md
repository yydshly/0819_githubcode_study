# Web 部署说明

## 线上地址

项目通过仓库的 GitHub Pages 工作流发布到：

<https://yydshly.github.io/0819_githubcode_study/bigpeng-hot-gzh/>

## 部署形态

- 零依赖静态页面：`index.html`、`styles.css`、`app.js`。
- 不包含后端、数据库、API 密钥或浏览器端大模型调用。
- GitHub Actions 在部署时把本目录复制到 Pages 产物的 `/bigpeng-hot-gzh/`。
- 研究记录同时发布到 `/studies/bigpeng-hot-gzh/`，页面中的相对链接会在部署组装阶段调整。

## 本地预览

在仓库根目录执行：

```powershell
python -m http.server 4178 --directory demos/bigpeng-hot-gzh
```

打开 <http://127.0.0.1:4178/>。

## 发布与回滚

发布由 `.github/workflows/deploy-outfit-director-pages.yml` 统一管理，可在 GitHub Actions 中手动触发。Pages 使用最新一次成功部署的产物；需要回滚时，从目标 Git 提交重新运行该工作流即可。

## 发布前检查

1. `node --check demos/bigpeng-hot-gzh/app.js` 通过。
2. 桌面、平板和移动端不存在横向溢出。
3. 路径 A、路径 B、自定义输入、复制、主题切换和键盘操作均通过。
4. 页面明确区分 Skill 规则、宿主大模型和外部数据能力，不把本地规则演示描述成真实 LLM 或热点预测。
