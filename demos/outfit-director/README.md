# Outfit Director 能力实验室

这是 `outfit-director` 研究子项目的纯前端交互演示，用来解释 Skill 如何将自然语言换装需求转换成首帧布局、状态机、时间轴与提示词。

演示不会调用真实图像或视频模型，也不会上传用户输入。

## 本地运行

在研究主库根目录执行：

```powershell
python -m http.server 4173 --directory demos/outfit-director
```

打开：<http://127.0.0.1:4173/>

这是项目验收使用的规范运行地址。页面不需要安装依赖或执行构建。

## 主要交互

- 切换女性、男性和宠物主体路线。
- 切换 9 秒五造型卡点模式与 15 秒七造型舞蹈模式。
- 选择造型方向和兼容的换装机制。
- 查看中央主体与四个或六个侧边造型组成的首帧状态母图。
- 加速播放侧边造型“激活 → 清空 → 中央换装”的状态变化。
- 查看并复制参数锁定、完整时间轴、首帧提示词、视频提示词和负面约束。
- 切换深色与浅色主题。

## 文件结构

```text
demos/outfit-director/
├── index.html
├── styles.css
├── app.js
├── favicon.svg
├── README.md
└── docs/
    ├── design-contract.md
    ├── validation.md
    └── handoff.md
```

## GitHub Pages

所有资源均使用相对路径，可从仓库根目录发布 GitHub Pages。发布后页面路径预计为：

```text
https://<owner>.github.io/<repository>/demos/outfit-director/
```

实际公开地址应在完成仓库 Pages 配置并验证后再写回研究主索引。

## 能力边界

页面中的人物和宠物是用于表达身份锁定与造型变化的 SVG 示意轮廓。所有提示词由浏览器中的确定性规则生成，不能用来证明下游生成模型一定可以准确完成多主体、长时序或精确卡点任务。
