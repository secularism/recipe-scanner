---
phase: 10-miniapp-api-generation
plan: 10-02-result-api-generation
type: execute
wave: 2
depends_on: [10-01-miniapp-recipes-client-mapper]
autonomous: true
requirements: [GENAPI-01, GENAPI-02, GENAPI-03, GENAPI-04]
requirements_addressed: [GENAPI-01, GENAPI-02, GENAPI-03, GENAPI-04]
files_modified:
  - apps/miniapp/src/pages/result/result.vue
  - apps/miniapp/tests/e2e.test.ts
  - apps/miniapp/tests/matcher.test.ts
  - apps/miniapp/tests/recipes-api.test.ts
must_haves:
  truths:
    - "GENAPI-01: result page fetches real recipes from the API before running the existing matcher."
    - "GENAPI-02: result page has distinct loading, error, retry, result, and empty-match states."
    - "GENAPI-03: `换一换` uses the successful in-memory API recipe pool and does not repeat the current top recipe when alternatives exist."
    - "GENAPI-04: local history writes only after API success and matcher success, using a public `slug || legacyId` recipe id produced by the mapper."
    - "D-01: the result page requests real recipes after it opens and reads `globalData.pendingInput`."
    - "D-02: the generator page does not own recipes API loading, error, or retry state in Phase 10."
    - "D-03: matcher only runs after the real recipe pool is available."
    - "D-04: API failure displays an error state with retry."
    - "D-05: API failure must not fall back to local `ALL_RECIPES`."
    - "D-06: failed requests must not write history or mutate local favorites, history, or draft data."
    - "D-07: result page fetches the match-ready recipes list once per result page session."
    - "D-08: generate and `换一换` reuse the current in-memory real recipe pool."
    - "D-09: `换一换` avoids repeating the current top recipe."
    - "D-10: do not add TTL, background refresh, or global cache in Phase 10."
    - "D-11: local history is written only after API succeeds and matcher returns a first result."
    - "D-13: no history record is written for API failure or empty matcher results."
---

# Plan 10-02: Result Page API-backed Generation

<objective>
Wire the Phase 10 miniapp recipes client into `result.vue` so the result page reads `globalData.pendingInput`, fetches `GET /api/recipes?include=matchFields`, maps the response to the existing `Recipe` type, runs the existing matcher against that real recipe pool, and supports loading, error, retry, empty, history, detail navigation, and `换一换` behavior without introducing any local fallback on API failure.
</objective>

<must_haves>
<truths>
- GENAPI-01 is satisfied when the result page awaits the recipes API pool before calling `generateRecipe(input, 3, recipePool)`.
- GENAPI-02 is satisfied when loading, API error with retry, empty-match, and result states are represented as separate template branches.
- GENAPI-03 is satisfied when `reshuffle()` calls `shuffleResult(currentId, input, 10, recipePool)` and avoids repeating the current top recipe if alternatives exist.
- GENAPI-04 is satisfied when history records are written only after API success and matcher success, with `recipeId` from mapped `Recipe.id`.
- D-01: request real recipes after the result page opens and after `globalData.pendingInput` is read.
- D-02: do not move API loading state to the generator page.
- D-03: show loading before recipes are available and run matcher only after fetch success.
- D-04: API failure displays an error state with retry.
- D-05: do not fall back to local `ALL_RECIPES` when API fails.
- D-06: failed requests must not write generation history and must not mutate favorites, history, or draft data.
- D-07: fetch the match-ready recipes list once per result page session; retry may fetch again after a failed attempt.
- D-08: use the same successful in-memory pool for initial generation and `换一换`.
- D-09: preserve current no-repeat `换一换` behavior.
- D-10: do not add TTL, background refresh, or global cache.
- D-11: history write happens only after API succeeds and matcher returns a first result.
- D-13: no history write for API failure or empty matcher results.
- Phase 11 owns detail page, favorites page, and history page API-driven reads; this plan must not change those pages.
</truths>
</must_haves>

<tasks>
<task id="T1" type="execute">
<title>Convert result page generation to an async API-backed flow</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- apps/miniapp/src/pages/result/result.vue
- apps/miniapp/src/services/recipes-api.ts
- apps/miniapp/src/services/generator.ts
- apps/miniapp/src/stores/history.ts
- apps/miniapp/src/components/EmptyState.vue
</read_first>
<files>
- apps/miniapp/src/pages/result/result.vue
</files>
<action>
Update `apps/miniapp/src/pages/result/result.vue` so `onLoad` reads `getApp().globalData.pendingInput`, clears it, stores it in `input`, and calls an async `loadAndGenerate()` function. Add refs for the successful recipe pool, loading state, and error message. `loadAndGenerate()` must set loading true, clear error, call the default recipes API client's match-ready fetch method, store the mapped `Recipe[]` pool in memory, then call `generateRecipe(input.value, 3, recipePool.value)`. It must write local history through `histStore.addIfFresh()` only when results length is greater than zero. It must catch API/client/mapper errors, set an error message, clear `results`, and avoid history writes. Do not import `ALL_RECIPES` in `result.vue`.
</action>
<acceptance_criteria>
- `result.vue` imports the recipes API client or fetch function from `apps/miniapp/src/services`.
- `result.vue` does not import `ALL_RECIPES` or call `generateRecipe(input)` without a recipe pool after this plan.
- `loadAndGenerate()` calls the API client before calling `generateRecipe`.
- API failure sets a visible error state and does not call `histStore.addIfFresh`.
- Empty matcher results do not call `histStore.addIfFresh`.
- Successful matcher results call `histStore.addIfFresh` once for the top result using `top.recipe.id`.
- The generator page remains unchanged in this plan.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T2" type="execute">
<title>Add loading, error, retry, and empty-match UI states</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- apps/miniapp/src/pages/result/result.vue
- apps/miniapp/src/components/EmptyState.vue
- apps/miniapp/src/uni.scss
</read_first>
<files>
- apps/miniapp/src/pages/result/result.vue
</files>
<action>
Update the `result.vue` template so it renders these mutually exclusive states: loading while the API request is pending; error when the request or mapping fails; results when `hasResults` is true; empty-match when API succeeds but matcher returns no results. The loading branch should use existing page styling and `uni-icons` if an icon is needed. The error branch should reuse `EmptyState` or result-page-local styling, show a retry action that calls `loadAndGenerate()`, and include a back action that calls `goBack()`. The empty-match branch should keep the existing "没有找到匹配的菜谱" copy and back action. Use existing CSS variables, rpx spacing in multiples of 4, no emoji, no Tailwind classes, and no visible technical explanation of API internals.
</action>
<acceptance_criteria>
- The template has a loading branch that is shown when `loading` is true.
- The template has an error branch that is shown when `errorMessage` is non-empty and `loading` is false.
- The error branch has a retry tap handler wired to `loadAndGenerate`.
- The error branch has a back/modify action wired to `goBack`.
- The existing empty-match copy is still shown only when API succeeded and `results` is empty.
- All new spacing values in `result.vue` SCSS use rpx values divisible by 4.
- No emoji characters are added to UI code.
- No Tailwind class names are introduced.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T3" type="execute">
<title>Reuse the API recipe pool for reshuffle and detail navigation</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- apps/miniapp/src/pages/result/result.vue
- apps/miniapp/src/services/generator.ts
- apps/miniapp/src/types/recipe.ts
</read_first>
<files>
- apps/miniapp/src/pages/result/result.vue
</files>
<action>
Update `reshuffle()` so it requires both `input.value` and a non-empty in-memory recipe pool, then calls `shuffleResult(currentId, input.value, 10, recipePool.value)`. Preserve the current behavior of replacing the first result and removing duplicates from the remaining list. If there is no alternative result, keep the existing toast behavior or an equivalent non-technical toast. Keep `openDetail()` navigation path as `/pages/detail/detail?id=${r.recipe.id}` because Phase 11 will make detail API-driven, and mapped ids already use public `slug || legacyId`.
</action>
<acceptance_criteria>
- `reshuffle()` passes the in-memory API recipe pool to `shuffleResult`.
- `reshuffle()` does not call the API client again.
- `reshuffle()` does not import or use `ALL_RECIPES`.
- If `shuffleResult` returns a recipe already present in lower results, the duplicate is removed from lower results.
- `openDetail()` still navigates with `r.recipe.id`.
- Detail page, favorites page, and history page files are not modified by this plan.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T4" type="execute">
<title>Verify Phase 10 generation behavior and full miniapp gate</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- apps/miniapp/tests/recipes-api.test.ts
- apps/miniapp/tests/matcher.test.ts
- apps/miniapp/tests/e2e.test.ts
- apps/miniapp/package.json
</read_first>
<files>
- apps/miniapp/tests/recipes-api.test.ts
- apps/miniapp/tests/matcher.test.ts
- apps/miniapp/tests/e2e.test.ts
</files>
<action>
Extend or adjust fake/local tests so Phase 10 behavior is covered without live network. Keep mapper/client coverage in `recipes-api.test.ts`. Keep matcher ranking coverage in `matcher.test.ts` using explicit local fixture pools. Keep e2e user-flow coverage in `e2e.test.ts`, updating generator/shuffle calls to explicit local pools where useful. Add assertions that generator helpers can return empty results from an empty injected pool and that shuffle avoids the current top recipe when an alternative exists. Do not add automated tests that call `http://47.96.36.31`.
</action>
<acceptance_criteria>
- `recipes-api.test.ts` covers client success, HTTP error, request failure, non-array response, mapper defaults, and missing public id rejection.
- `matcher.test.ts` passes with explicit local recipe pools and does not require network.
- `e2e.test.ts` passes with explicit local recipe pools and does not require network.
- At least one test asserts `generateRecipe(input, 3, [])` returns `[]`.
- At least one test asserts `shuffleResult(currentId, input, 10, fixturePool)` does not return `currentId` when another candidate exists.
- No default test calls the live development API host.
- The full Phase 10 miniapp verification gate is attempted and results are recorded in the implementation summary.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
- `npx tsx apps/miniapp/tests/recipes-api.test.ts`
- `npx tsx apps/miniapp/tests/e2e.test.ts`
- `npx tsx apps/miniapp/tests/matcher.test.ts`
- `npm --prefix apps/miniapp run build:mp-weixin`
</verify>
</task>
</tasks>

<threat_model>
<threat severity="high">
The result page could write history for failed API requests or empty matcher results, polluting local history with recipes the user never received. Mitigation: call `histStore.addIfFresh` only inside the successful non-empty matcher branch.
</threat>
<threat severity="high">
The result page could hide real API integration failures by falling back to local recipes. Mitigation: `result.vue` must not import `ALL_RECIPES`, and the error branch must be visible when the API request fails.
</threat>
<threat severity="medium">
Repeated `换一换` taps could fetch repeatedly or shift the recommendation pool mid-session. Mitigation: fetch once into `recipePool` after page load and reuse it for shuffle.
</threat>
<threat severity="medium">
WeChat release could fail later because the current development API is HTTP and not a configured request domain. Mitigation: Phase 10 keeps the host centralized; Phase 11 owns HTTPS/request domain release documentation.
</threat>
</threat_model>

<verification>
Run the full miniapp gate before committing Phase 10 implementation:

1. `npm --prefix apps/miniapp run type-check`
2. `npx tsx apps/miniapp/tests/recipes-api.test.ts`
3. `npx tsx apps/miniapp/tests/e2e.test.ts`
4. `npx tsx apps/miniapp/tests/matcher.test.ts`
5. `npm --prefix apps/miniapp run build:mp-weixin`

If a command fails because of a pre-existing tooling issue documented in Phase 9, fix it when it blocks Phase 10 tests or document the remaining blocker in the Phase 10 SUMMARY.
</verification>

<success_criteria>
- Result page fetches real match-ready recipes before matching.
- Loading, API error with retry, result, and empty-match states are distinct.
- API failures do not write local history and do not mutate favorites, history, or draft data.
- `换一换` reuses the successful in-memory API recipe pool.
- History records use public mapped recipe ids.
- Detail, favorites, and history API-driven reads remain deferred to Phase 11.
- Full miniapp verification gate is attempted before the implementation commit.
</success_criteria>
