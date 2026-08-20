# 线境：月夜追迹 v0.3.1

这是基于 [muratkamci/Lineworld](https://github.com/muratkamci/Lineworld) 的独立可玩衍生原型。它保留原作的程序化线稿世界、狗角色、灯笼、雾、气味 Shader、动物和 Web Audio，并新增“嗅闻—潜近—追逐—扑击—捕获/逃脱”的白兔狩猎闭环。

- 在线体验：<https://yydshly.github.io/0819_githubcode_study/lineworld-night-hunt/>
- [技术原理](../../studies/lineworld/technical-principles.md)
- [部署说明](docs/deployment.md)

上游完整检出继续保存在 `vendor-projects/Lineworld`，本项目不修改其 Git 工作树。衍生代码依据上游 MIT 许可证使用，许可证全文见 [LICENSE](LICENSE)。

## 当前可玩内容

- 一只具有稳定身份和独立生命周期的目标白兔。
- `calm → listening → alert → fleeing → juking → burrowing → escaped` 显式状态机。
- 感知、意图和运动分离；状态具有最短停留时间和闪避冷却。
- 动态记录兔子运动历史的气味粒子轨迹。
- 兔子洞目标与可靠的逃脱终止状态。
- 狗在奔跑并面向近距离兔子时，可用 Space 执行扑击。
- 捕获后提供“带走恢复灯火”和“放生保留记忆”两个选择。
- 捕获、放生、逃脱次数和最后选择保存到 localStorage。
- 数据化“月光走廊”关卡将视觉、圆形碰撞代理与导航锚点分离，狗和兔子都会被树木/岩石阻挡。
- 启动时验证出生点、洞口、兔子逃生路线与放生引路路线；无有效路线会明确报错。
- 放生会留下关系标记；下一局白兔以引路者而非猎物身份回来，距离过远会等待，并把狗带到围巾记忆地点。
- 捕猎、选择、结果与跨局引路已迁移到稳定ID的任务图；`hunt.resolved.take`与`hunt.resolved.release`是可独立扩展的结果节点。
- 页面标题、操作条、狩猎HUD、统计、按钮、结果故事、引路故事和上游记忆短句已全部中文化。
- 玩家不再被“月光走廊”的任务矩形限制，可继续探索上游程序化世界；任务动物仍使用受验证的导航范围，避免跑丢。
- 首次进入会显示完整玩法教学；关闭后常驻“当前目标”，右上角“玩法说明”可随时重新打开。
- 原有鸟、狐狸、地标、挖掘、幽灵、程序化音频和世界色相系统继续保留；狩猎模式关闭随机氛围兔子，避免目标混淆。

## 本地运行

```powershell
cd E:\0819_codex_project\demos\lineworld-night-hunt
npm install
npm run dev -- --host 127.0.0.1 --port 5190
```

打开 <http://127.0.0.1:5190/>。

生产构建和AI回归：

```powershell
npm run test:ai
npm run build
```

## 操作

| 输入 | 行为 |
| --- | --- |
| WASD / 方向键 | 移动 |
| Shift | 奔跑 |
| Q | 嗅闻，显示兔子运动轨迹 |
| Space | 普通跳跃；追逐中满足距离和朝向条件时扑击 |
| F | 吠叫，快速提高兔子警觉并触发原有世界反馈 |
| E | 在原有气味目标处挖掘 |
| 鼠标拖动 / 滚轮 | 环绕和缩放相机 |

狩猎HUD会依次显示：

```text
HOLD Q · FIND THE SCENT
→ STALK · THREAT n%
→ CHASE · n m TO BURROW
→ SPACE · POUNCE
→ THE HUNT IS YOUR CHOICE / THE RABBIT ESCAPED
```

## 代码结构

| 路径 | 职责 |
| --- | --- |
| `src/hunt/ai.ts` | 无Three.js依赖的威胁评分、状态转换和逃跑方向决策 |
| `src/hunt/level-data.ts` | 稳定ID、平面出生点、障碍、导航锚点与叙事地标数据 |
| `src/hunt/collision.ts` | 狗/兔共享的圆形碰撞、提前避障、路线搜索与关卡验证 |
| `src/hunt/level-view.ts` | 与碰撞代理一致的树、岩石轮廓及引路终点线稿表现 |
| `src/hunt/story-graph.ts` | 数据化任务节点、中文状态/故事文案、选择边与跨局引路边 |
| `src/hunt/tutorial.ts` | 首次进入教学、会话内已读状态、重开入口与键盘关闭行为 |
| `src/hunt/hunt-rabbit.ts` | 目标兔子的线框表现、感知、状态、运动、体力和终止状态 |
| `src/hunt/scent-trail.ts` | 兔子运动历史和动态气味Points几何 |
| `src/hunt/burrow.ts` | 兔子洞的线稿标记和嗅闻反馈 |
| `src/hunt/hunt-director.ts` | 狩猎阶段、扑击命中、选择UI、固定测试夹具和调试快照 |
| `src/hunt/save.ts` | localStorage存档、关系标记、待触发引路事件与防御性读取 |
| `src/character.ts` | 在原狗角色上增加扑击窗口、方向锁定和前冲 |
| `tests/*.test.ts` | AI、碰撞、路线、任务图分支、稳定节点引用和中文文案完整性回归 |

## 确定性复核入口

- `?fixture=close`：目标兔子处于较近但不会自动惊动的位置。
- `?fixture=choice`：直接进入捕获选择面板，用于结果、焦点和存档验证。
- `?fixture=guide`：直接进入白兔重逢/引路状态，不依赖已有存档。
- `?tutorial=1`：强制显示首次玩法教学，用于复核教学内容和布局。
- `?seed=<number>`：固定兔子与洞穴初始布局。
- `window.__nightHunt.snapshot()`：读取阶段、兔子状态、距离、威胁和存档。
- `window.__nightHunt.forceRabbitNear()`：仅供测试，将兔子、狗和洞穴排成直线并进入追逐。
- `window.__nightHunt.forceGuideNear()` / `forceGuideComplete()`：仅供确定性引路验收。
- `window.__nightHunt.clearSave()`：清除本地测试存档。

## 已验证

- TypeScript `--strict` 类型检查通过。
- AI、关卡、边界职责与任务图确定性回归14/14通过。
- Vite生产构建通过；当前单JS包641.96 kB，gzip 170.23 kB，仍有大Chunk提醒。
- Chromium/WebGL2首屏、HUD、Shader、嗅闻、追逐、扑击、选择和逃脱路径通过。
- 放生结果刷新后仍保留，并在下一局切换成`prey → guide`跨局重逢；引路完成后待办事件被消费、关系计数增加。
- 数据关卡验证返回两条有效路线；碰撞解算与提前绕障都有确定性回归。
- 浏览器验证两条中文选择分支、跨局重逢、引路完成，以及390×844中文面板与两行操作提示。
- 浏览器验证首次教学、教学重开和阶段目标；真实Shift+D移动从x=0越过原x=13边界到x=212.7。
- 390×844结果面板无横向溢出，按钮可访问，`prefers-reduced-motion` 生效。
- 页面未观察到运行错误；仍保留上游 `THREE.Clock` 弃用警告。

详细证据见 [浏览器验收](docs/validation.md)。

## v0.3.1边界

- 当前碰撞只覆盖独立“狩猎走廊”的显式树/岩石代理，没有把上游所有程序化Chunk装饰自动转为碰撞体。
- 兔子使用导航可达性验证与局部避障，不是完整NavMesh、A*动态重规划或群体避让。
- 扑击使用主动窗口内的距离判定，不是完整的连续碰撞或物理接触。
- 当前跨局故事只有一次“围巾线索”引路事件，还没有对话树、可视化章节编辑器或多章节内容包。
- 任务图已经数据化，但节点效果仍由`HuntDirector`执行；下一阶段可继续抽出声明式存档变更、奖励和实体生成指令。
- 没有触屏移动控件；移动端只验证了结果面板布局。
- 没有狐狸争夺、鸟群引导、营地、背包、章节或生态数量反馈。
- 没有音量、键位、暂停和完整辅助设置。

下一阶段最值得做的是把捕猎、放生、引路抽成数据化任务图，再添加狐狸争夺或鸟群预警作为第二个复用案例；只有第二条任务能使用同一套关卡、AI、关系和事件接口，这个原型才真正成为游戏底座。
