# Phase 5 Home Bugfix Plan

## Objective

修复用户在微信开发者工具中反馈的首页问题：Hero 插图缺失、一键生成卡片对齐不稳、首页整体位置偏上，以及说明收藏/历史在无登录场景下的保存机制。

## Scope

- `src/pages/index/index.vue`
- `src/data/presets.ts`
- `README.md`
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/phases/05-ui-redesign/05-UI-SPEC.md`

## Tasks

- [x] 新建分支 `feat/06-04/phase-05-home-bugfix`
- [x] 将首页 Hero 插图改为小程序稳定渲染的 CSS 手绘锅
- [x] 调整首页顶部间距，让页面整体下移
- [x] 调整一键生成横向卡片布局，保证对齐稳定
- [x] 替换不存在的预设卡图标 type
- [x] 在 README 中说明收藏/历史为本机缓存机制
- [x] 同步 GSD 文档
- [x] 用户验收通过后合并到 `main`
- [x] 合并后同步 GSD 文档状态

## Verification

- [x] `npx tsc --noEmit`
- [x] `npx tsx tests/e2e.test.ts`
- [x] `npx tsx tests/matcher.test.ts`
- [x] `npm run build:mp-weixin`
- [x] `npm run dev:mp-weixin`
