---
phase: 10-miniapp-api-generation
plan: 10-01-miniapp-recipes-client-mapper
type: execute
wave: 1
depends_on: []
autonomous: true
requirements: [CLIENT-01, CLIENT-02, CLIENT-03, CLIENT-04, GENAPI-01, GENAPI-03]
requirements_addressed: [CLIENT-01, CLIENT-02, CLIENT-03, CLIENT-04, GENAPI-01, GENAPI-03]
files_modified:
  - apps/miniapp/src/config/api.ts
  - apps/miniapp/src/services/recipe-mapper.ts
  - apps/miniapp/src/services/recipes-api.ts
  - apps/miniapp/src/services/generator.ts
  - apps/miniapp/src/services/index.ts
  - apps/miniapp/tests/recipes-api.test.ts
  - apps/miniapp/tests/matcher.test.ts
  - apps/miniapp/tests/e2e.test.ts
must_haves:
  truths:
    - "CLIENT-01: miniapp recipes reads go through one recipes API client that wraps `uni.request`, response parsing, and error handling."
    - "CLIENT-02: backend full recipe DTOs are mapped into the existing frontend `Recipe` type before matcher or UI code consumes them."
    - "CLIENT-03: the default development API base URL is defined once as `http://47.96.36.31/api` in `apps/miniapp/src/config/api.ts`."
    - "CLIENT-04: recipes API client tests use an injected fake request function and never call `http://47.96.36.31`."
    - "GENAPI-01: generator helpers can run matcher against an injected real recipe pool while preserving existing local fixture behavior for tests."
    - "GENAPI-03: `shuffleResult` can reuse the same injected real recipe pool and exclude the current recipe id."
    - "D-05: API failure must not fall back to local `ALL_RECIPES`."
    - "D-08: `generate` and `换一换` both reuse the current in-memory real recipe pool after a successful fetch."
    - "D-12: history/detail-facing recipe ids use `slug || legacyId`, not the backend UUID."
    - "D-14: add centralized miniapp API config under `apps/miniapp/src/config/`."
    - "D-15: default development base URL is `http://47.96.36.31/api`."
    - "D-16: later HTTPS/domain changes must require changing only the config, not result page or mapper code."
    - "D-17: preserve awareness that formal WeChat release requires HTTPS and request合法域名 configuration, while full release checklist work stays in Phase 11."
    - "D-18: default tests must not depend on live network."
    - "D-19: mapper tests cover backend DTO to miniapp `Recipe` conversion, field renames, and defaults."
    - "D-20: API client tests use injected fake request instead of real `uni.request`."
    - "D-21: generator/matcher tests keep using local fixture data and explicit recipe pools so ranking remains testable without network."
    - "D-22: existing `npx tsx` alias-resolution failures are in scope to fix if needed for Phase 10 tests."
---

# Plan 10-01: Miniapp Recipes Client and Mapper

<objective>
Create the miniapp recipes data access layer for Phase 10. Add a centralized API base URL config, a testable recipes API client, and a backend DTO to frontend `Recipe` mapper. Parameterize the existing generator helpers so matcher logic can run against either the existing local fixture pool or the real API pool supplied by the result page, without adding a local fallback path for API failures.
</objective>

<must_haves>
<truths>
- CLIENT-01 is satisfied when recipes API reads are centralized in a service that wraps `uni.request`, parses success/error responses, and exposes a match-ready recipes fetch function.
- CLIENT-02 is satisfied when Phase 9 backend fields `slug`, `legacyId`, `title`, `summary`, `cuisine`, `tastes`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps` are mapped into the existing frontend `Recipe` type.
- CLIENT-03 is satisfied when `http://47.96.36.31/api` appears as the default API base URL in one config file and business code imports that config instead of hard-coding the host.
- CLIENT-04 is satisfied when API client tests inject a fake request function and default test commands do not perform live network requests.
- GENAPI-01 is partially satisfied when `generateRecipe` can run against an injected `Recipe[]` pool; Plan 10-02 wires that capability into the result page.
- GENAPI-03 is partially satisfied when `shuffleResult` can run against the same injected `Recipe[]` pool and exclude the current top recipe id.
- D-05: do not add any API-failure fallback to local `ALL_RECIPES`.
- D-07: the result page will fetch once per page session in Plan 10-02; this plan only provides the reusable client and generator APIs.
- D-08: generator and shuffle helpers must support reuse of a caller-provided in-memory pool.
- D-12: mapped `Recipe.id` must be `dto.slug || dto.legacyId` so later detail/history reads can resolve it through backend public ids.
- D-14: add centralized miniapp API config under `apps/miniapp/src/config/`.
- D-15: default development base URL is `http://47.96.36.31/api`.
- D-16: later HTTPS/domain changes must require changing only the config, not result page or mapper code.
- D-17: preserve awareness that formal WeChat release requires HTTPS and request合法域名 configuration, while full release checklist work stays in Phase 11.
- D-18: automated tests stay fake/local.
- D-19: mapper tests cover field renames and default handling.
- D-20: API client tests use an injected fake request function.
- D-21: matcher/generator tests keep using local fixture data and explicit recipe pools.
- D-22: fix plain `npx tsx` test import/runtime issues if new tests expose them.
</truths>
</must_haves>

<tasks>
<task id="T1" type="execute">
<title>Add centralized miniapp API config</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- apps/miniapp/tsconfig.json
- apps/miniapp/src/services/index.ts
</read_first>
<files>
- apps/miniapp/src/config/api.ts
</files>
<action>
Create `apps/miniapp/src/config/api.ts` exporting `API_BASE_URL` with the exact value `http://47.96.36.31/api`. Also export a small `joinApiUrl(path: string): string` helper or equivalent URL builder that trims one trailing slash from `API_BASE_URL` and one leading slash from `path`, so callers can request `recipes?include=matchFields` without duplicating slash logic. Keep release-domain/HTTPS notes out of runtime code; Phase 11 owns release checklist documentation.
</action>
<acceptance_criteria>
- `apps/miniapp/src/config/api.ts` exists.
- The file contains exactly one default development host string: `http://47.96.36.31/api`.
- The URL builder returns `http://47.96.36.31/api/recipes?include=matchFields` for `recipes?include=matchFields`.
- No result page or service file hard-codes `47.96.36.31` outside this config.
</acceptance_criteria>
<verify>
- `npx tsx apps/miniapp/tests/recipes-api.test.ts`
</verify>
</task>

<task id="T2" type="execute">
<title>Create backend DTO to frontend Recipe mapper</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- .planning/phases/09-recipes-api-contract/09-SUMMARY.md
- apps/api/src/recipes/recipes.dto.ts
- apps/miniapp/src/types/recipe.ts
- apps/miniapp/src/data/recipes.ts
</read_first>
<files>
- apps/miniapp/src/services/recipe-mapper.ts
- apps/miniapp/src/services/index.ts
- apps/miniapp/tests/recipes-api.test.ts
</files>
<action>
Create `apps/miniapp/src/services/recipe-mapper.ts` with exported backend DTO interfaces matching the Phase 9 full DTO and exported mapper functions. The mapper must set `Recipe.id = dto.slug || dto.legacyId`, `Recipe.name = dto.title`, `Recipe.shortDesc = dto.summary`, `Recipe.cuisine = dto.cuisine`, `Recipe.taste = dto.tastes`, `Recipe.cookTime = dto.cookMinutes`, `Recipe.difficulty = dto.difficulty`, and copy `ingredients`, `seasonings`, `steps`, and `tags`. Validate/default values into existing frontend unions: unknown or missing cuisine defaults to `home`, unknown tastes are filtered out, invalid difficulty defaults to `2`, missing numeric cook time defaults to `0`, and missing arrays default to `[]`. If both `slug` and `legacyId` are missing, throw a mapper error because Phase 10 history/detail ids require a public id. Export mapper functions from `apps/miniapp/src/services/index.ts`.
</action>
<acceptance_criteria>
- `mapRecipeDtoToRecipe` maps `slug: "mapo-tofu"` to `Recipe.id === "mapo-tofu"`.
- If `slug` is empty and `legacyId` is `"tomato-egg-stir-fry"`, mapped `Recipe.id` is `"tomato-egg-stir-fry"`.
- `title`, `summary`, `tastes`, `cookMinutes`, and `difficulty` map to `name`, `shortDesc`, `taste`, `cookTime`, and `difficulty`.
- Unknown taste strings are absent from the mapped `taste` array.
- Missing optional arrays map to `ingredients: []`, `seasonings: []`, `steps: []`, and `tags: []`.
- Invalid or missing `difficulty` maps to `2`.
- Missing both `slug` and `legacyId` throws a deterministic mapper error.
- `apps/miniapp/tests/recipes-api.test.ts` covers successful mapping, fallback id mapping, optional-field defaults, invalid taste filtering, invalid difficulty defaulting, and missing-id rejection.
</acceptance_criteria>
<verify>
- `npx tsx apps/miniapp/tests/recipes-api.test.ts`
</verify>
</task>

<task id="T3" type="execute">
<title>Add injectable recipes API client</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- apps/miniapp/src/config/api.ts
- apps/miniapp/src/services/recipe-mapper.ts
- apps/api/src/recipes/recipes.controller.ts
- apps/api/src/recipes/recipes.service.ts
</read_first>
<files>
- apps/miniapp/src/services/recipes-api.ts
- apps/miniapp/src/services/index.ts
- apps/miniapp/tests/recipes-api.test.ts
</files>
<action>
Create `apps/miniapp/src/services/recipes-api.ts` with an injectable request boundary. Export a request function type compatible with `uni.request`, a `RecipesApiError` class or typed error object, `createRecipesApiClient({ baseUrl, request })`, and a default `recipesApi` that uses `API_BASE_URL` and `uni.request`. The client must request `GET /recipes?include=matchFields`, accept only 2xx status codes with an array response, map the response through the mapper from T2, and reject with a useful error for HTTP errors, request failures, non-array response data, and mapper failures. Do not import `ALL_RECIPES` in this client.
</action>
<acceptance_criteria>
- `recipes-api.ts` exports a way to call `fetchMatchReadyRecipes()` against the default config.
- `createRecipesApiClient` accepts an injected fake request function in tests.
- A fake 200 response with two DTOs resolves to two frontend `Recipe` objects.
- A fake 500 response rejects with `RecipesApiError` or the chosen exported error type.
- A fake request failure rejects without touching local recipe fixtures.
- A fake 200 response with non-array data rejects.
- `recipes-api.ts` does not import from `apps/miniapp/src/data/recipes.ts`.
- `apps/miniapp/tests/recipes-api.test.ts` does not call `uni.request` or `http://47.96.36.31`.
</acceptance_criteria>
<verify>
- `npx tsx apps/miniapp/tests/recipes-api.test.ts`
</verify>
</task>

<task id="T4" type="execute">
<title>Parameterize generator helpers for explicit recipe pools</title>
<read_first>
- .planning/phases/10-miniapp-api-generation/10-CONTEXT.md
- apps/miniapp/src/services/generator.ts
- apps/miniapp/src/services/matcher.ts
- apps/miniapp/src/data/recipes.ts
- apps/miniapp/tests/matcher.test.ts
- apps/miniapp/tests/e2e.test.ts
</read_first>
<files>
- apps/miniapp/src/services/generator.ts
- apps/miniapp/tests/matcher.test.ts
- apps/miniapp/tests/e2e.test.ts
</files>
<action>
Change `generateRecipe` to accept an optional third argument `recipes: Recipe[] = ALL_RECIPES` while preserving the current first two parameters `input` and `limit`. Change `shuffleResult` to accept an optional fourth argument `recipes: Recipe[] = ALL_RECIPES` while preserving `currentId`, `input`, and `poolSize`. Both functions must call `matchRecipes(input, recipes)` and must not fetch or import the API client. Keep `ALL_RECIPES` only as the default local fixture pool for existing runtime paths and tests that have not yet been API-wired. Update `matcher.test.ts` and `e2e.test.ts` so generator and shuffle assertions pass explicit `ALL_RECIPES` where it clarifies that default tests are local and network-free. If `npx tsx` still fails resolving runtime aliases, make the smallest source import adjustment needed in tested non-Vue modules, such as changing runtime `@/data/recipes` imports in `generator.ts` to relative imports; do not touch unrelated page/component aliases.
</action>
<acceptance_criteria>
- Existing calls `generateRecipe(input)` and `generateRecipe(input, 3)` still compile.
- Result-page-ready calls `generateRecipe(input, 3, recipePool)` compile.
- Existing calls `shuffleResult(currentId, input)` still compile.
- Result-page-ready calls `shuffleResult(currentId, input, 10, recipePool)` compile.
- `generateRecipe(input, 3, [])` returns `[]` and does not use `ALL_RECIPES`.
- `shuffleResult(currentId, input, 10, [])` returns `null` and does not use `ALL_RECIPES`.
- `npx tsx apps/miniapp/tests/matcher.test.ts` exits 0.
- `npx tsx apps/miniapp/tests/e2e.test.ts` exits 0.
</acceptance_criteria>
<verify>
- `npx tsx apps/miniapp/tests/matcher.test.ts`
- `npx tsx apps/miniapp/tests/e2e.test.ts`
</verify>
</task>
</tasks>

<threat_model>
<threat severity="high">
Tests or runtime code could mask a broken API integration by falling back to `ALL_RECIPES` after request failure. Mitigation: keep fallback behavior out of the API client and reserve `ALL_RECIPES` only as an explicit/default recipe pool for local generator helper calls.
</threat>
<threat severity="medium">
Mapped recipes could store backend-internal or unstable ids in history and later break detail reads. Mitigation: `Recipe.id` must be `slug || legacyId`, and mapper tests must assert both id paths.
</threat>
<threat severity="medium">
Live-network test calls could make default verification flaky. Mitigation: client tests must use fake request injection and must not call the configured host.
</threat>
</threat_model>

<verification>
Run these commands after completing this plan:

1. `npx tsx apps/miniapp/tests/recipes-api.test.ts`
2. `npx tsx apps/miniapp/tests/matcher.test.ts`
3. `npx tsx apps/miniapp/tests/e2e.test.ts`

If the `npx tsx` commands fail before executing assertions because of path-alias resolution, fix only the minimal runtime imports in the tested service/data modules needed to make the default Phase 10 tests run without changing the miniapp page alias convention.
</verification>

<success_criteria>
- The miniapp has one recipes API config file and one injectable recipes API client.
- The backend full recipe DTO maps into the existing frontend `Recipe` type.
- API client and mapper tests are fake/local and cover success and error paths.
- Generator helpers can use an injected real recipe pool while preserving existing local fixture behavior.
- Matcher and e2e tests remain network-free.
</success_criteria>
