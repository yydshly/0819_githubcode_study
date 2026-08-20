# 线境：月夜追迹部署说明

## 线上地址

- 可玩页面：<https://yydshly.github.io/0819_githubcode_study/lineworld-night-hunt/>
- GitHub仓库：<https://github.com/yydshly/0819_githubcode_study>
- 上游项目：<https://github.com/muratkamci/Lineworld>

## 发布方式

GitHub Actions工作流`.github/workflows/deploy-outfit-director-pages.yml`在`main`分支的Lineworld相关路径变化时：

1. 使用Node.js 22执行`npm ci`。
2. 执行严格类型检查与确定性回归。
3. 使用Vite构建`demos/lineworld-night-hunt/dist`。
4. 把构建结果复制到Pages产物的`lineworld-night-hunt/`目录。
5. 把研究文档复制到`studies/lineworld/`目录。
6. 上传并部署统一GitHub Pages站点。

`vite.config.ts`使用相对`base: './'`，确保JS和CSS资源能在仓库子路径中正确加载。

## 发布门禁

```powershell
cd demos\lineworld-night-hunt
npm ci
npm run test:ai
npx tsc --noEmit
npm run build
```

发布后必须验证：页面非空、Canvas正常、首次教学可关闭、嗅闻输入生效、中文HUD可读、手机视口无横向溢出、控制台无阻断错误。

## 回滚

GitHub Pages始终从`main`最新发布提交构建。若线上回归，可还原Lineworld发布提交后再次推送`main`，工作流会生成上一版本的完整站点产物。
