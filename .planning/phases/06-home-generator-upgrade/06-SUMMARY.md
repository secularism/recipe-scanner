# Phase 6 SUMMARY — 首页 + 生成页体验升级

## Outcome

本 phase 已完成首页与生成页的体验升级，并已合并到 `main`。整体方向遵循 OpenDesign 设计稿：视觉优先、偏美食产品页，同时补足关键高频操作效率。

## Delivered

- 首页 Hero、主 CTA、场景预设卡、收藏/历史次级入口重做。
- 一键预设从普通快捷卡升级为 4 张场景化入口卡。
- 生成页新增顶部摘要条，实时展示已选食材、调味料、菜系和口味状态。
- 生成页新增草稿恢复提示和最近使用食材/调味料入口。
- 生成页已选内容改为显性 chip 反馈，并支持单项移除。
- 为保持文件粒度，新增生成页选择区组件、表单 composable 和纯函数工具。

## Files of Note

- `src/pages/index/index.vue`
- `src/pages/generator/generator.vue`
- `src/components/generator-selection-section.vue`
- `src/composables/use-generator-form.ts`
- `src/utils/generator-form.ts`
- `src/data/presets.ts`
- `tests/e2e.test.ts`

## Validation

- `npx tsc --noEmit`
- `npx tsx tests/e2e.test.ts`
- `npx tsx tests/matcher.test.ts`
- `npm run build:mp-weixin`

以上验证均已通过。
