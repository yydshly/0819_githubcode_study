# Blobatar：确定性程序化身份

## 基本信息

| 字段 | 内容 |
| --- | --- |
| 原项目 | [Alain00/blobatar](https://github.com/Alain00/blobatar) |
| 原作者 | Alain |
| 许可证 | MIT |
| 研究版本 | `9946e7cce69aaa54666b2f1ad1aa6ce02801653d` / package 2.2.0 |
| 本地检出 | `vendor-projects/blobatar`（主仓库忽略目录） |
| 演示 | [程序化身份研究台](../../demos/blobatar/README.md) |
| 当前状态 | 已复现 / 可交互 |
| 最后更新 | 2026-08-20 |

版本、提交日期和许可证记录见 [`upstream-lock.json`](upstream-lock.json)。

## 为什么研究它

Blobatar 用很小的确定性 SVG 生成器解决“实体还没有头像时如何立即获得稳定身份”的产品问题。它没有生成模型、数据库或图片资产，却同时处理了输入规范化、视觉差异、几何约束、配色对比、动画、表达、框架适配和跨版本稳定性。

一句话定义：**Blobatar 是轻量级程序化身份标识组件。头像外观回答“谁”，表情与动效提示“状态”，文字标签提供准确语义。** 它首先是头像，但产品价值不只是装饰，而是在高密度界面里建立稳定、低成本、可复现的角色归因。

本研究关注的不是“能否多画几种卡通脸”，而是程序化身份如何成为产品基础设施，尤其是多 Agent、协作界面和大规模测试数据中的身份辨识。

## 研究问题

- Seed 如何稳定派生彼此独立的视觉特征？
- 如何在允许随机变化的同时维持几何和颜色质量？
- 如何新增特征而不改变已有用户头像？
- 这种身份系统适合哪些产品，不适合承担哪些安全职责？
- 如何扩展为 Agent 状态协议、品牌 preset 和 HCI 实验基线？

## 快速运行

```powershell
python -m http.server 4180 --directory demos/blobatar
```

访问 <http://127.0.0.1:4180/>。演示已经包含从固定上游源码构建的浏览器 bundle，不需要安装依赖。

## 能力地图

| 能力 | 上游实现 | 研究演示 |
| --- | --- | --- |
| 字符串到 SVG | `blobatar(name, options)` | Seed 实时输入、SVG 下载 |
| 稳定性 | 同一主版本内确定性输出 | 字节一致检查、规范化对照 |
| 视觉差异 | 10 种加权轮廓和连续几何 traits | 形状锁定与批量身份墙 |
| 品牌配置 | hue、tone、background、trait overrides | 品牌色相/色调和背景控制 |
| 表情 | 14 个按值导入的 expression | 中文表情选择器 |
| 动画 | hover / always，CSS motion | 主头像实时动态与 reduced-motion 降级 |
| 配色质量 | OKLCh 设计、sRGB 输出、默认对比度保证 | 显示实际 head / eye 色值 |
| 接入 | 字符串、URI、React、Vue、HTTP | 无框架 ESM 静态站 |

## 原理

```text
name
  ↓ NFC + trim + lowercase
32-bit seed state
  ↓ stream(state, traitKey)
shape / body / eyes / gaze / hue / tone / motion traits
  ↓ authored ranges + containment
constrained layout
  ↓ OKLCh → in-gamut sRGB + contrast correction
SVG paths + optional CSS motion
```

### 命名随机变量

每个特征由字符串 key 单独派生，例如 `shape`、`body.r`、`eye.gap`。因此新增 `motion.*` 或其他 key 不会消耗顺序随机流，也不会改变旧特征。这是项目最有迁移价值的设计。

### 约束式生成

随机值只是 `[0,1)` 位置，真正几何由轮廓词汇、作者设定的参数范围、face region 和 fit 运算共同决定。极端组合会被缩放到安全区域，配置不会绕过约束。

### 版本稳定性

轮廓概率区间、数值范围和色调集合属于 generation。增加轮廓会重新分配 `[0,1)` 区间，所以需要新主版本，而不是在小版本里悄悄改变旧头像。上游用 golden fixtures 和分布测试冻结映射。

## 代码地图

| 路径 | 职责 | 研究关注点 |
| --- | --- | --- |
| `packages/blobatar/src/hash.ts` | 名称规范化和 32 位派生 | 雪崩、UTF-8、非密码学边界 |
| `packages/blobatar/src/traits.ts` | 按 key 读取 `[0,1)` 特征 | 可追加命名空间、override |
| `packages/blobatar/src/styles/blob.ts` | 10 种轮廓的加权 bands | generation 与分布 |
| `packages/blobatar/src/styles/compose.ts` | 身体、眼睛和 fit | 约束程序化几何 |
| `packages/blobatar/src/color.ts` | OKLCh、色域和对比度 | 一致视觉与可访问性 |
| `packages/blobatar/src/render.ts` | 选项解析与 SVG 序列化 | 纯函数、静态/动态拆分 |
| `packages/blobatar/src/expression.ts` | 14 种姿态 | 表情是传入值，可 tree-shake |
| `packages/blobatar/src/motion.css` | 呼吸、漂浮、眨眼、扫视 | seeded phase、reduced motion |

## 使用场景

1. **社区与协作界面（主场景）**：新用户默认头像、评论者、成员列表和协作光标；不用等待用户上传照片即可形成可辨识成员列表。
2. **多 Agent 产品（主场景）**：为研究、检索、写作、执行等 Agent 提供稳定外观；再以表情、动效和文字状态表达待命、分析、执行、复核和完成。
3. **非人物实体**：仓库、团队、频道、机器人和临时工作组。
4. **测试与演示**：截图测试、Mock 数据、Storybook、回归夹具。
5. **离线或低基础设施产品**：不存储头像文件，不依赖图片服务。

不适用于真实肖像、人脸认证、安全指纹、绝对无碰撞身份和语音口型数字人。

## 可扩展方向

### P1：Agent 状态适配器

建立业务状态到 expression、motion、文本标签的显式映射；测试表情是否提升状态理解，或造成能力和情感的过度拟人化。

### P2：品牌 preset

把允许的 shape、色相、tone、背景和动画强度封装成版本化 preset。Preset 本身也要携带 generation，避免设计升级改变旧身份。

### P3：隐私安全身份

使用不透明用户 ID；跨系统需要稳定时，在服务端以密钥和租户域生成 HMAC seed，避免邮箱泄露、低熵枚举和跨站关联。

### P4：感知辨识实验

构建 Blobatar、Identicon、首字母、DiceBear 的对照实验，测量不同群组规模下的查找时间、记忆、误认和色觉缺陷表现。这是本项目最有论文价值的路线。

### P5：跨语言 parity

以 golden fixtures 定义 TypeScript、Rust、Go、WASM 的同 seed 同输出协议，研究字体无关 SVG 身份在边缘端、邮件和原生应用中的一致性。

### P6：形状插件与 generation 工具

探索可插拔形状定义、自动 containment 扫描、分布模拟和迁移报告，但保持“新增形状必须显式进入新 generation”的版本治理。

## 风险和边界

- 内部 seed state 为 32 位；它提供视觉雪崩，不提供密码学抗碰撞。
- 严格哈希相同不是唯一风险，轮廓和颜色接近造成的感知碰撞更早出现。
- 邮箱放入公共 URL 会进入第三方日志；普通无盐哈希也可能被字典枚举。
- 默认对比度针对身体和眼睛；自定义 palette 会绕过保证。
- 输出稳定性以主版本或 endpoint generation 为边界。
- 动画会把静态 `<img>` 变为内联 SVG 树，大型群组应优先使用静态模式或 hover。

## 阶段结论

Blobatar 已完成本地固定版本获取、真实代码 bundle、交互能力复现，以及社区 / 多 Agent 身份协议 Web 扩展。它的近期价值主要在产品层：默认身份、角色归因、状态感知和零资产启动；进一步的研究价值在于感知辨识、身份规模、状态语义和版本稳定性的 HCI / 工程评测。它不应被包装为新型生成模型或安全身份算法。

## 关联资源

- [上游 README](https://github.com/Alain00/blobatar)
- [本地演示说明](../../demos/blobatar/README.md)
- [设计契约](design-contract.md)
- [上游锁](upstream-lock.json)
- [上游许可证副本](../../demos/blobatar/UPSTREAM-LICENSE.md)
