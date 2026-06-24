---
phase: 11-api-read-views-verification
plan: 11-02-favorites-history-verification
subsystem: miniapp
tags: [uni-app, favorites, history, api-read, verification]
requires:
  - plan: 11-01-detail-api-read
    provides: API-driven detail page and `fetchRecipeById(id)`
provides:
  - Favorites page display from `fetchMatchReadyRecipes()`
  - Local id-only favorites store
  - API-missing favorite placeholders with local cancel action
  - History snapshot navigation verification into API-driven detail
  - Full miniapp verification gate for Phase 11
affects: [phase-11-api-read-views-verification, milestone-v1.1-api-read]
tech-stack:
  added: []
  patterns:
    - Favorites store owns local ids only and has no API dependency
    - Favorites page builds API-backed view models ordered by local ids
    - Missing API recipes remain visible and are not auto-deleted
    - History remains local snapshot based and delegates recipe loading to detail page
key-files:
  modified:
    - apps/miniapp/src/stores/favorites.ts
    - apps/miniapp/src/pages/favorites/favorites.vue
    - apps/miniapp/tests/e2e.test.ts
key-decisions:
  - "Favorites page fetches the match-ready recipes pool and filters by local ids."
  - "Do not add backend batch lookup or per-favorite detail request loops."
  - "API failure preserves local favorite count and shows retry."
  - "History page remains local snapshot based; no live refresh or match-context restoration."
  - "Formal release prerequisite docs remain deferred by user decision."
requirements-completed: [READ-03, READ-04, READ-05, VERIFY-02, VERIFY-03]
requirements-deferred: [VERIFY-04]
duration: 35 min
completed: 2026-06-24
merged: 2026-06-24
merge_commit: 815fef9
commit: 49783ef0d9194052c649980d55e84b110d891c54
---

# Phase 11 Plan 11-02: Favorites, History, and Verification Summary

**Favorites now keep local id storage while displaying cards from the real recipes API pool; history remains local snapshots and opens the API-driven detail page by recipe id.**

## Accomplishments

- Removed the local `findRecipeById`-derived `favStore.list`.
- Kept `favorites.ts` as local id-only storage with `ids`, `count`, `load`, `isFavorite`, `toggle`, and local `remove`.
- Converted `favorites.vue` to load local ids first, then call `recipesApi.fetchMatchReadyRecipes()` only when ids exist.
- Preserved local favorite order when building available recipe cards.
- Added API-missing favorite placeholders with a local `取消收藏` action.
- Added favorites API failure UI with retry and preserved local count copy.
- Kept history page code local-only; existing navigation remains `/pages/detail/detail?id=${recipeId}`.
- Extended e2e-style coverage for history detail URL, detail failure data preservation, missing favorites, and no local fallback when API data is missing.
- Ran the full miniapp verification gate.

## Task Commits

1. **Task T1: Refactor favorites store to remain id-only at runtime** - `49783ef` (`feat: 接入收藏历史真实菜谱读取`)
2. **Task T2: Load favorites page cards from the real recipes API** - `49783ef` (`feat: 接入收藏历史真实菜谱读取`)
3. **Task T3: Add unavailable favorite cleanup without remote writes** - `49783ef` (`feat: 接入收藏历史真实菜谱读取`)
4. **Task T4: Preserve history as local snapshots that open API-driven detail** - `49783ef` (`feat: 接入收藏历史真实菜谱读取`)
5. **Task T5: Complete Phase 11 verification without release docs scope creep** - `49783ef` (`feat: 接入收藏历史真实菜谱读取`)

## Verification

- `npm --prefix apps/miniapp run type-check` - passed.
- `npx tsx apps/miniapp/tests/recipes-api.test.ts` - passed, 33 passed / 0 failed.
- `npx tsx apps/miniapp/tests/e2e.test.ts` - passed, 39 passed / 0 failed.
- `npx tsx apps/miniapp/tests/matcher.test.ts` - passed, 10 passed / 0 failed.
- `npm --prefix apps/miniapp run build:mp-weixin` - passed.

## Deviations from Plan

- `history.vue` did not require a code change because it already kept local snapshots and navigated by `recipeId`; verification was added in `e2e.test.ts`.
- The first sandboxed `build:mp-weixin` attempt failed with `EPERM` while creating ignored build output under `apps/miniapp/dist`. The same command passed after rerunning with elevated filesystem permission.

## VERIFY-04 Disposition

Formal WeChat release prerequisite documentation is intentionally deferred by user decision. No README, release checklist, or separate release document was added. The current branch remains suitable for experience-version use, with API base URL centralized in `apps/miniapp/src/config/api.ts`.

## Phase 11 Self-Check: PASSED

- Detail page uses `fetchRecipeById(id)` and no longer imports `findRecipeById`.
- Favorites page displays API recipes for local favorite ids and preserves missing ids.
- History remains local snapshot based and opens API-driven detail by `recipeId`.
- API failures do not clear favorites, history, or drafts.
- Full miniapp verification gate passed.

---
*Phase: 11-api-read-views-verification*
*Plan: 11-02-favorites-history-verification*
*Completed: 2026-06-24*
