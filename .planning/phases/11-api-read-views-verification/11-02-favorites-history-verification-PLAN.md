---
phase: 11-api-read-views-verification
plan: 11-02-favorites-history-verification
type: execute
wave: 2
depends_on: [11-01-detail-api-read]
autonomous: true
requirements: [READ-03, READ-04, READ-05, VERIFY-02, VERIFY-03, VERIFY-04]
requirements_addressed: [READ-03, READ-04, READ-05, VERIFY-02, VERIFY-03, VERIFY-04]
files_modified:
  - apps/miniapp/src/pages/favorites/favorites.vue
  - apps/miniapp/src/pages/history/history.vue
  - apps/miniapp/src/stores/favorites.ts
  - apps/miniapp/tests/e2e.test.ts
  - apps/miniapp/tests/recipes-api.test.ts
must_haves:
  truths:
    - "READ-03: favorites page keeps local id storage but displays available recipe cards from the real recipes API."
    - "READ-04: history records keep local snapshots and navigate by `recipeId` into the API-driven detail page."
    - "READ-05: network/API failures must not clear favorites, history, or draft data."
    - "VERIFY-02: e2e/matcher tests remain local/fake and preserve matcher ranking coverage."
    - "VERIFY-03: full miniapp verification gate is run before implementation completion."
    - "VERIFY-04: no README or release checklist is added; formal release documentation is deferred by Phase 11 context D-25 through D-28."
    - "D-08: favorites storage remains local id-only storage with no remote favorite writes or remote sync in Phase 11."
    - "D-09: favorites page fetches the match-ready recipes list and filters by local favorite ids."
    - "D-10: do not add a backend batch recipe endpoint or per-favorite detail request loop for favorites display."
    - "D-11: API-missing favorite ids render unavailable placeholders and are not auto-deleted."
    - "D-12: unavailable favorite placeholders may expose a local `取消收藏` action that removes only that local id."
    - "D-13: favorites API failure shows retry/error while preserving local favorite count."
    - "D-14: history storage remains local and keeps existing snapshot fields."
    - "D-15: history list continues showing local snapshots and does not refresh names/status from API."
    - "D-16: history click keeps navigating to `/pages/detail/detail?id=${recipeId}`."
    - "D-17: history-to-detail failures are handled by detail page error/retry and must not modify or auto-delete history records."
    - "D-18: history entries do not restore `已有` / `还差` groups or coverage."
    - "D-27: experience-version work is allowed while API base URL remains centralized and tests remain network-free."
    - "D-26: official release documentation is deferred because HTTPS/request-domain/ICP filing requirements are already understood and formal release is not intended yet."
---

# Plan 11-02: Favorites, History, and Verification

<objective>
Complete Phase 11 read-view coverage after the detail API path exists. Update favorites page display so local favorite ids are rendered from the real match-ready recipes API without destructive cleanup, keep history as local snapshots that navigate into the API-driven detail page, and run the full miniapp verification gate while respecting the decision not to add official release documentation in this phase.
</objective>

<must_haves>
<truths>
- READ-03 is satisfied when the favorites page renders recipe cards from API data matched against local favorite ids.
- READ-04 is satisfied when history item taps route to the API-driven detail page by `recipeId`.
- READ-05 is satisfied when API failures and missing recipe ids do not clear or corrupt local favorites, local history, or drafts.
- VERIFY-02 is satisfied when e2e/matcher tests continue proving matcher behavior with local fixtures and add read-view data-protection simulations.
- VERIFY-03 is satisfied only after `type-check`, `recipes-api.test.ts`, `e2e.test.ts`, `matcher.test.ts`, and `build:mp-weixin` pass or any blocker is documented.
- VERIFY-04 is constrained by D-25 through D-28: do not add README/docs release prerequisite content; record formal release documentation as deferred in the implementation summary only.
- D-08: favorites storage remains local id-only storage.
- D-09: favorites display uses `fetchMatchReadyRecipes()` and local id filtering.
- D-10: do not add backend batch endpoint or per-favorite request loop.
- D-11: unavailable favorites remain visible as placeholders.
- D-12: unavailable favorite placeholders may cancel the local favorite id.
- D-13: full favorites API failure displays retry/error and preserves local count.
- D-14: history keeps existing local snapshot fields.
- D-15: history list does not refresh real recipe names/status.
- D-16: history click navigates to detail with `recipeId`.
- D-17: detail failures do not modify history.
- D-18: history entry does not restore match groups or coverage.
</truths>
</must_haves>

<tasks>
<task id="T1" type="execute">
<title>Refactor favorites store to remain id-only at runtime</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- apps/miniapp/src/stores/favorites.ts
- apps/miniapp/src/pages/favorites/favorites.vue
- apps/miniapp/src/data/recipes.ts
- apps/miniapp/src/pages/index/index.vue
</read_first>
<files>
- apps/miniapp/src/stores/favorites.ts
</files>
<action>
Keep `favorites.ts` responsible for local favorite ids only. Remove the local `findRecipeById`-derived `list` computed value if it is no longer used, or stop favorites page from using it and ensure runtime favorites display does not depend on it. Preserve `ids`, `count`, `load`, `isFavorite`, and `toggle`. `toggle(id)` must continue to persist local ids only. Do not add API calls to the store.
</action>
<acceptance_criteria>
- `favorites.ts` no longer imports `findRecipeById`, or no Phase 11 runtime page uses a local recipe-derived `favStore.list`.
- `favStore.ids` remains a string array loaded from `recipe-favorites`.
- `favStore.count` remains derived from local ids.
- `toggle(id)` still adds/removes only local ids and persists them.
- No API client import is added to `favorites.ts`.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T2" type="execute">
<title>Load favorites page cards from the real recipes API</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- apps/miniapp/src/pages/favorites/favorites.vue
- apps/miniapp/src/stores/favorites.ts
- apps/miniapp/src/services/recipes-api.ts
- apps/miniapp/src/components/EmptyState.vue
- apps/miniapp/src/components/RecipeCard.vue
- apps/miniapp/src/types/recipe.ts
</read_first>
<files>
- apps/miniapp/src/pages/favorites/favorites.vue
</files>
<action>
Update `favorites.vue` so `onShow` loads local favorite ids, then fetches real recipes through `recipesApi.fetchMatchReadyRecipes()` when there are ids to display. Build a local view model that preserves the order of `favStore.ids`: available items contain the mapped `Recipe`, unavailable items contain the missing id and render a "暂不可用" placeholder. Empty local ids should still show the existing empty favorites state without calling the API. API failure should show an error/retry state that still references the local favorite count and states that favorites are not lost. Do not fallback to `ALL_RECIPES`.
</action>
<acceptance_criteria>
- Favorites page calls `favStore.load()` before deriving local count or ids.
- When `favStore.ids.length === 0`, the existing empty state is shown and no recipes API fetch is required.
- When ids exist and API succeeds, recipe cards are rendered from API recipes whose `id` matches local ids.
- Available recipe card order follows local `favStore.ids` order.
- API-missing ids render "暂不可用" placeholders.
- Whole API failure does not clear `favStore.ids`.
- Whole API failure does not render the normal empty-favorites state.
- `favorites.vue` does not import `ALL_RECIPES` or `findRecipeById`.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T3" type="execute">
<title>Add unavailable favorite cleanup without remote writes</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- apps/miniapp/src/pages/favorites/favorites.vue
- apps/miniapp/src/stores/favorites.ts
- apps/miniapp/src/uni.scss
</read_first>
<files>
- apps/miniapp/src/pages/favorites/favorites.vue
- apps/miniapp/src/stores/favorites.ts
</files>
<action>
For unavailable favorite placeholders, add a local "取消收藏" action that calls the existing local toggle/remove behavior for that id. Stop event propagation so tapping the cleanup action does not navigate to detail. Do not add a batch cleanup action. Do not call any remote write endpoint. Keep all UI copy user-facing and non-technical.
</action>
<acceptance_criteria>
- Unavailable placeholder displays the missing recipe id or a user-understandable identifier.
- Unavailable placeholder has a local cancel action.
- Cancel action removes only that id from local favorite ids.
- Cancel action does not call a remote endpoint.
- Tapping unavailable placeholder itself does not navigate to a broken detail route unless an explicit design choice in code makes retry/navigation clear.
- No batch "清理不可用收藏" action is added.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
</verify>
</task>

<task id="T4" type="execute">
<title>Preserve history as local snapshots that open API-driven detail</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- apps/miniapp/src/pages/history/history.vue
- apps/miniapp/src/stores/history.ts
- apps/miniapp/src/pages/detail/detail.vue
- apps/miniapp/tests/e2e.test.ts
</read_first>
<files>
- apps/miniapp/src/pages/history/history.vue
- apps/miniapp/tests/e2e.test.ts
</files>
<action>
Keep `history.vue` list rendering based on local `histStore.list` snapshots. Preserve the existing `openDetail(id)` navigation to `/pages/detail/detail?id=${id}` so Plan 11-01's API-driven detail page handles actual recipe loading. Do not add recipes list API loading, status refresh, recipe-name refresh, or match-context restoration to history. Add or update e2e-style assertions that a history item click uses `recipeId` in the detail URL and that simulated detail API failure does not mutate local history records.
</action>
<acceptance_criteria>
- `history.vue` does not import `recipesApi`, `ALL_RECIPES`, or `findRecipeById`.
- `history.vue` continues displaying `item.recipeName`, `item.missingCount`, and local timestamps from history records.
- `openDetail(item.recipeId)` still navigates to `/pages/detail/detail?id=${id}`.
- No code restores `pendingDetailInput` from a history item.
- e2e-style tests assert history click URL uses `recipeId`.
- e2e-style tests assert detail failure does not remove or clear a sample history item.
</acceptance_criteria>
<verify>
- `npm --prefix apps/miniapp run type-check`
- `npx tsx apps/miniapp/tests/e2e.test.ts`
</verify>
</task>

<task id="T5" type="execute">
<title>Complete Phase 11 verification without release docs scope creep</title>
<read_first>
- .planning/phases/11-api-read-views-verification/11-CONTEXT.md
- .planning/REQUIREMENTS.md
- apps/miniapp/tests/recipes-api.test.ts
- apps/miniapp/tests/e2e.test.ts
- apps/miniapp/tests/matcher.test.ts
- apps/miniapp/package.json
- apps/miniapp/src/config/api.ts
</read_first>
<files>
- apps/miniapp/tests/recipes-api.test.ts
- apps/miniapp/tests/e2e.test.ts
- apps/miniapp/tests/matcher.test.ts
</files>
<action>
Run and, if needed, minimally adjust the existing fake/local tests so they cover the final Phase 11 behavior. Keep all automated tests network-free. Run the full miniapp verification gate. Do not add or modify README release sections, `docs/*release*` files, or WeChat official release checklist docs. In the eventual implementation summary, record that formal release prerequisite documentation is intentionally deferred because the current target is experience-version use and the API base URL remains centralized in `apps/miniapp/src/config/api.ts`.
</action>
<acceptance_criteria>
- `npx tsx apps/miniapp/tests/recipes-api.test.ts` exits 0.
- `npx tsx apps/miniapp/tests/e2e.test.ts` exits 0.
- `npx tsx apps/miniapp/tests/matcher.test.ts` exits 0.
- `npm --prefix apps/miniapp run type-check` exits 0.
- `npm --prefix apps/miniapp run build:mp-weixin` exits 0.
- No README or release-checklist doc is added or modified for WeChat official release prerequisites in this plan.
- `apps/miniapp/src/config/api.ts` remains the single place to change the API base URL.
- The phase summary records VERIFY-04 as deferred by user decision rather than implemented as README/docs changes.
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
A failed favorites API request could appear as lost favorites if rendered as an empty state. Mitigation: branch empty local ids separately from API failure, preserve local count, and show retry/error copy.
</threat>
<threat severity="high">
Unavailable API data could destructively remove local favorites or history. Mitigation: never auto-delete local ids or history records; only the explicit unavailable favorite cancel action may remove a local favorite id.
</threat>
<threat severity="medium">
History page scope could creep into live recipe refresh or match-context restoration. Mitigation: keep history list local and route detail loading to Plan 11-01's API-driven detail page.
</threat>
<threat severity="medium">
Planner/executor could satisfy VERIFY-04 by adding release docs despite user deferral. Mitigation: this plan explicitly forbids README/docs release checklist changes and requires summary-only deferral.
</threat>
</threat_model>

<verification>
Run the full miniapp gate before completing this plan:

1. `npm --prefix apps/miniapp run type-check`
2. `npx tsx apps/miniapp/tests/recipes-api.test.ts`
3. `npx tsx apps/miniapp/tests/e2e.test.ts`
4. `npx tsx apps/miniapp/tests/matcher.test.ts`
5. `npm --prefix apps/miniapp run build:mp-weixin`
</verification>

<success_criteria>
- Favorites page displays available API recipes for local favorite ids.
- Favorites page preserves and visibly represents API-missing favorite ids.
- Favorites API failure does not look like empty favorites and does not mutate local ids.
- History list remains local snapshot based and opens API-driven detail by `recipeId`.
- Detail/favorites/history API failures do not clear favorites, history, or drafts.
- No official release checklist docs are added in Phase 11.
- Full miniapp verification gate passes before implementation summary/commit.
</success_criteria>
