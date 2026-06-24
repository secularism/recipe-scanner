---
phase: 11-api-read-views-verification
plan: 11-01-detail-api-read
type: execute
wave: 1
depends_on: []
autonomous: true
requirements: [READ-01, READ-02, READ-04, READ-05, VERIFY-01, VERIFY-02]
requirements_addressed: [READ-01, READ-02, READ-04, READ-05, VERIFY-01, VERIFY-02]
files_modified:
  - apps/miniapp/src/services/recipes-api.ts
  - apps/miniapp/src/pages/detail/detail.vue
  - apps/miniapp/tests/recipes-api.test.ts
  - apps/miniapp/tests/e2e.test.ts
must_haves:
  truths:
    - "READ-01: detail page reads recipe data through `fetchRecipeById(id)` instead of local `findRecipeById`."
    - "READ-02: shared detail paths such as `/pages/detail/detail?id=mapo-tofu&from=share` load through `GET /api/recipes/:id`."
    - "READ-04: history clicks can keep navigating to `/pages/detail/detail?id=${recipeId}` because the detail page owns the real API fetch."
    - "READ-05: detail API failures must not clear or mutate favorites, history, or draft data."
    - "VERIFY-01: recipes API client tests cover detail success and error paths with fake requests."
    - "VERIFY-02: e2e-style tests preserve matcher/local fixture coverage while adding API-driven detail path assertions."
    - "D-01: detail page loads recipe data through the real detail API using the public `id`/`slug` from the existing route query."
    - "D-02: detail page shows full-page loading while `GET /api/recipes/:id` is in flight."
    - "D-03: detail API failure shows a full-page retryable error instead of toast-and-auto-return."
    - "D-04: detail error UI provides retry plus intelligent return to previous page or `/pages/index/index` for share/no-history entry."
    - "D-05: `from=share` toast appears only after API success."
    - "D-06: only result-page entry preserves `pendingDetailInput` match context."
    - "D-07: share, favorites, and history entries show ordinary detail after API success and do not restore `已有` / `还差` groups."
    - "D-19: add only `fetchRecipeById(id)`; do not add cache, batch fetches, or backend query shape changes."
    - "D-20: `fetchRecipeById(id)` accepts public ids from the mapper (`slug || legacyId`) and does not expose database UUIDs to miniapp business logic."
    - "D-21: default tests remain fake/local and must not depend on live network."
    - "D-22: `recipes-api.test.ts` covers `fetchRecipeById(id)` success, 404/500, request failure, invalid payload, and mapper failure."
    - "D-23: e2e-style tests simulate share/detail ids, local data preservation on failures, history detail navigation, favorites missing ids, and no local fallback."
    - "D-24: do not introduce a new component test stack; continue using existing plain `tsx` tests plus the miniapp gate."
---

# Plan 11-01: Detail API Read

<objective>
Move the miniapp detail page from local recipe lookup to the real recipes detail API. Add `fetchRecipeById(id)` to the existing recipes API client, keep fake/local tests, and update the detail page so shared paths, result-page navigation, and history/favorites navigation all resolve through the same API-driven detail loading flow without mutating local data on failure.
</objective>

<must_haves>
<truths>
- READ-01 is satisfied when `apps/miniapp/src/pages/detail/detail.vue` no longer imports or calls `findRecipeById`.
- READ-02 is satisfied when `/pages/detail/detail?id=mapo-tofu&from=share` can load `mapo-tofu` through `GET /api/recipes/mapo-tofu`.
- READ-04 is supported when history can keep passing `recipeId` to the detail page and the detail page resolves that id through the API.
- READ-05 is satisfied when failed detail API requests do not call `favStore.toggle`, `histStore.remove`, `histStore.clear`, draft clearing, or any local storage write.
- VERIFY-01 is satisfied when fake-request tests cover `fetchRecipeById(id)` success, HTTP failure, request failure, non-object/invalid response, and mapper failure.
- VERIFY-02 is satisfied when existing e2e-style tests keep matcher/local fixture ranking coverage and add share/detail path assertions without a live network.
- D-01: use the public route query `id` as the detail API id.
- D-03: render controlled loading/error states instead of auto-returning on failure.
- D-04: error UI has retry plus intelligent return.
- D-05: share toast is shown only after API success.
- D-06: preserve `pendingDetailInput` context only for result-page entry.
- D-07: share, favorites, and history entries show ordinary detail after success.
- D-19: client extension is limited to `fetchRecipeById(id)`.
- D-21: default tests remain fake/local and do not call `http://47.96.36.31`.
</truths>
</must_haves>

<tasks>
<task id="T1" type="execute">
<title>Add fetchRecipeById to the recipes API client</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- .planning/phases/09-recipes-api-contract/09-CONTEXT.md
- apps/miniapp/src/services/recipes-api.ts
- apps/miniapp/src/services/recipe-mapper.ts
- apps/api/src/recipes/recipes.controller.ts
- apps/api/src/recipes/recipes.service.ts
- apps/miniapp/tests/recipes-api.test.ts
</read_first>
<files>
- apps/miniapp/src/services/recipes-api.ts
- apps/miniapp/tests/recipes-api.test.ts
</files>
<action>
Extend `createRecipesApiClient()` so the returned client exposes `fetchRecipeById(id: string)`. The method must call the existing request helper with `recipes/${encodeURIComponent(id)}`, accept only 2xx responses, require a single object payload, map it with `mapRecipeDtoToRecipe`, and wrap request/mapping failures in `RecipesApiError`. Keep `fetchMatchReadyRecipes()` behavior unchanged. Do not add cache, batch ids, backend UUID handling, or imports from `apps/miniapp/src/data/recipes.ts`.
</action>
<acceptance_criteria>
- `createRecipesApiClient({ request }).fetchRecipeById('mapo-tofu')` resolves to a mapped `Recipe` when fake request returns a valid full DTO.
- The request URL for id `mapo-tofu` ends with `/recipes/mapo-tofu`.
- The request URL encodes ids with special characters through `encodeURIComponent`.
- Fake 404 or 500 status rejects with `RecipesApiError`.
- Fake request failure rejects with `RecipesApiError`.
- Fake 200 non-object payload rejects with `RecipesApiError`.
- Fake 200 DTO missing public id rejects with `RecipesApiError`.
- `recipes-api.ts` still does not import `ALL_RECIPES` or `findRecipeById`.
</acceptance_criteria>
<verify>
- `npx tsx apps/miniapp/tests/recipes-api.test.ts`
</verify>
</task>

<task id="T2" type="execute">
<title>Convert detail page to async API loading</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- apps/miniapp/src/pages/detail/detail.vue
- apps/miniapp/src/services/recipes-api.ts
- apps/miniapp/src/stores/favorites.ts
- apps/miniapp/src/components/EmptyState.vue
- apps/miniapp/src/types/recipe.ts
</read_first>
<files>
- apps/miniapp/src/pages/detail/detail.vue
</files>
<action>
Replace the local `findRecipeById(id)` load in `detail.vue` with an async `loadRecipe()` flow. On page load, read query `id` and `from`, store `fromShare = from === 'share'`, load favorites, read and clear `globalData.pendingDetailInput` only when present, then call `recipesApi.fetchRecipeById(id)`. Add refs for `loading`, `errorMessage`, and the original `recipeId`. On success, set `recipe`, preserve result-page `userInput` and `coverage` if pending detail input existed, and show the share toast only when `fromShare` is true. On failure, leave `recipe` null, set a user-facing error message, and do not navigate back automatically.
</action>
<acceptance_criteria>
- `detail.vue` does not import `findRecipeById` from `@/data`.
- `detail.vue` imports `recipesApi` or an equivalent client from `@/services`.
- `onLoad` calls an async loader for the query `id`.
- API success sets `recipe.value` from the mapped API result.
- API failure sets `errorMessage` and does not call `uni.navigateBack()` from the catch path.
- `favStore.load()` still runs before favorite state is displayed.
- `from=share` toast is emitted only after successful API load.
- `pendingDetailInput` is still cleared after being read and only result-page entry shows grouped match context.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T3" type="execute">
<title>Add detail loading, retry, and smart return UI states</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- apps/miniapp/src/pages/detail/detail.vue
- apps/miniapp/src/pages/result/result.vue
- apps/miniapp/src/components/EmptyState.vue
- apps/miniapp/src/uni.scss
</read_first>
<files>
- apps/miniapp/src/pages/detail/detail.vue
</files>
<action>
Update the detail template to render mutually exclusive states: full-page loading while `loading` is true, full-page `EmptyState`-style error when `errorMessage` is set, and the existing detail content when `recipe` is loaded. Add a retry action that calls `loadRecipe()` with the stored id. Add a smart return action that calls `uni.navigateBack()` when there is a previous page and the entry is not a share entry; otherwise call `uni.reLaunch({ url: '/pages/index/index' })` or an equivalent home navigation. Keep ordinary detail content and favorite/share actions available only when `recipe` exists. Use `uni-icons`, `var(--color-*)`, rpx spacing in multiples of 4, and no emoji.
</action>
<acceptance_criteria>
- Loading branch renders before recipe content while detail API is pending.
- Error branch renders retry and return actions when the API fails.
- Retry action calls the same detail API loader again using the original query id.
- Smart return sends share/no-history entry to `/pages/index/index`.
- Normal back path prefers `uni.navigateBack()` when possible.
- Favorite and share buttons are not rendered while `recipe` is null.
- No new Tailwind classes are introduced.
- All new rpx spacing values in `detail.vue` are divisible by 4.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T4" type="execute">
<title>Update fake/local tests for API-driven detail behavior</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- apps/miniapp/tests/recipes-api.test.ts
- apps/miniapp/tests/e2e.test.ts
- apps/miniapp/tests/matcher.test.ts
- apps/miniapp/src/pages/detail/detail.vue
- apps/miniapp/src/stores/favorites.ts
- apps/miniapp/src/stores/history.ts
</read_first>
<files>
- apps/miniapp/tests/recipes-api.test.ts
- apps/miniapp/tests/e2e.test.ts
</files>
<action>
Extend the existing `tsx` tests without introducing a new test framework. In `recipes-api.test.ts`, add fake request coverage for `fetchRecipeById(id)` success and failures from T1. In `e2e.test.ts`, replace local `findRecipeById` assumptions for the share/detail path with an API-driven simulation: the share path carries `id=mapo-tofu`, fake detail API resolves that id, and failure paths do not clear local favorites/history arrays. Keep matcher ranking tests and local fixture generation tests network-free.
</action>
<acceptance_criteria>
- `npx tsx apps/miniapp/tests/recipes-api.test.ts` covers both `fetchMatchReadyRecipes()` and `fetchRecipeById(id)`.
- `e2e.test.ts` no longer treats local `findRecipeById` as proof that shared detail paths work.
- `e2e.test.ts` has an assertion that detail API failure leaves a sample favorites id list unchanged.
- `e2e.test.ts` has an assertion that detail API failure leaves a sample history list unchanged.
- Default tests do not call `http://47.96.36.31`.
- `npx tsx apps/miniapp/tests/matcher.test.ts` still exits 0.
</acceptance_criteria>
<verify>
- `npx tsx apps/miniapp/tests/recipes-api.test.ts`
- `npx tsx apps/miniapp/tests/e2e.test.ts`
- `npx tsx apps/miniapp/tests/matcher.test.ts`
</verify>
</task>
</tasks>

<threat_model>
<threat severity="high">
The detail page could still depend on local `findRecipeById`, making share/history/favorites paths pass locally while real API detail is broken. Mitigation: remove the import and add test assertions that model API-driven detail resolution.
</threat>
<threat severity="high">
API failure could look like local data loss if the detail page auto-returns or clears state. Mitigation: show controlled retryable error UI and never mutate favorites/history/drafts in the failure path.
</threat>
<threat severity="medium">
Share source feedback could show before data is actually loaded, creating a false success signal. Mitigation: show the `from=share` toast only after `fetchRecipeById` succeeds.
</threat>
</threat_model>

<verification>
Run these commands before completing this plan:

1. `npm --prefix apps/miniapp run type-check`
2. `npx tsx apps/miniapp/tests/recipes-api.test.ts`
3. `npx tsx apps/miniapp/tests/e2e.test.ts`
4. `npx tsx apps/miniapp/tests/matcher.test.ts`
</verification>

<success_criteria>
- Detail page uses `fetchRecipeById(id)` and no longer uses local recipe lookup.
- Shared detail paths resolve via the real recipes detail API.
- Detail loading, retryable error, smart return, and success states are distinct.
- Result-page matching context is preserved only for result-page entry.
- API detail failures do not mutate local favorites, history, or draft data.
- Client/detail tests remain fake/local and network-free.
</success_criteria>
