---
phase: 10-miniapp-api-generation
plan: 10-02-result-api-generation
subsystem: miniapp
tags: [uni-app, result-page, api-generation, loading-state, verification]
requires:
  - plan: 10-01-miniapp-recipes-client-mapper
    provides: Recipes API client, mapper, and explicit recipe-pool generator helpers
provides:
  - API-backed result page generation flow
  - Loading, error, retry, result, and empty-match result states
  - In-memory API recipe pool reuse for `换一换`
  - Local history writes only after API success and matcher success
  - Miniapp verification gate restored for Phase 10
affects: [phase-11-api-read-views-verification]
tech-stack:
  added: []
  patterns:
    - Result page fetches match-ready recipes before running matcher
    - Retry refetches only after failure while successful shuffle reuses the current in-memory pool
    - Third-party uni-icons runtime assets are resolved from miniapp source to avoid monorepo output paths
key-files:
  created:
    - apps/miniapp/scripts/type-check.cjs
    - apps/miniapp/src/components/uni-icons/uni-icons.vue
    - apps/miniapp/src/components/uni-icons/uniicons.css
    - apps/miniapp/src/components/uni-icons/uniicons.ttf
    - apps/miniapp/src/components/uni-icons/uniicons_file_vue.js
  modified:
    - apps/miniapp/package.json
    - apps/miniapp/src/pages/result/result.vue
    - apps/miniapp/src/pages.json
    - apps/miniapp/tsconfig.json
key-decisions:
  - "Do not import `ALL_RECIPES` in `result.vue`; failed API requests show retryable error UI."
  - "Write local history only when the API request succeeds and matcher returns a top result."
  - "Keep detail, favorites, and history API-driven reads deferred to Phase 11."
  - "Resolve `uni-icons` from `src/components` so mp-weixin build emits legal output paths in the monorepo."
requirements-completed: [GENAPI-01, GENAPI-02, GENAPI-03, GENAPI-04]
requirements-verified: [VERIFY-01, VERIFY-02, VERIFY-03]
duration: 55 min
completed: 2026-06-22
---

# Phase 10 Plan 10-02: Result Page API-backed Generation Summary

**The result page now loads real match-ready recipes from the API, runs the existing matcher against that pool, and exposes clear loading/error/retry behavior without falling back to local recipes.**

## Accomplishments

- Converted `result.vue` to an async API-backed generation flow.
- Added `loading`, `hasLoaded`, `errorMessage`, and `recipePool` state.
- Added mutually exclusive loading, API error, results, and empty-match template branches.
- Wired retry to `loadAndGenerate()` and kept the back action for both error and empty-match states.
- Updated `reshuffle()` to reuse the successful in-memory API recipe pool and avoid repeating the current top recipe.
- Preserved detail navigation with `r.recipe.id`, where ids now come from mapper public ids.
- Ensured history writes only happen after API success and non-empty matcher results.
- Restored the miniapp verification gate by fixing the hoisted `vue-tsc` TypeScript runtime mismatch and the monorepo `uni-icons` output path issue.

## Task Commits

1. **Task T1: Convert result page generation to an async API-backed flow** - `93302a1` (`feat: 接入结果页真实菜谱生成`)
2. **Task T2: Add loading, error, retry, and empty-match UI states** - `93302a1` (`feat: 接入结果页真实菜谱生成`)
3. **Task T3: Reuse the API recipe pool for reshuffle and detail navigation** - `93302a1` (`feat: 接入结果页真实菜谱生成`)
4. **Task T4: Verify Phase 10 generation behavior and full miniapp gate** - `93302a1` (`feat: 接入结果页真实菜谱生成`) and `a78b0a2` (`fix: 修复小程序图标组件构建`)

## Verification

- `npm --prefix apps/miniapp run type-check` - passed.
- `npx tsx apps/miniapp/tests/recipes-api.test.ts` - passed, 24 passed / 0 failed.
- `npx tsx apps/miniapp/tests/e2e.test.ts` - passed, 33 passed / 0 failed.
- `npx tsx apps/miniapp/tests/matcher.test.ts` - passed, 10 passed / 0 failed.
- `npm --prefix apps/miniapp run build:mp-weixin` - passed.

## Deviations from Plan

- Added `apps/miniapp/scripts/type-check.cjs` and changed the miniapp `type-check` script so the root `vue-tsc` process resolves the miniapp-local TypeScript version instead of the hoisted incompatible TypeScript runtime.
- Added a local `src/components/uni-icons` copy and changed `pages.json` easycom mapping from hoisted `@dcloudio/uni-ui` to the local component. This fixes the existing mp-weixin build blocker where uni generated illegal `../../node-modules/...` output file names inside the monorepo.
- Excluded `src/components/uni-icons/**` from `vue-tsc` roots because the copied third-party component is a JavaScript SFC runtime asset, while it still participates in the actual mp-weixin build.

## Issues Encountered

- The previous Phase 9 miniapp tooling blockers were all exercised by Phase 10 verification:
  - `vue-tsc` failed before assertions because it picked an incompatible hoisted TypeScript version.
  - `mp-weixin` build failed when easycom resolved `uni-icons` from the root `node_modules`.
- The final `mp-weixin` build still prints Dart Sass legacy API deprecation warnings from the uni toolchain, but the command exits successfully.

## Next Phase Readiness

Phase 11 can focus on detail, favorites, and history reads. It can reuse the centralized config, API client pattern, mapper behavior, and public ids created in Phase 10.

## Self-Check: PASSED

- GENAPI-01, GENAPI-02, GENAPI-03, and GENAPI-04 are satisfied.
- API failure does not fall back to `ALL_RECIPES`.
- API failure and empty matcher results do not write history.
- Full miniapp verification gate passed before the documentation commit.

---
*Phase: 10-miniapp-api-generation*
*Plan: 10-02-result-api-generation*
*Completed: 2026-06-22*
