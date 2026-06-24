---
phase: 11-api-read-views-verification
plan: 11-01-detail-api-read
subsystem: miniapp
tags: [uni-app, recipes-api, detail-page, sharing, tests]
requires:
  - plan: 10-01-miniapp-recipes-client-mapper
    provides: Recipes API client and DTO mapper
  - plan: 10-02-result-api-generation
    provides: Result-page API generation and pending detail context handoff
provides:
  - Detail recipe reads through `fetchRecipeById(id)`
  - Share/detail paths backed by `GET /api/recipes/:id`
  - Full-page detail loading, retryable error, and smart return states
  - Network-free fake-request coverage for detail API success and failures
affects: [11-02-favorites-history-verification]
tech-stack:
  added: []
  patterns:
    - Recipes API client keeps injected request support for network-free tests
    - Detail page owns API loading and no longer uses local recipe lookup
    - Result-page match context is consumed only when previous route is the result page
key-files:
  modified:
    - apps/miniapp/src/services/recipes-api.ts
    - apps/miniapp/src/pages/detail/detail.vue
    - apps/miniapp/tests/recipes-api.test.ts
    - apps/miniapp/tests/e2e.test.ts
key-decisions:
  - "Add only `fetchRecipeById(id)` to the existing recipes API client."
  - "Do not fallback to local `ALL_RECIPES` on detail API failure."
  - "Show share-entry toast only after detail API success."
  - "Keep all default tests fake/local and network-free."
requirements-completed: [READ-01, READ-02, READ-04, READ-05, VERIFY-01]
requirements-supported: [VERIFY-02]
duration: 45 min
completed: 2026-06-24
merged: 2026-06-24
merge_commit: 815fef9
commit: 6ffb78b3309b93d77b20cd28db386406a4f89ceb
---

# Phase 11 Plan 11-01: Detail API Read Summary

**The detail page now loads recipes from the real recipes detail API path and exposes controlled loading, retry, and return behavior without mutating local user data on failure.**

## Accomplishments

- Added `fetchRecipeById(id)` to `apps/miniapp/src/services/recipes-api.ts`.
- Reused the existing `requestJson()` helper, `joinApiUrl()`, injected request pattern, and DTO mapper.
- Converted `detail.vue` from local `findRecipeById(id)` lookup to async `recipesApi.fetchRecipeById(recipeId)`.
- Added detail loading, retryable error, and smart return UI states.
- Preserved favorite loading and result-page `pendingDetailInput` coverage context.
- Limited grouped `已有` / `还差` display to result-page entry by checking the previous route.
- Moved `from=share` toast to the API success path.
- Updated fake/local tests for detail success, encoded ids, HTTP 404/500, request failure, invalid payload, mapper failure, share path, history URL, and local data preservation.

## Task Commits

1. **Task T1: Add fetchRecipeById to the recipes API client** - `6ffb78b` (`feat: 接入详情页真实菜谱接口`)
2. **Task T2: Convert detail page to async API loading** - `6ffb78b` (`feat: 接入详情页真实菜谱接口`)
3. **Task T3: Add detail loading, retry, and smart return UI states** - `6ffb78b` (`feat: 接入详情页真实菜谱接口`)
4. **Task T4: Update fake/local tests for API-driven detail behavior** - `6ffb78b` (`feat: 接入详情页真实菜谱接口`)

## Verification

- `npm --prefix apps/miniapp run type-check` - passed.
- `npx tsx apps/miniapp/tests/recipes-api.test.ts` - passed, 33 passed / 0 failed.
- `npx tsx apps/miniapp/tests/e2e.test.ts` - passed, 38 passed / 0 failed.
- `npx tsx apps/miniapp/tests/matcher.test.ts` - passed, 10 passed / 0 failed.

## Deviations from Plan

- The detail error branch wraps `EmptyState` and renders retry/return actions next to it instead of using an `EmptyState` slot, because the current component does not render slots.

## Notes for Next Plan

- Favorites can now navigate by local recipe id and rely on the detail page to load `GET /api/recipes/:id`.
- `recipesApi.fetchMatchReadyRecipes()` remains the intended favorites display data source for Plan 11-02.
- History should remain local snapshot based and continue routing to `/pages/detail/detail?id=${recipeId}`.
- Formal release prerequisite documentation remains deferred by Phase 11 context D-25 through D-28.

## Self-Check: PASSED

- `detail.vue` no longer imports or calls `findRecipeById`.
- Shared detail paths use `fetchRecipeById(id)`.
- Detail API failures show retryable UI and do not auto-return.
- No API failure path clears favorites, history, or drafts.
- Tests remain fake/local and do not call live network.

---
*Phase: 11-api-read-views-verification*
*Plan: 11-01-detail-api-read*
*Completed: 2026-06-24*
