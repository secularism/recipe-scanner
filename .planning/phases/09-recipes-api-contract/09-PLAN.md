---
phase: 09-recipes-api-contract
plan: 09-01-backend-recipes-read-contract
type: execute
wave: 1
depends_on: []
autonomous: true
requirements: [API-01, API-02, API-03, API-04]
requirements_addressed: [API-01, API-02, API-03, API-04]
files_modified:
  - apps/api/src/recipes/recipes.controller.ts
  - apps/api/src/recipes/recipes.service.ts
  - apps/api/src/recipes/recipes.dto.ts
  - apps/api/tests/recipes-contract.test.ts
  - apps/api/package.json
must_haves:
  truths:
    - "API-01: `GET /api/recipes?include=matchFields` returns matcher fields: `legacyId`, `slug`, `title`, `summary`, `cuisine`, `tastes`, `tags`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`."
    - "API-02: `GET /api/recipes/:id` resolves existing `legacyId` or `slug` values such as `mapo-tofu` and returns the stable full recipe DTO."
    - "API-03: all public recipes reads include `status: \"PUBLISHED\"` in Prisma filters."
    - "API-04: controller responses are created through DTO/serializer helpers and do not expose raw Prisma `id`, `metadata`, or `status` fields."
    - "D-01: keep `GET /api/recipes` as the single recipes list entrypoint."
    - "D-02: use `include=matchFields` to request the match-ready recipe list."
    - "D-03: do not add `/api/recipes/matchable` in Phase 9."
    - "D-04: plain `GET /api/recipes` keeps lightweight list behavior and default `take=20` semantics."
    - "D-05: `GET /api/recipes?include=matchFields` returns all `PUBLISHED` recipes by default."
    - "D-06: return a stable API DTO rather than raw Prisma models or the frontend `Recipe` type."
    - "D-07: use backend/API field names such as `title`, `summary`, `tastes`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`."
    - "D-08: lift `metadata.difficulty` into top-level `difficulty`."
    - "D-09: do not expose the whole `metadata` object to the miniapp contract."
    - "D-10: leave mapping into frontend `Recipe` fields to Phase 10."
    - "D-11: preserve `legacyId`/`slug` as the miniapp public recipe ids."
    - "D-12: keep database UUID backend-internal and do not make it the miniapp business id."
    - "D-13: if UUID is ever exposed, call it `databaseId`; this plan keeps it out of the miniapp-facing DTO."
    - "D-14: detail lookup continues accepting `legacyId` and `slug` through `GET /api/recipes/:id`."
    - "D-15: `include=matchFields` returns public id data, `title`, `summary`, `cuisine`, `tastes`, `tags`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`."
    - "D-16: fill stable defaults for nullable fields and JSON arrays."
    - "D-17: only return `PUBLISHED` recipes."
    - "D-18: defer pagination, caching, and server-side matching; Phase 9 keeps a simple full read pool for `include=matchFields`."
---

# Plan 09-01: Backend Recipes Read Contract

<objective>
Implement the Phase 9 backend read contract for recipes without changing miniapp generation code. Extend the existing `GET /api/recipes` route so `include=matchFields` returns the complete matcher-ready `PUBLISHED` recipe pool, keep the plain list endpoint lightweight, and return stable DTOs from both list and detail reads so Phase 10 can map them into the miniapp `Recipe` type without depending on Prisma fields.
</objective>

<must_haves>
<truths>
- API-01 is satisfied when `GET /api/recipes?include=matchFields` returns `legacyId`, `slug`, `title`, `summary`, `cuisine`, `tastes`, `tags`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`.
- API-02 is satisfied when `GET /api/recipes/:id` resolves existing `legacyId` or `slug` values such as `mapo-tofu` and returns the same stable full recipe DTO shape.
- API-03 is satisfied when all miniapp-facing recipes reads add `status: "PUBLISHED"` to Prisma filters.
- API-04 is satisfied when controller responses are created through explicit DTO/serializer helpers and do not expose raw Prisma `id`, `metadata`, or `status` fields.
- D-01: keep `GET /api/recipes` as the single recipes list entrypoint.
- D-02: use `include=matchFields` to request the match-ready recipe list.
- D-03: do not add `/api/recipes/matchable` in Phase 9.
- D-04: plain `GET /api/recipes` keeps lightweight list behavior and default `take=20` semantics.
- D-05: `GET /api/recipes?include=matchFields` returns all `PUBLISHED` recipes by default.
- D-06: return a stable API DTO rather than raw Prisma models or the frontend `Recipe` type.
- D-07: use backend/API field names such as `title`, `summary`, `tastes`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`.
- D-08: lift `metadata.difficulty` into top-level `difficulty`.
- D-09: do not expose the whole `metadata` object to the miniapp contract.
- D-10: leave mapping into frontend `Recipe` fields to Phase 10.
- D-11: preserve `legacyId`/`slug` as the miniapp public recipe ids.
- D-12: keep database UUID backend-internal and do not make it the miniapp business id.
- D-13: if UUID is ever exposed, call it `databaseId`; this plan keeps it out of the miniapp-facing DTO.
- D-14: detail lookup continues accepting `legacyId` and `slug` through `GET /api/recipes/:id`.
- D-15: `include=matchFields` returns public id data, `title`, `summary`, `cuisine`, `tastes`, `tags`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`.
- D-16: fill stable defaults for nullable fields and JSON arrays.
- D-17: only return `PUBLISHED` recipes.
- D-18: defer pagination, caching, and server-side matching; Phase 9 keeps a simple full read pool for `include=matchFields`.
</truths>
</must_haves>

<tasks>
<task id="T1" type="execute">
<title>Create stable recipes DTO serializers</title>
<read_first>
- .planning/phases/09-recipes-api-contract/09-CONTEXT.md
- apps/api/src/recipes/recipes.service.ts
- apps/api/prisma/schema.prisma
- apps/api/prisma/seed.ts
- apps/miniapp/src/types/recipe.ts
</read_first>
<files>
- apps/api/src/recipes/recipes.dto.ts
</files>
<action>
Create `apps/api/src/recipes/recipes.dto.ts` with exported DTO types and serializer helpers for lightweight list items and full recipe reads. The full read DTO must expose `legacyId`, `slug`, `title`, `summary`, `cuisine`, `tastes`, `tags`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`. Use `summary ?? ""`, `cookMinutes ?? 0`, `difficulty` from `metadata.difficulty` with default `2`, and array defaults for `tastes`, `tags`, `ingredients`, `seasonings`, and `steps`. Do not expose raw Prisma `id`, `metadata`, or `status`. Keep `databaseId` out of the miniapp-facing DTO unless a later requirement explicitly asks for it.
</action>
<acceptance_criteria>
- `apps/api/src/recipes/recipes.dto.ts` exports a lightweight list DTO type and a full recipe DTO type.
- The full DTO type includes `difficulty` as a top-level field and does not include a `metadata` field.
- The serializers return `summary: ""`, `cookMinutes: 0`, `difficulty: 2`, `ingredients: []`, `seasonings: []`, and `steps: []` when source values are missing or invalid.
- No exported DTO type in `recipes.dto.ts` has raw Prisma `id`, `status`, or `metadata` as a public response field.
</acceptance_criteria>
<verify>
- `npm --prefix apps/api run build`
</verify>
</task>

<task id="T2" type="execute">
<title>Extend recipes list and detail reads through the DTO contract</title>
<read_first>
- .planning/phases/09-recipes-api-contract/09-CONTEXT.md
- apps/api/src/recipes/recipes.controller.ts
- apps/api/src/recipes/recipes.service.ts
- apps/api/src/recipes/recipes.dto.ts
- apps/api/prisma/schema.prisma
</read_first>
<files>
- apps/api/src/recipes/recipes.controller.ts
- apps/api/src/recipes/recipes.service.ts
</files>
<action>
Add `include` query handling to `RecipesController.getRecipes()` and pass it to `RecipesService.getRecipes()`. In the service, parse comma-separated include tokens and support exactly `matchFields`; throw a Nest `BadRequestException` for unsupported include tokens. For plain `GET /api/recipes`, keep `take` default `20`, cap positive `take` at `100`, return the lightweight DTO, and keep ingredients/seasonings/steps out of the select. For `GET /api/recipes?include=matchFields`, select the full matcher fields, default to no `take` so all `PUBLISHED` recipes are returned, and honor an explicit positive `take` only when it is provided. Add `status: "PUBLISHED"` to list and detail Prisma filters. Keep non-UUID detail lookup limited to `legacyId` and `slug`, and return the full DTO from detail reads.
</action>
<acceptance_criteria>
- `RecipesController.getRecipes()` accepts `@Query("include") include?: string`.
- Plain `GET /api/recipes` still defaults to `take=20` and caps `take=500` to `100`.
- The plain list select does not include `ingredients`, `seasonings`, `steps`, or `metadata`.
- `include=matchFields` selects `ingredients`, `seasonings`, `steps`, and `metadata`, and omits `take` when no explicit `take` was provided.
- Every `findMany` and `findFirst` path used by these public recipes reads includes `status: "PUBLISHED"`.
- `getRecipeById("mapo-tofu")` still builds an `OR` lookup with `legacyId` and `slug` and does not require UUID parsing.
- Unsupported include values such as `include=unknown` raise a 400-level `BadRequestException`.
</acceptance_criteria>
<verify>
- `npm --prefix apps/api run build`
</verify>
</task>

<task id="T3" type="execute">
<title>Add backend recipes contract verification</title>
<read_first>
- apps/api/package.json
- apps/api/src/recipes/recipes.service.ts
- apps/api/src/recipes/recipes.dto.ts
- apps/api/prisma/seed.ts
- apps/miniapp/src/types/recipe.ts
</read_first>
<files>
- apps/api/tests/recipes-contract.test.ts
- apps/api/package.json
</files>
<action>
Add a lightweight Node/TypeScript contract test at `apps/api/tests/recipes-contract.test.ts` using Node `assert` and the existing `ts-node` dependency. The test should instantiate `RecipesService` with a fake Prisma `recipe.findMany` and `recipe.findFirst` implementation so it does not need a live database. Add `test:recipes-contract` to `apps/api/package.json` with the command `ts-node -r tsconfig-paths/register tests/recipes-contract.test.ts`. Cover the plain list query, `include=matchFields`, `legacyId`/`slug` detail lookup, `PUBLISHED` filtering, unsupported include rejection, and DTO defaults.
</action>
<acceptance_criteria>
- `apps/api/package.json` contains a `test:recipes-contract` script.
- `npm --prefix apps/api run test:recipes-contract` exits 0 without a live database connection.
- The contract test asserts that plain list reads do not request `ingredients`, `seasonings`, `steps`, or `metadata`.
- The contract test asserts that `include=matchFields` requests matcher fields and returns defaulted `summary`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`.
- The contract test asserts that list and detail queries include `status: "PUBLISHED"`.
- The contract test asserts that unsupported include tokens are rejected.
</acceptance_criteria>
<verify>
- `npm --prefix apps/api run test:recipes-contract`
- `npm --prefix apps/api run build`
</verify>
</task>
</tasks>

<threat_model>
<threat severity="high">
Draft or archived recipes could leak into miniapp reads if filters are omitted. Mitigation: every public list and detail query in this phase must include `status: "PUBLISHED"` and tests must assert the filter.
</threat>
<threat severity="medium">
Raw Prisma fields could become a frontend dependency if responses continue to expose `id`, `metadata`, or `status`. Mitigation: all controller returns must pass through DTO serializers and contract tests must assert the response shape.
</threat>
<threat severity="medium">
Unbounded list reads could become expensive as recipe volume grows. Mitigation: only `include=matchFields` defaults to full pool reads for Phase 9; plain list keeps `take=20` and positive `take` capped at `100`.
</threat>
</threat_model>

<verification>
Run these commands before committing the implementation:

1. `npm --prefix apps/api run test:recipes-contract`
2. `npm --prefix apps/api run build`

Do not run Prisma migration or schema push for this phase because Phase 9 must not change `apps/api/prisma/schema.prisma`.
</verification>

<success_criteria>
- `GET /api/recipes?include=matchFields` can supply Phase 10 with a matcher-ready recipe pool.
- Plain `GET /api/recipes` remains a lightweight list endpoint with existing `take` behavior.
- `GET /api/recipes/:id` continues to resolve `legacyId`/`slug` ids such as `mapo-tofu`.
- Public recipes reads only return `PUBLISHED` recipes.
- Backend responses are stable DTOs and do not require frontend code to understand Prisma internals.
- Backend contract tests and backend build pass.
</success_criteria>
