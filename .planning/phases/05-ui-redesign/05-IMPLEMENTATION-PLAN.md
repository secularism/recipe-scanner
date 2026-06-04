# Phase 5 Implementation Plan

## Objective

把 OpenDesign 风格重构落到小程序代码，并修复微信开发者工具中暴露的运行问题，保证 6 个页面、5 个组件、appid、原生头部、组件注册与构建验证都与当前代码一致。

## Scope

- 页面：`src/pages/index/index.vue`、`src/pages/generator/generator.vue`、`src/pages/result/result.vue`、`src/pages/detail/detail.vue`、`src/pages/favorites/favorites.vue`、`src/pages/history/history.vue`
- 组件：`src/components/TagSelector.vue`、`src/components/ChipInput.vue`、`src/components/RecipeCard.vue`、`src/components/EmptyState.vue`、`src/components/SectionTitle.vue`
- 配置：`src/pages.json`、`src/manifest.json`、`tsconfig.json`、`src/vue-shim.d.ts`

## Tasks

- [x] 按 OpenDesign 暖系手绘风重构 6 个页面与 5 个公共组件
- [x] 首页恢复微信小程序原生导航头，避免状态栏与胶囊区遮挡
- [x] 显式 import 本地组件，修复小程序构建后 `usingComponents` 缺失
- [x] 统一 appid 为 `wxb8b86d12083c52cd`
- [x] 替换不存在的 `uni-icons` type
- [x] 让生成页禁用态按钮仍可给出输入提示
- [x] 补 `.vue` 类型声明，使 `npx tsc --noEmit` 可通过
- [x] 推送 feature 分支，等待用户验收

## Verification

- [x] `npx tsc --noEmit`
- [x] `npx tsx tests/e2e.test.ts`
- [x] `npx tsx tests/matcher.test.ts`
- [x] `npm run build:mp-weixin`
- [x] `npm run dev:mp-weixin`

## Exit Criteria

- 用户在微信开发者工具验证 `dist/dev/mp-weixin` 通过
- agent 切回 `main` 合并 `feat/06-02/phase-05-ui-redesign`
- 保留当前 feature 分支
