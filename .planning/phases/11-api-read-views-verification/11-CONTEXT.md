# Phase 11: api-read-views-verification - Context

**Gathered:** 2026-06-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 11 finishes the v1.1 recipes read integration for the miniapp. It changes the detail page, favorites page display, and history-to-detail navigation so recipe data comes from the real recipes API, while preserving local favorites, local history, local drafts, and the existing matcher behavior.

This phase does not add remote favorites/history writes, login, user identity, OCR, AI generation, server-side matching, a local recipe fallback on API failure, a new backend batch endpoint, or official release documentation. The current deployment target is at most an experience version; formal HTTPS/request-domain release documentation is intentionally deferred.

</domain>

<decisions>
## Implementation Decisions

### Detail Page API Loading and Sharing
- **D-01:** The detail page must load recipe data through the real detail API, using the public `id`/`slug` from the existing `id` route query.
- **D-02:** The detail page should show a full-page loading state while `GET /api/recipes/:id` is in flight.
- **D-03:** Network failure, 404, mapper failure, or other detail API failure must show an `EmptyState`-style full-page error with retry. The page must not toast-and-auto-return.
- **D-04:** Detail error UI must provide retry plus an intelligent return action: normal navigation should prefer `uni.navigateBack()`, while share entry or lack of a previous page should navigate to `/pages/index/index`.
- **D-05:** When the detail page is opened with `from=share`, show the current lightweight "好友分享的菜谱" toast only after the recipe API succeeds. Do not show this toast on failed loads.
- **D-06:** Result-page-to-detail navigation is the only entry that preserves matching context. Continue using `globalData.pendingDetailInput` for the current input and coverage; after the API recipe loads, show `契合 X%` and grouped `已有` / `还差` sections.
- **D-07:** Share, favorites, and history entries should show ordinary recipe detail after API success. They should not restore or synthesize `已有` / `还差` groups.

### Favorites Page API Display
- **D-08:** Favorites storage remains local id-only storage. Do not introduce remote favorite writes or remote sync in Phase 11.
- **D-09:** The favorites page should load the match-ready recipes list with the existing `fetchMatchReadyRecipes()` API path, then filter and order recipes by local favorite ids.
- **D-10:** Do not add a backend batch recipe endpoint or per-favorite detail request loop for favorites display in Phase 11.
- **D-11:** If a local favorite id is missing from the API recipe pool, preserve the local id and render a "暂不可用" placeholder card. Do not hide it silently and do not auto-delete it.
- **D-12:** The unavailable favorite placeholder may expose a local "取消收藏" action that removes only that local id.
- **D-13:** If the whole favorites-page API request fails, show an error/retry state while preserving the local favorite count and making it clear favorites are not lost. Do not fallback to `ALL_RECIPES`, and do not render the failure as an empty-favorites state.

### History Page Boundary
- **D-14:** History storage remains local and continues to store the existing snapshot fields such as `recipeId`, `recipeName`, `input`, `missingCount`, and `generatedAt`.
- **D-15:** The history list should keep showing local snapshot data. It should not refresh recipe names or unavailable status through the recipes list API in Phase 11.
- **D-16:** Clicking a history item continues to navigate to `/pages/detail/detail?id=${recipeId}`; the detail page then loads the real recipe through `fetchRecipeById(id)`.
- **D-17:** If history-to-detail loading fails, the detail page handles the error and retry. The history record must not be modified or auto-deleted.
- **D-18:** History entries do not restore `已有` / `还差` groups or coverage in Phase 11.

### API Client and Testing
- **D-19:** Extend the existing recipes API client with `fetchRecipeById(id)` only. Reuse the existing request helper and mapper path; do not add caching, batch detail fetches, or new backend query shapes.
- **D-20:** `fetchRecipeById(id)` should accept public ids produced by the existing mapper (`slug || legacyId`) and should not expose or depend on database UUIDs in miniapp business logic.
- **D-21:** Default tests must remain fake/local and must not depend on `http://47.96.36.31` or any live network.
- **D-22:** Extend `apps/miniapp/tests/recipes-api.test.ts` to cover `fetchRecipeById(id)` success, 404/500, request failure, non-object/invalid payload, and mapper failure.
- **D-23:** Update existing `tsx` e2e-style tests to simulate the Phase 11 behaviors: share path uses API-driven detail ids, detail failures do not clear favorites/history, history click still navigates with `recipeId`, favorites preserve ids when API data is missing, and API failures do not fallback to local recipes.
- **D-24:** Do not introduce a new component test stack for Phase 11. Continue using existing plain `tsx` tests plus the miniapp verification gate.

### Release Documentation Boundary
- **D-25:** Do not add a README section, release checklist document, or other product/project doc for WeChat official release prerequisites in Phase 11.
- **D-26:** Treat official release documentation as deferred because the operator already understands HTTPS/request-domain/ICP filing requirements, is currently filing the domain, and does not intend a formal release yet.
- **D-27:** Experience-version work may continue as long as API base URL remains centralized and replaceable, and default automated tests remain network-free.
- **D-28:** If a plan needs to reference `VERIFY-04`, it must respect this decision: capture the deferral in planning/SUMMARY artifacts only, not in README or new docs.

### the agent's Discretion
- Choose the exact detail/favorites loading and error UI implementation details that fit existing `EmptyState`, `uni-icons`, and page styling.
- Choose whether favorites page API state lives in the page component or a small composable, as long as local storage remains id-only and files stay within project line limits.
- Choose the exact helper names for id-to-recipe indexing and unavailable favorite view models.
- Choose precise wording for loading/error/retry text, as long as it does not imply local data was deleted.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Scope
- `.planning/PROJECT.md` - v1.1 scope, out-of-scope boundaries, current milestone constraints, and local-data preservation goals.
- `.planning/REQUIREMENTS.md` - READ-01 through READ-05 and VERIFY-01 through VERIFY-04 are the Phase 11 requirement ids; VERIFY-04 is constrained by D-25 through D-28 above.
- `.planning/ROADMAP.md` - Phase 11 goal, success criteria, and v1.1 phase ordering.
- `.planning/STATE.md` - current project memory and Phase 10 merge status.

### Prior Phase Contracts
- `.planning/phases/09-recipes-api-contract/09-CONTEXT.md` - locked backend API contract, `include=matchFields`, public id strategy, DTO defaults, and `PUBLISHED` filtering.
- `.planning/phases/09-recipes-api-contract/09-SUMMARY.md` - completed backend contract files and verification status.
- `.planning/phases/10-miniapp-api-generation/10-CONTEXT.md` - locked miniapp API client, mapper, no-fallback, and network-free test decisions.
- `.planning/phases/10-miniapp-api-generation/10-01-SUMMARY.md` - created API config/client/mapper and explicit recipe-pool support.
- `.planning/phases/10-miniapp-api-generation/10-02-SUMMARY.md` - result page API-backed generation behavior and verification status.

### Backend API Contract
- `apps/api/src/recipes/recipes.controller.ts` - live `GET /api/recipes` and `GET /api/recipes/:id` route shape.
- `apps/api/src/recipes/recipes.service.ts` - `PUBLISHED` filtering, `legacyId`/`slug` lookup, `include=matchFields`, and detail serializer path.
- `apps/api/src/recipes/recipes.dto.ts` - backend DTO fields consumed by the miniapp mapper.

### Miniapp API and Data Mapping
- `apps/miniapp/src/config/api.ts` - centralized API base URL and URL joining.
- `apps/miniapp/src/services/recipes-api.ts` - existing injectable recipes API client to extend with `fetchRecipeById(id)`.
- `apps/miniapp/src/services/recipe-mapper.ts` - backend DTO to frontend `Recipe` conversion and mapper error behavior.
- `apps/miniapp/src/types/recipe.ts` - `Recipe`, `GenerateInput`, `HistoryItem`, and `MatchResult` target types.

### Miniapp Read Views
- `apps/miniapp/src/pages/detail/detail.vue` - detail page currently uses local `findRecipeById`, preserves result-page matching context, toggles favorites, and handles share path.
- `apps/miniapp/src/pages/favorites/favorites.vue` - favorites page currently renders `favStore.list` from local recipe lookup.
- `apps/miniapp/src/pages/history/history.vue` - history page currently renders local snapshots and navigates to detail by `recipeId`.
- `apps/miniapp/src/pages/result/result.vue` - result page writes local history and passes `pendingDetailInput` before detail navigation.
- `apps/miniapp/src/stores/favorites.ts` - local favorite id storage and current local recipe-derived list.
- `apps/miniapp/src/stores/history.ts` - local history snapshot storage and no-remote-write boundary.
- `apps/miniapp/src/components/EmptyState.vue` - reusable empty/error state visual pattern.
- `apps/miniapp/src/components/RecipeCard.vue` - existing card styling patterns for recipe-like cards.
- `apps/miniapp/src/data/recipes.ts` - local fixture recipe library; must not be used as runtime API failure fallback.

### Tests and Verification
- `apps/miniapp/tests/recipes-api.test.ts` - fake-request API client and mapper coverage to extend.
- `apps/miniapp/tests/e2e.test.ts` - existing script-based user-flow assertions to update for API-driven detail/favorites/history behavior.
- `apps/miniapp/tests/matcher.test.ts` - matcher/generator ranking should remain local/fake and network-free.
- `apps/miniapp/package.json` - miniapp scripts and verification command entry points.
- `apps/miniapp/tsconfig.json` - TypeScript alias configuration relevant to `tsx` tests.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `recipesApi.fetchMatchReadyRecipes()` already loads and maps the match-ready full recipe pool; favorites can reuse this instead of adding backend batch APIs.
- `createRecipesApiClient({ request })` already supports fake request injection; `fetchRecipeById(id)` should preserve that test seam.
- `mapRecipeDtoToRecipe()` already maps the detail-ready backend DTO into the miniapp `Recipe` type and throws mapper errors for missing public ids.
- `EmptyState.vue` provides an existing visual pattern for full-page empty/error states.
- `result.vue` already owns `pendingDetailInput` and can remain the only source of detail matching context.

### Established Patterns
- Public miniapp recipe identity is `slug || legacyId`; database UUID remains backend-internal.
- Runtime API failures should not fallback to local `ALL_RECIPES`; automated tests may keep local recipes as fixtures.
- Favorites are local ids persisted under `recipe-favorites`.
- History records are local snapshots persisted under `recipe-history`.
- Existing tests are plain `tsx` scripts, not a component-test framework.
- UI should use `uni-icons`, `var(--color-*)` variables, and rpx spacing that follows project conventions.

### Integration Points
- Extend `apps/miniapp/src/services/recipes-api.ts` with `fetchRecipeById(id)`, using `requestJson('recipes/${encodedId}', ...)`.
- Update `apps/miniapp/src/pages/detail/detail.vue` from local lookup to async API loading with loading/error/retry/smart-return states.
- Update `apps/miniapp/src/pages/favorites/favorites.vue` so it loads local favorite ids, fetches the real recipe pool, derives available cards and unavailable placeholders, and never mutates ids on API failure.
- Keep `apps/miniapp/src/pages/history/history.vue` mostly local; it only needs to preserve navigation to API-driven detail.
- Avoid moving local id storage responsibility out of `favorites.ts` / `history.ts` unless a small page-level view model is clearly cleaner.

</code_context>

<specifics>
## Specific Ideas

- Detail failure should feel like a controlled state, not like the page disappeared.
- Share-success toast remains lightweight, but only after API success.
- Favorites count should reflect local ids even if the API fails; users should never infer their favorites were deleted by a network issue.
- Unavailable favorite placeholders should show enough id context for manual cleanup.
- Formal WeChat release docs are intentionally not part of this phase; current target is experience-version use while domain filing proceeds.

</specifics>

<deferred>
## Deferred Ideas

- Remote favorites/history writes and cross-device sync remain future work.
- Backend batch recipe lookup for ids can be considered later if recipe volume or favorite counts make the full match-ready list inefficient.
- Refreshing history list recipe names/status from API is deferred.
- Restoring historical `已有` / `还差` groups or coverage from history entries is deferred.
- Official release checklist documentation for HTTPS, request合法域名, and ICP/domain readiness is deferred until formal release preparation.
- API caching, TTL, and stale-while-revalidate behavior are deferred.

</deferred>

---

*Phase: 11-api-read-views-verification*
*Context gathered: 2026-06-24*
