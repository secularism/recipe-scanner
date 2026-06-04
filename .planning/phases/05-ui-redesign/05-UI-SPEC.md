---
phase: 5
slug: ui-redesign
status: implemented-pending-user-validation
revision: 2
revision_note: 代码侧已按 OpenDesign 风格重构，并补齐小程序运行修复；等待用户验收
created: 2026-06-02
implemented: 2026-06-04
target_platform: 微信小程序 (uni-app + Vue 3 + TypeScript)
ui_library: uni-ui (主) + Tailwind CSS (备选)
output_for: OpenDesign 出图
---

# Phase 5 — UI 设计稿规范 (UI Design Contract)

> 给 OpenDesign 出图用的设计简报 + 实施时锁定间距/字色/文案的契约。
> 当前 UI 是占位版，本次按本规范整体重构。

---

## 0. 项目速览

**一句话定位**：告诉小程序你冰箱里有什么 → 立刻得到一份今晚能做的菜谱。
**目标用户**：18–40 岁、做饭频次中等、纠结"今天吃什么"的家常烹饪者。
**使用场景**：傍晚准备做饭时、逛超市前想确认菜谱、收藏拿手菜回头翻看。
**核心流程**：首页 → 选食材/调味料/菜系/口味 → 看到 1–3 个匹配菜谱 → 进详情 → 收藏/分享给好友。
**平台**：微信小程序（主，750×1334 设计稿基准），H5 兼容。
**风格关键词**：温暖 / 手绘 / 食物感 / 不焦虑 / 像菜场小本子。

---

## 1. 设计系统 (Design System)

| 属性 | 值 | 备注 |
|---|---|---|
| 工具 | Figma / OpenDesign 出图 | 静态图即可，不出可点原型 |
| **组件库（主）** | **uni-ui (`@dcloudio/uni-ui`)** | easycom 自动引入；优先用 `<uni-icons>` `<uni-tag>` `<uni-list>` `<uni-button>` 等现成组件 |
| 组件库（备选） | Tailwind CSS + `@uni-helper/uni-tailwind` | 仅当 uni-ui 缺乏所需组件时引入，工具类按需 |
| **图标库（主）** | **uni-ui 的 `<uni-icons>` 组件**（`@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue`） | 走 easycom `^uni-(.*)` 自动注册 |
| 图标库（备选） | iconfont / @iconify/uni / svg 雪碧图 | 当 uni-icons 没有对应图标时使用，必须走本地资源 |
| 字体 | 系统字体栈 (`PingFang SC` / `Microsoft YaHei`) | 标题偶尔用 `Marker Felt` / `Comic Sans MS` 走手写感 |
| 主题色来源 | `--color-*` CSS 变量，集中在 `src/uni.scss` | 重构时只改变量不动结构 |

**重要约束**：
- **坚决不使用 emoji**。所有原本是 emoji 的位置（按钮前缀、标题装饰、状态图标、食物图示）一律改用：
  1. 优先：uni-ui `<uni-icons type="..." size="..." color="..." />`
  2. 次选：内联 SVG
  3. 备选：第三方 icon（仅限本地资源）
- 食物图示（如详情页头部装饰）使用极简 SVG 轮廓手绘，不上 emoji。

**禁止**：
- Material 风格阴影、Skeuomorphism、玻璃拟态深色背景、华尔街风数据可视化色板
- 任何 emoji 字符（包括 ⭐ 📖 🍳 🥕 等），所有 UI 文案与图标位都走 icon 组件

---

## 2. 间距 (Spacing Scale)

所有间距必须是 4 的倍数，统一以 `rpx` 写代码（750 稿基准下 1rpx = 0.5px）。

| Token | rpx | px (750 稿) | 用途 |
|---|---|---|---|
| xs | 4 | 2 | 图标与文字内距、极小缝隙 |
| sm | 8 | 4 | 紧凑元素间距 |
| md | 16 | 8 | 标签间距、按钮内边距的一半 |
| lg | 24 | 12 | 卡片内边距、组件间竖向间距 |
| xl | 32 | 16 | 区块外边距、页面左右内边距 |
| 2xl | 48 | 24 | 区块大间隔 |
| 3xl | 64 | 32 | 页面级 Hero 上下空白 |

**例外**：装饰性手绘元素（蒸汽、虚线、贴纸）允许 ±2rpx 微调以制造手作感。

---

## 3. 字体 (Typography)

| 角色 | 字号 (rpx) | 字重 | 行高 | 用途 |
|---|---|---|---|---|
| Display | 56 | 800 | 1.2 | 首页 Hero 标题「今天吃什么？」 |
| Heading | 40 | 700 | 1.3 | 区块大标题（"为你推荐"） |
| Title | 32 | 600 | 1.4 | 菜谱名、卡片标题 |
| Body | 28 | 400 | 1.6 | 正文、按钮文字 |
| Label | 26 | 500 | 1.4 | 副标题、表单标签 |
| Caption | 24 | 400 | 1.4 | 提示、缺失食材说明 |
| Tag | 22 | 500 | 1.3 | 标签 chip 内文字 |

**特殊**：Hero 标题允许挂手写体装饰（不实际切换字体，而是配一个手绘下划线 SVG）。

---

## 4. 色彩 (Color)

整体走 **60-30-10 暖系手绘本** 配色。

| 角色 | 比例 | 色值 | 用途 |
|---|---|---|---|
| Dominant 背景 (60%) | 大面积 | `#FFF7EB` 米白 | 页面底色 |
| Secondary 卡片 (30%) | 中面积 | `#FFFFFF` 纯白 | 卡片、输入框、底部抽屉 |
| Accent 主橙 (10%) | 强调 | `#FF8C42` 暖橘 | 主 CTA、激活态、契合度数字、口味 chip |
| Accent 浅橙 (辅) | 装饰 | `#FFD4A3` 浅杏 | 标签背景、未激活 chip、装饰胶带 |
| Accent 高亮 | 强调 | `#FFB877` | 焦点环、蒸汽、装饰 |

**文字色**
- 主文字 `#4A3520` 深咖（不用纯黑，温柔）
- 次文字 `#8B6F4E` 中咖
- 边框/分隔 `#F0E0C0` 米杏

**状态色**（克制使用）
- 成功 `#7BC47F` 草绿（"食材齐全"提示）
- 危险 `#E57373` 砖红（删除按钮）
- 警告 `#F0B95A` 麦黄（缺失食材高亮）

**主橙色专属调用清单**（**只能**用于这些地方，绝不滥用）：
1. 首页主 CTA「选食材开始」按钮背景
2. 菜谱卡右上角"契合 XX%" 数字
3. 口味标签选中态背景
4. 生成按钮 hover/active 阴影
5. 装饰性手绘圆点 / 蒸汽线条

---

## 5. 文案契约 (Copywriting)

文案走 **"人话、短、口语化"**，不堆砌、不说教。
**所有 emoji 全部移除**，标题前缀图标由 `<uni-icons>` 提供。

| 元素 | 文案 | 配套图标 (uni-icons) |
|---|---|---|
| 首页主标题 | 今天吃什么？ | — |
| 首页副标题 | 告诉我你冰箱里有什么，我帮你想想 | — |
| 首页主 CTA | 选食材开始 | `shop` 或 `cart` |
| 首页预设区标题 | 一键生成 | `bolt` |
| 首页底部 | 用心做饭，用爱生活 | `heart-filled` |
| 收藏按钮（未收藏） | 收藏 | `star` |
| 收藏按钮（已收藏） | 已收藏 | `star-filled` |
| 收藏入口 | 收藏 | `star` |
| 历史入口 | 历史 | `book` 或 `list` |
| 生成页食材区标题 | 你有什么食材 | `list` |
| 生成页调味料区标题 | 你有什么调味料 | `gear` |
| 生成页菜系区标题 | 想吃哪个菜系 | `globe` |
| 生成页口味区标题 | 想要什么口味 | `fire` |
| 生成页主按钮 | 看看能做啥 | `paperplane` / `search` |
| 结果页空状态标题 | 食材太少啦 | `info` |
| 结果页空状态正文 | 多选几样食材，调料也加上，结果会更准哦 | — |
| 结果页"换一换"按钮 | 换一换 | `refresh` |
| 详情页食材区标题 | 需要准备 | `list` |
| 详情页齐全态 | 食材齐全 | `checkmarkempty` (成功色) |
| 详情页做法区标题 | 做法 | `flag` |
| 详情页底部"收藏" | 收藏 / 已收藏 | `star` / `star-filled` |
| 详情页底部"分享" | 分享给好友 | `redo` / `share` |
| 分享卡片标题 | 试试这道 [菜名]，[一句简介] | — |
| 分享卡片 path | `/pages/detail/detail?id=xxx&from=share` | — |
| 错误 toast | 出错了，再试一次 | `closeempty` |
| 危险操作确认 | 确认删除？删了就没了哦 | `warn` |
| 加载中 | 正在翻菜谱本… | `spinner-cycle` |
| 收藏页顶部 | 我的收藏 · N 道 | `star-filled` |
| 收藏页空状态 | 还没有收藏的菜谱 | `star` |
| 收藏页空状态副标 | 去生成一个吧 | — |
| 收藏页空状态 CTA | 去选食材 | `shop` |
| 历史页顶部 | 历史记录 · N 条 | `list` |
| 历史页空状态 | 还没有历史记录 | `list` |
| 历史页空状态副标 | 你生成的菜谱会出现在这里 | — |
| 缺失食材前缀 | 还差： | `minus` 或 `close` (麦黄) |

**禁止**：
- "立即"、"马上"、"限时"等运营腔
- 超过 12 个字的长标题
- 中英混排（除必要专有名）
- 感叹号超过 1 个
- **任何 emoji 字符**

---

## 6. 插画与装饰规范

| 元素 | 规格 |
|---|---|
| Hero 装饰 | 圆形白底 200rpx，6rpx 浅杏描边；中心放内联 SVG「手绘煎锅 / 锅铲」轮廓图（用 SVG path 画，线宽 4rpx），右上角偏 15° 放 SVG「蒸汽三道弯曲线条」 |
| 胶带装饰 | 卡片左上角贴一段 120rpx × 24rpx 浅杏色矩形，旋转 -2°，opacity 0.4 |
| 虚线分隔 | 1rpx 虚线 `dashed`，颜色 `--color-border` |
| 手绘圆点 | 用于强调项前点缀，直径 12rpx，浅杏填充 |
| 缺失食材前缀 | 用 `<uni-icons type="minus" color="#F0B95A" />` 替代原 `?` 文字符号，不打删除线（避免负面感） |
| 加载动画 | `<uni-icons type="spinner-cycle" />` + 文字「正在翻菜谱本…」 |

**插画风格统一约束**：
- 线条粗细 4rpx 起步，最细不小于 2rpx
- 不使用渐变；纯色 + opacity 制造层次
- 不引入真人头像或具象人物
- 食物只用 SVG 极简轮廓（锅/铲/碗/筷/叶菜/鱼），不放写实照片也不放 emoji

---

## 7. 页面级规范 (Page Specs)

### 7.1 首页 `pages/index/index`

**结构**（自上而下）：
1. **Hero 区**（高度 ~360rpx）
   - 居中圆形装饰（200rpx），内嵌手绘煎锅 SVG + 蒸汽 SVG
   - 标题"今天吃什么？"（Display 56rpx / 800）
   - 副标题"告诉我你冰箱里有什么，我帮你想想"（Label 26rpx）
2. **主 CTA**
   - 全宽按钮「选食材开始」（前缀 `<uni-icons type="shop" color="#fff" />`）
   - 暖橘底白字，圆角 32rpx
   - 阴影 `--shadow-soft`
3. **一键生成区**（横向滚动）
   - 区标题「一键生成」（前缀 `<uni-icons type="bolt" />`）
   - 4 张预设卡（200rpx 宽），每卡含 SVG 图标 / 标题 / 描述
   - 卡间距 16rpx，卡片圆角 20rpx
4. **次级入口**（收藏 + 历史，两列）
   - 白底卡，左 icon（star / book）右文字 + 计数
   - "收藏 3 道" / "历史 12 条"
5. **底部装饰**
   - 小字 "用心做饭，用爱生活"（前缀 `<uni-icons type="heart-filled" color="..." />`）

**交互**：
- 卡片整体有 hover 缩放 0.98
- 主 CTA 按下时阴影变浅
- 进入页面：顶部 0rpx 起始，下拉入场动画（可选，300ms 缓动）

**分享**：`onShareAppMessage` 在此页已实现，title 走规范第 5 节。

---

### 7.2 生成页 `pages/generator/generator`

**结构**（垂直滚动，section 折叠）：
1. **食材区**（最重要，占首屏）
   - 区标题「你有什么食材」（前缀 `<uni-icons type="list" />`）
   - 标签云（`<uni-tag>` 组件，多选）
   - 下方 ChipInput：「写下你自己的」（回车添加）
2. **调味料区**
   - 区标题「你有什么调味料」（前缀 `<uni-icons type="gear" />`）
   - 标签云 + ChipInput（同上）
3. **菜系单选**（横向 chip，单选）
   - 区标题「想吃哪个菜系」（前缀 `<uni-icons type="globe" />`）
   - 全部 / 川菜 / 粤菜 / 家常 / 西餐 / 日韩 / 东北
4. **口味多选**
   - 区标题「想要什么口味」（前缀 `<uni-icons type="fire" />`）
   - 辣 / 清淡 / 酸甜 / 咸鲜（chips）
5. **底部固定主按钮**
   - 「看看能做啥」（前缀 `<uni-icons type="paperplane" color="#fff" />`）
   - 暖橘底，圆角 32rpx
   - 任意一项未选时灰显

**状态**：
- 空选：按钮 50% opacity，不可点
- 至少 1 项食材：按钮激活
- 输入草稿持久化（已实现 `GENERATOR_DRAFT_KEY`）

---

### 7.3 结果页 `pages/result/result`

**结构**：
1. **顶部摘要条**（高度 80rpx）
   - "基于你输入的 N 种食材"
2. **菜谱卡列表**（1–3 张，垂直堆叠）
   - 使用 RecipeCard 组件
   - 第一张大卡（height ~360rpx），后续小卡 ~240rpx
3. **缺失食材明细**（在每张卡下方）
4. **底部"换一换"按钮**
   - 「换一换」（前缀 `<uni-icons type="refresh" />`）白底橘边，圆角 pill
5. **空状态**（无匹配）
   - SVG 插画：空碗
   - 标题"食材太少啦"
   - 副标题 + 「返回修改」CTA

**交互**：
- 点卡片进详情
- "换一换"在同一输入下重排结果
- 出现 1 次：加载骨架屏（3 行占位 + 圆形头像占位）

---

### 7.4 详情页 `pages/detail/detail`

**结构**：
1. **顶部 hero 卡**（圆角 32rpx 顶部）
   - 菜名（Title 40rpx / 700）
   - 菜系/时长/口味三 chip
   - "契合 XX%" 大数字（Display 48rpx 主橙色）
2. **食材清单**
   - 区标题「需要准备」（前缀 `<uni-icons type="list" />`）
   - 分"已有 ✓"（绿勾用 `<uni-icons type="checkmarkempty" color="#7BC47F" />`）和"还差 ?」（麦黄 `<uni-icons type="minus" color="#F0B95A" />`）两组
3. **调味料清单**（同上分组）
4. **步骤**
   - 区标题「做法」（前缀 `<uni-icons type="flag" />`）
   - 编号 1-2-3，每步一行，背景浅杏色 strip
5. **底部操作条**（fixed）
   - 左：收藏 / 已收藏（toggle）`<uni-icons type="star" />` / `<uni-icons type="star-filled" />`
   - 右：分享给好友（触发 onShareAppMessage）`<uni-icons type="share" />`

**分享**：`onShareAppMessage` title = "试试这道 [菜名]，[shortDesc]"，path = 当前页带 `?id=xxx&from=share`。

---

### 7.5 收藏页 `pages/favorites/favorites`

**结构**：
1. **顶部**：「我的收藏 · N 道」（前缀 `<uni-icons type="star-filled" color="..." />`）
2. **列表**：RecipeCard 列表，无契合度数字（已收藏就够）
3. **空状态**：
   - SVG 插画：空星星
   - "还没有收藏的菜谱"
   - 副标"去生成一个吧"
   - CTA「去选食材」（前缀 `<uni-icons type="shop" />`）

**交互**：
- 点卡片进详情
- 长按卡片出操作菜单"取消收藏"
- 列表为空时显示空状态组件

---

### 7.6 历史页 `pages/history/history`

**结构**：
1. **顶部**：「历史记录 · N 条」（前缀 `<uni-icons type="list" />`）
2. **时间线**（按天分组）
   - 今天 / 昨天 / 具体日期
   - 每条：菜名 + 时间 + "缺失食材"简述
3. **底部"清空"按钮**（危险操作，需确认）
4. **空状态**：
   - SVG 插画：空清单
   - "还没有历史记录"
   - 副标"你生成的菜谱会出现在这里"

**交互**：
- 单条左滑出"删除"按钮（红色背景）
- 底部"清空全部"二次确认弹窗

---

## 8. 组件级规范 (Component Specs)

### RecipeCard（重构重点）

**当前占位 → 重构后**：
- 圆角 24rpx
- 白色背景 + 极浅橘色左 border（4rpx solid `--color-primary-light`）替代现在的胶带
- 标题左对齐 32rpx / 700
- 右上角契合度："契合 87%" 主橙色 Display-style 数字（40rpx / 800）
- 菜系/时长/口味 chip 用浅杏底（未激活）和主橙底（口味激活）
- 缺失食材区：麦黄色 tag 列表，每项前 `<uni-icons type="minus" color="#F0B95A" />`
- 齐全态：草绿底浅色 strip，文案前缀 `<uni-icons type="checkmarkempty" color="#7BC47F" />`

### TagSelector

- 多选 chip 流式布局
- 选中：主橙底白字
- 未选：白底浅杏边，米色文字
- 圆角 pill（999rpx），内边距 8rpx × 24rpx
- 间距 12rpx / 16rpx

### ChipInput

- 输入框：白底 1rpx 米杏边，圆角 16rpx
- 已添加 chip 在输入框上方展示，可点 × 移除
- 回车 / 点 + 添加
- 移除按钮用 `<uni-icons type="close" />`

### EmptyState

- 垂直居中
- 顶部 SVG 插画 200×200rpx
- 标题 32rpx / 600
- 副标 26rpx / 次色
- 可选 CTA 按钮

### SectionTitle

- 左：`<uni-icons>` + 文字 28rpx / 700
- 右侧可放折叠箭头（`<uni-icons type="arrowdown" />`）或计数

---

## 9. 交互态 (Interaction States)

每个交互元素都需有 4 态：default / hover / active / disabled。

| 元素 | default | hover | active | disabled |
|---|---|---|---|---|
| 主 CTA 按钮 | 暖橘底白字 + soft 阴影 | scale(1.02) | scale(0.98) + 阴影变浅 | 50% opacity，不可点 |
| 次按钮（白底） | 白底浅边咖色字 | bg 米杏 | scale(0.98) | 50% opacity |
| Chip 未选 | 白底浅边 | bg 米杏 | bg 米杏深 | — |
| Chip 选中 | 主橙底白字 | 主橙深 5% | 主橙深 10% | — |
| 卡片 | 白底 + soft 阴影 | 阴影加深 | scale(0.98) | — |
| 列表项（左滑删除） | 静态 | 露出 160rpx 红色删除区 | 红色加深 | — |

**禁止**：用透明度 < 30% 的 disabled（看不清）。

---

## 10. 动效 (Motion)

| 场景 | 时长 | 缓动 |
|---|---|---|
| 页面进入 | 300ms | ease-out |
| 卡片 stagger 入场 | 每张延迟 50ms | ease-out |
| 按钮按下 | 100ms | ease-in-out |
| 换一换结果切换 | 200ms 淡出 → 内容替换 → 200ms 淡入 | ease-in-out |
| 收藏 toggle | 250ms 缩放弹跳 | spring (cubic-bezier(0.34, 1.56, 0.64, 1)) |
| Toast | 入 200ms / 停 1500ms / 出 200ms | ease-out |

**禁止**：弹跳超过 2 次的庆祝动画、超过 500ms 的转场。

---

## 11. 注册表安全 (Registry Safety)

**主选**（直接用，无审查）：
| 来源 | 使用块 |
|---|---|
| **uni-ui 官方组件** | `<uni-icons>`、`<uni-tag>`、`<uni-list>`、`<uni-list-item>`、`<uni-button>`、`<uni-card>`、`<uni-grid>`、`<uni-popup>`、`<uni-toast>` 等 |
| 系统字体 | `PingFang SC` / `Microsoft YaHei` |
| 内联 SVG | 装饰性手绘元素（煎锅、蒸汽、空碗、空星等），写在 `.vue` 文件 `<template>` 内 |

**备选**（按需引入，需本地化）：
| 来源 | 使用块 | 引入方式 |
|---|---|---|
| Tailwind CSS | 工具类样式补充 | `@uni-helper/uni-tailwind` 插件，PostCSS 集成 |
| iconfont | 第三方 icon 库（仅当 uni-icons 缺图时） | 下载到 `src/static/iconfont/`，本地引入，禁 CDN |
| @iconify/uni | iconify 全量 icon | 通过 `@iconify/uni` 组件，本地缓存 |
| 雪碧图 | 复杂图标合并 | SVG sprite，本地 |

**禁止**：
- 任何 emoji 字符（详见 §1）
- 任何 CDN 远程字体 / CDN 图片
- 任何运行时下载的 icon 资源
- Material Icons / FontAwesome 等 font icon（占带宽、跨端渲染不一致）

**审查门**：
- Tailwind 仅作 utility 工具类补充（间距/颜色/排版），不允许替代 uni-ui 组件
- 第三方 icon 引入前必须确认无 unicode emoji 兜底字符

---

## 12. OpenDesign 出图 prompt 模板

把以下 4 行直接喂给 OpenDesign，每页一张。
**所有 emoji 已移除**，图标位用 `[icon:xxx]` 占位（如 `[icon:shop]` / `[icon:star]`），对应 uni-icons type。

```
[页面名]，[平台]小程序界面设计稿，[风格描述：手绘暖系菜谱本 / 暖橘 #FF8C42 + 米白 #FFF7EB]，
[分辨率 750×1334]，[布局要点简述]，[关键文案引用本文档第 5 节]，
[包含元素清单：手绘锅铲 SVG / 按钮 / 卡片 / chip / 装饰胶带 / icon 组件位 等]
```

示例（首页 prompt）：
```
微信小程序「菜谱生成」首页设计稿，手绘暖系菜谱本风格，主色暖橘 #FF8C42 + 米白 #FFF7EB，
分辨率 750×1334。自上而下：手绘煎锅 SVG(中心) + 蒸汽三道弯曲线条 + 大标题"今天吃什么？"
+ 副标"告诉我你冰箱里有什么，我帮你想想" + 暖橘主按钮"选食材开始"（前缀 shop icon）
+ 横向 4 张预设卡（每卡含 SVG 图标 / 标题 / 描述） + 两列"收藏 3 道"/"历史 12 条"（前缀 star / book icon）
+ 底部"用心做饭，用爱生活"（前缀 heart-filled icon）。
浅杏色胶带装饰，圆角 24-32rpx，CSS 阴影柔和。禁止任何 emoji。
```

---

## 13. 验收清单 (Definition of Done)

- [ ] 6 个页面 OpenDesign 出图都已交付
- [ ] 出图分辨率均为 750×1334（mp-weixin 设计基准）
- [ ] 配色与本规范第 4 节一致（主色未漂移）
- [ ] 文案与第 5 节一字不差（**无任何 emoji**）
- [ ] 间距遵循第 2 节（无 4rpx 之外的奇数）
- [ ] 字号/字重遵循第 3 节
- [ ] 图标位全部用 `[icon:xxx]` 标注（对应 uni-icons type）
- [ ] 出图无 emoji、无写实照片、无渐变背景
- [ ] 4 种交互态在出图中均有体现（至少 default + active）

---

## 14. 不在本次范围 (Out of Scope for Phase 5)

- 暗色模式（v2）
- 国际化多语言（v2）
- 动画/视频步骤演示（v2）
- AI 生成菜谱（已留接口，本次不实现）
- 食材拍照识别（v2）

---

## Checker 签收 (Sign-Off)

- [ ] 维度 1 文案契约：通过（已移除全部 emoji）
- [ ] 维度 2 视觉规范：通过
- [ ] 维度 3 色彩规范：通过
- [ ] 维度 4 字体规范：通过
- [ ] 维度 5 间距规范：通过
- [ ] 维度 6 注册表安全：通过（已确认 uni-ui 为主、Tailwind/iconfont 备选）

**批准状态**：pending（待 OpenDesign 出图后由 gsd-ui-checker 复核）

---

## 15. 实现同步记录 (2026-06-04)

**代码提交**
- `e5bbb99 refactor: 按 OpenDesign 设计稿重构 6 页面 + 5 组件样式`
- `b4ed00f fix: 修复小程序页面组件渲染`

**已落地范围**
- 页面：`index`、`generator`、`result`、`detail`、`favorites`、`history`
- 组件：`TagSelector`、`ChipInput`、`RecipeCard`、`EmptyState`、`SectionTitle`
- 小程序配置：`pages.json` 首页改用原生导航头；`manifest.json` 顶层与 `mp-weixin.appid` 统一为 `wxb8b86d12083c52cd`
- 构建注册：显式 import 本地组件，确保小程序端生成 `usingComponents`
- 图标安全：替换不存在的 `uni-icons` type（`bolt`、`globe`、`share`）

**已验证**
- `npx tsc --noEmit`
- `npx tsx tests/e2e.test.ts`（27/27）
- `npx tsx tests/matcher.test.ts`（9/9）
- `npm run build:mp-weixin`
- `npm run dev:mp-weixin` 已生成 `dist/dev/mp-weixin`

**当前状态**
- 代码已推送到 `feat/06-02/phase-05-ui-redesign`
- 等待用户在微信开发者工具验收
- 验收通过后由 agent 合并到 `main`，保留当前 feature 分支

---

## 16. 首页 Bugfix 同步记录 (2026-06-04)

**分支**
- `feat/06-04/phase-05-home-bugfix`

**修复范围**
- 首页 Hero 圆形插图区改为小程序稳定渲染的 `view + CSS` 手绘锅，不再依赖内联 SVG 在小程序端的渲染。
- 首页整体内容增加顶部间距，降低贴近导航栏的感觉，并减少底部视觉空档。
- 一键生成卡片改为横向 flex track，保证首卡与标题左边界对齐，卡片之间间距稳定。
- 一键生成第一个预设图标从不存在的 `time` 替换为存在的 `paperplane`。
- README 增加收藏/历史机制说明：当前无登录、无云同步，收藏与历史均为本机小程序缓存。

**待验证**
- 微信开发者工具导入 `dist/dev/mp-weixin`，检查首页插图是否显示、横向卡片是否对齐、首页整体视觉是否更舒展。
