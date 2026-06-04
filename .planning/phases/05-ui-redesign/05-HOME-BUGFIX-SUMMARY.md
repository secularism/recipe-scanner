# Phase 5 Home Bugfix Summary

## Status

- Branch: `feat/06-04/phase-05-home-bugfix`
- Current state: implementation complete; pushed verification pending user review

## Changes

- 首页 Hero 插图从内联 SVG 改为 `view + CSS` 手绘锅，规避小程序端 SVG 子节点不显示的问题。
- 首页 `.page` 与 `.hero` 增加顶部间距，让内容整体下移。
- 一键生成区域改为 `scroll-view` 内部固定宽度 flex track，避免首卡偏移和卡片间距不稳定。
- `egg-rice` 预设图标从不存在的 `time` 改为 `paperplane`。
- README 记录收藏/历史机制：当前无登录，收藏和历史均保存在本机小程序缓存中。

## Notes

- 收藏 store 使用 `uni.setStorageSync('recipe-favorites', ids)`，只保存菜谱 id。
- 历史 store 使用 `uni.setStorageSync('recipe-history', list)`，最多保留 50 条生成记录。
- 当前不支持跨设备同步；清缓存、卸载小程序或换设备后数据不会保留。

## Verification

- `npx tsc --noEmit` — passed
- `npx tsx tests/e2e.test.ts` — 27/27 passed
- `npx tsx tests/matcher.test.ts` — 9/9 passed
- `npm run build:mp-weixin` — passed
