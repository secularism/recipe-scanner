# Phase 10: miniapp-api-generation - Context

**Gathered:** 2026-06-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 10 delivers the miniapp generation read path against the real recipes API. It adds a unified recipes API client, maps the Phase 9 backend DTO into the existing miniapp `Recipe` type, and changes the result page generation flow so it fetches `GET /api/recipes?include=matchFields` before running the existing matcher.

This phase does not API-drive the detail page, favorites page, or history page display. It also does not add remote favorites/history writes, login, OCR, AI generation, server-side matching, or a fallback local recipe library.

</domain>

<decisions>
## Implementation Decisions

### Request Timing
- **D-01:** The result page requests real recipes after it is opened and after it reads `globalData.pendingInput`.
- **D-02:** The generator page remains focused on collecting input and navigating to the result page. It does not own recipes API loading, error, or retry state in Phase 10.
- **D-03:** The result page shows a loading state while fetching recipes and only runs matcher after the real recipe pool is available.

### Failure and Retry Behavior
- **D-04:** API failure displays an error state with a retry action on the result page.
- **D-05:** Phase 10 must not fall back to local `ALL_RECIPES` when the API fails. This keeps real API integration visible and avoids a false-positive "works locally" result.
- **D-06:** Failed requests must not write generation history and must not mutate local favorites, history, or draft data.

### Recipe Pool and Shuffle
- **D-07:** The result page fetches the match-ready recipes list once per result page session.
- **D-08:** `generate` and "换一换" both reuse the current in-memory real recipe pool from that successful fetch.
- **D-09:** "换一换" must avoid repeating the current top recipe, preserving the current behavior of `shuffleResult`.
- **D-10:** No TTL, background refresh, or global cache is required in Phase 10.

### History Writes
- **D-11:** Local history is written only after the API succeeds and matcher returns a first result.
- **D-12:** History records keep using a public id that the backend detail route can resolve, preferably `slug` with `legacyId` as equivalent public identity.
- **D-13:** No history record is written for API failure or empty matcher results.

### API Configuration
- **D-14:** Add a centralized miniapp API config file, for example `apps/miniapp/src/config/api.ts`.
- **D-15:** The default development base URL is `http://47.96.36.31/api`.
- **D-16:** Keep the base URL replaceable from one place so later HTTPS/domain changes do not touch business logic.
- **D-17:** Phase 10 documents or preserves awareness that formal WeChat release requires HTTPS and request合法域名 configuration, but the full release checklist belongs to Phase 11 verification.

### Testing Strategy
- **D-18:** Default tests must not depend on `http://47.96.36.31` or any live network.
- **D-19:** Mapper tests should cover backend DTO to miniapp `Recipe` conversion, including field renames and default handling.
- **D-20:** API client tests should use an injected fake request function rather than real `uni.request`.
- **D-21:** Generator/matcher tests should keep using local fixture data and explicit recipe pools so ranking remains testable without network.
- **D-22:** Existing `npx tsx` alias-resolution failures are in scope to fix if needed for Phase 10 tests, because the new client/mapper tests must run locally.

### the agent's Discretion
- Choose exact file names and module boundaries for `api config`, recipes API client, mapper, and generator helpers, as long as files stay under the project line limit.
- Choose whether to keep `generateRecipe` synchronous with an explicit recipe-pool parameter or introduce a separate async wrapper for result page usage, as long as matcher itself remains pure and reusable.
- Choose loading/error UI implementation details that fit the existing result page style and component set.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning
- `.planning/PROJECT.md` - v1.1 scope, current milestone, constraints, and out-of-scope boundaries.
- `.planning/REQUIREMENTS.md` - CLIENT-01 through CLIENT-04 and GENAPI-01 through GENAPI-04 are the locked Phase 10 requirements.
- `.planning/ROADMAP.md` - Phase 10 goal, success criteria, and Phase 11 separation.
- `.planning/STATE.md` - current milestone status and accumulated context.

### Prior Phase Contract
- `.planning/phases/09-recipes-api-contract/09-CONTEXT.md` - locked API shape decisions for `include=matchFields`, public ids, DTO fields, and defaults.
- `.planning/phases/09-recipes-api-contract/09-SUMMARY.md` - completed backend files, verification status, and contract readiness for Phase 10.
- `apps/api/src/recipes/recipes.dto.ts` - backend DTO field names and serializer defaults.
- `apps/api/src/recipes/recipes.controller.ts` - live route shape for `GET /api/recipes?include=matchFields`.
- `apps/api/src/recipes/recipes.service.ts` - backend list/detail semantics and `PUBLISHED` filtering.

### Miniapp Generation Code
- `apps/miniapp/src/types/recipe.ts` - target `Recipe`, `MatchResult`, `GenerateInput`, `Cuisine`, and `Taste` types.
- `apps/miniapp/src/services/matcher.ts` - pure matcher field requirements and ranking behavior.
- `apps/miniapp/src/services/generator.ts` - current `ALL_RECIPES` dependency that Phase 10 replaces or parameterizes.
- `apps/miniapp/src/pages/result/result.vue` - result page integration point for async loading, error, retry, history write, and "换一换".
- `apps/miniapp/src/data/recipes.ts` - current local recipe library and labels that tests may continue using as fixtures.

### Tests and Tooling
- `apps/miniapp/tests/matcher.test.ts` - matcher/generator behavior tests that should remain network-free.
- `apps/miniapp/tests/e2e.test.ts` - user-flow tests that currently depend on local recipes and `findRecipeById`.
- `apps/miniapp/tsconfig.json` - alias configuration relevant to fixing `npx tsx` test imports.
- `apps/miniapp/package.json` - miniapp scripts and existing `type-check` / test / build commands.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/miniapp/src/services/matcher.ts`: already accepts `Recipe[]`, so matching can remain pure once the real recipe pool is mapped.
- `apps/miniapp/src/pages/result/result.vue`: owns result generation, history write, detail navigation, and "换一换", making it the right integration point for API loading state.
- `apps/miniapp/src/types/recipe.ts`: existing `Recipe` is the target shape; Phase 10 should not force components to understand backend DTO names.
- `apps/miniapp/src/data/recipes.ts`: local recipes can remain as test fixture data for matcher and e2e tests, but should not be used as runtime fallback on API failure.
- `apps/miniapp/src/components/EmptyState.vue`: can be reused for empty/error states if it fits the result page UI.

### Established Patterns
- Generation input is passed from generator page to result page through `getApp().globalData.pendingInput`.
- Result page writes history through `useHistoryStore().addIfFresh()` after selecting the top result.
- Detail navigation uses `/pages/detail/detail?id=${recipe.id}`; Phase 10 should preserve ids that Phase 11 can resolve via backend detail API.
- Existing services are exported from `apps/miniapp/src/services/index.ts`.
- Current tests are plain `tsx` scripts, not Jest/Vitest suites.

### Integration Points
- Add API config under `apps/miniapp/src/config/`.
- Add recipes API client and mapper under `apps/miniapp/src/services/` or a nearby module that matches existing conventions.
- Change result page generation from synchronous `generateRecipe(input)` to an async flow that loads the recipe pool, maps it, runs matcher, and stores the pool for shuffle.
- Adjust `generateRecipe` / `shuffleResult` APIs so they can operate on an injected `Recipe[]` while preserving current testable ranking behavior.
- Add fake-request tests for API client and mapper, and keep live API checks outside default tests.

</code_context>

<specifics>
## Specific Ideas

- Live development base URL: `http://47.96.36.31/api`.
- Result page request: `GET /api/recipes?include=matchFields`.
- Backend DTO to frontend mapping from Phase 9:
  - `Recipe.id = dto.slug || dto.legacyId`
  - `Recipe.name = dto.title`
  - `Recipe.shortDesc = dto.summary`
  - `Recipe.taste = dto.tastes`
  - `Recipe.cookTime = dto.cookMinutes`
  - `Recipe.difficulty = dto.difficulty`
  - `ingredients`, `seasonings`, `steps`, `tags`, and `cuisine` map directly after validation/defaulting.
- Do not hide API failures behind local mock recipes during Phase 10.
- Manual live verification can use curl/browser against the remote API; automated tests should stay fake/local.

</specifics>

<deferred>
## Deferred Ideas

- Detail page API-driven loading belongs to Phase 11.
- Favorites page API-driven display belongs to Phase 11.
- History page API-driven detail jump verification belongs to Phase 11.
- HTTPS and WeChat request合法域名 release checklist belongs to Phase 11 verification documentation.
- Global recipe cache, TTL refresh, stale-while-revalidate, and server-side matching are future enhancements.
- Remote favorites/history writes, login, user identity, OCR, and AI generation remain outside v1.1 Phase 10.

</deferred>

---

*Phase: 10-miniapp-api-generation*
*Context gathered: 2026-06-22*
