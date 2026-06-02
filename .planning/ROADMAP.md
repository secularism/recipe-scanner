# Roadmap

## Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | 项目骨架与架构 | 初始化 uniapp + vue3 + ts 工程，搭好目录结构与类型基础 | (基础设施) | 4 |
| 2 | 菜谱数据与匹配引擎 | 内置菜谱库 + 标签/食材匹配 + 生成服务 | GEN-01..02 | 3 |
| 3 | 页面与组件 (输入/结果/详情) | 首页/生成页/结果页/详情页 + 公共组件 | INPUT-01..06, DISP-01..03 | 4 |
| 4 | 收藏/历史/分享/收尾 | 收藏、历史、微信分享、深链、UI 收尾 | FAV-01..02, HIST-01..02, SHARE-01..03 | 4 |

**4 phases** | **17 requirements mapped** | All v1 requirements covered ✓

### Phase 5: UI 重构（OpenDesign 设计驱动）
**Goal**: 用 OpenDesign 出图作为设计稿，按 UI-SPEC.md 整体重构 6 个页面与 5 个组件
**Mode**: ui-phase
**Status**: UI-SPEC.md 已产出，待出图
**Success Criteria**:
1. OpenDesign 出图覆盖 6 个页面（750×1334）
2. 配色 / 字号 / 间距 / 文案严格遵循 `05-UI-SPEC.md`
3. 不引入 Tailwind / 第三方 icon / CDN 图片
4. 4 种交互态在 UI 中均有体现
5. 6 个页面 + 5 个组件的 `<template>` 与 `<style>` 全部按设计图重写

---

## Phase Details

### Phase 1: 项目骨架与架构
**Goal**: 一个能跑起来的 uniapp + vue3 + ts 空白工程，目录结构、类型定义、Pinia、ESLint 就绪
**Mode**: standard
**Success Criteria**:
1. `npm run dev:mp-weixin` 能成功编译并产出 dist 目录
2. 目录结构按 `src/{pages,components,stores,services,types,static,data}` 划分
3. `tsconfig.json` 启用 strict，`vue-shim.d.ts` 让 .vue 文件类型可用
4. Pinia 已装并能在 main.ts 注入；`src/types/recipe.ts` 定义核心领域模型

---

### Phase 2: 菜谱数据与匹配引擎
**Goal**: 一个能离线运行的本地菜谱库 + 标签/食材匹配服务
**Mode**: standard
**Success Criteria**:
1. `src/data/recipes.ts` 至少包含 20 个真实菜谱（含川/粤/家常/西餐/日韩）
2. `src/services/matcher.ts` 输入 (ingredients, seasonings, cuisine?, taste?) 输出按契合度排序的菜谱
3. `src/services/generator.ts` 包装 matcher，对外暴露 `generateRecipe(input): Recipe[]`
4. 契合度算法：食材覆盖率 70% + 调味料覆盖率 30%；缺失项明确标注
5. 单测至少覆盖：精确匹配、部分匹配、空输入

---

### Phase 3: 页面与组件 (输入/结果/详情)
**Goal**: 完整的用户输入 → 生成 → 查看菜谱的端到端流程
**Mode**: standard
**Success Criteria**:
1. 首页 `/pages/index/index` 提供两个入口：开始生成、查看收藏、查看历史
2. 生成页 `/pages/generator/generator` 含食材多选/输入、调味料多选/输入、菜系单选、口味多选、"开始生成"按钮
3. 结果页 `/pages/result/result` 展示匹配结果（可"换一换"），点击进入详情
4. 详情页 `/pages/detail/detail?id=xxx` 展示完整菜谱，含收藏按钮
5. 公共组件：`TagSelector`, `ChipInput`, `EmptyState`, `RecipeCard` 拆分清晰，每个 ≤ 150 行

---

### Phase 4: 收藏/历史/分享/收尾
**Goal**: 持久化 + 微信生态接入 + 整体润色
**Mode**: standard
**Success Criteria**:
1. 收藏 store 持久化到 `uni.setStorageSync('favorites', ...)`，跨页实时同步
2. 历史 store 每次生成追加一条，可单条删除
3. 详情页右上角"···"或按钮触发 `onShareAppMessage`，自定义 title/path；无 `onShareTimeline`
4. 分享 path 形如 `/pages/detail/detail?id=xxx&from=share`，接收端 onLoad 解析参数
5. 整体 UI 走手绘插画风（CSS/SVG 装饰，emoji 辅助），主色暖橘 + 米白

---

## 风险与依赖

- **风险**: 微信小程序分享 API 在 H5 不可用 — 通过条件编译 `#ifdef MP-WEIXIN` 隔离
- **依赖**: uni-ui 需在 manifest.json 引入 easycom
- **依赖**: vue-cli 构建需 Node ≥ 16
