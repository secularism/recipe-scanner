---
phase: 10-miniapp-api-generation
plan: 10-01-miniapp-recipes-client-mapper
subsystem: miniapp
tags: [uni-app, api-client, mapper, matcher, tests]
requires:
  - phase: 09-recipes-api-contract
    provides: Match-ready `GET /api/recipes?include=matchFields` backend DTO contract
provides:
  - Centralized miniapp API base URL config
  - Injectable recipes API client
  - Backend recipe DTO to frontend `Recipe` mapper
  - Explicit recipe-pool support for generator and shuffle helpers
affects: [10-02-result-api-generation, phase-11-api-read-views-verification]
tech-stack:
  added: []
  patterns:
    - API client accepts injected request functions so tests remain network-free
    - Mapper converts backend public ids into existing frontend `Recipe.id`
    - Generator helpers accept explicit recipe pools while preserving local fixture defaults
key-files:
  created:
    - apps/miniapp/src/config/api.ts
    - apps/miniapp/src/services/recipe-mapper.ts
    - apps/miniapp/src/services/recipes-api.ts
    - apps/miniapp/tests/recipes-api.test.ts
  modified:
    - apps/miniapp/src/services/generator.ts
    - apps/miniapp/src/services/index.ts
    - apps/miniapp/tests/matcher.test.ts
    - apps/miniapp/tests/e2e.test.ts
key-decisions:
  - "Use `http://47.96.36.31/api` as the single Phase 10 development API base URL."
  - "Map frontend `Recipe.id` from backend `slug || legacyId`, never from database UUID."
  - "Keep all default tests fake/local by injecting request functions and explicit recipe pools."
requirements-completed: [CLIENT-01, CLIENT-02, CLIENT-03, CLIENT-04]
requirements-supported: [GENAPI-01, GENAPI-03]
duration: 35 min
completed: 2026-06-22
merged: 2026-06-24
merge_commit: 5270b85
---

# Phase 10 Plan 10-01: Miniapp Recipes Client and Mapper Summary

**The miniapp now has a testable recipes API access layer and can run the existing matcher against an injected real recipe pool.**

## Accomplishments

- Added `apps/miniapp/src/config/api.ts` with the centralized development base URL and `joinApiUrl()`.
- Added `recipe-mapper.ts` to map Phase 9 backend DTOs into the existing frontend `Recipe` type.
- Added `recipes-api.ts` with `createRecipesApiClient()`, default `recipesApi`, injected request support, and `RecipesApiError`.
- Parameterized `generateRecipe()` and `shuffleResult()` so callers can pass a real API recipe pool.
- Added fake/local API client and mapper coverage in `recipes-api.test.ts`.
- Updated matcher and e2e tests to cover explicit empty pools and no-repeat shuffle behavior without live network.

## Task Commits

1. **Task T1: Add centralized miniapp API config** - `a95c853` (`feat: 新增小程序 recipes API 客户端`)
2. **Task T2: Create backend DTO to frontend Recipe mapper** - `a95c853` (`feat: 新增小程序 recipes API 客户端`)
3. **Task T3: Add injectable recipes API client** - `a95c853` (`feat: 新增小程序 recipes API 客户端`)
4. **Task T4: Parameterize generator helpers for explicit recipe pools** - `a95c853` (`feat: 新增小程序 recipes API 客户端`)

## Verification

- `npx tsx apps/miniapp/tests/recipes-api.test.ts` - passed, 24 passed / 0 failed.
- `npx tsx apps/miniapp/tests/matcher.test.ts` - passed, 10 passed / 0 failed.
- `npx tsx apps/miniapp/tests/e2e.test.ts` - passed, 33 passed / 0 failed.

## Deviations from Plan

None. The plan stayed inside the API config, mapper, client, generator helper, and test scope.

## Notes for Next Plan

- `recipesApi.fetchMatchReadyRecipes()` is ready for `result.vue`.
- `generateRecipe(input, 3, recipePool)` and `shuffleResult(currentId, input, 10, recipePool)` are the intended result-page integration points.
- API failures intentionally have no local `ALL_RECIPES` fallback.

## Self-Check: PASSED

- CLIENT-01, CLIENT-02, CLIENT-03, and CLIENT-04 are satisfied.
- GENAPI-01 and GENAPI-03 have the required helper support for Plan 10-02.
- Tests do not call `uni.request` or `http://47.96.36.31`.

---
*Phase: 10-miniapp-api-generation*
*Plan: 10-01-miniapp-recipes-client-mapper*
*Completed: 2026-06-22*
