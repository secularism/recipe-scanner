# Phase 9: recipes-api-contract - Context

**Gathered:** 2026-06-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 9 delivers the backend read-contract for recipes API integration. It must make `GET /api/recipes` able to serve a match-ready recipe list for the miniapp while keeping normal lightweight list behavior intact. It does not implement miniapp API client code, remote favorites/history writes, login, image recognition, OCR, or matcher algorithm changes.

</domain>

<decisions>
## Implementation Decisions

### Interface Shape
- **D-01:** Keep `GET /api/recipes` as the single recipes list entrypoint.
- **D-02:** Use `include=matchFields` to request the match-ready recipe list, e.g. `GET /api/recipes?include=matchFields`.
- **D-03:** Do not add a dedicated `/api/recipes/matchable` endpoint in Phase 9.
- **D-04:** Plain `GET /api/recipes` keeps lightweight list behavior and its current `take` semantics.
- **D-05:** `GET /api/recipes?include=matchFields` returns all `PUBLISHED` recipes by default so the miniapp matcher receives the complete recipe pool.

### API DTO Shape
- **D-06:** Return a stable API DTO. Do not expose raw Prisma models and do not make the backend emit the frontend `Recipe` type directly.
- **D-07:** The API DTO should use backend/API language such as `title`, `summary`, `tastes`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`.
- **D-08:** The backend should lift `metadata.difficulty` into an explicit top-level `difficulty` field.
- **D-09:** The backend should not expose the whole `metadata` object to the miniapp as part of the match-ready contract unless a future requirement needs it.
- **D-10:** Phase 10 will map the API DTO into the existing miniapp `Recipe` type (`title -> name`, `summary -> shortDesc`, `tastes -> taste`, `cookMinutes -> cookTime`).

### Public ID Strategy
- **D-11:** The miniapp public recipe id remains `legacyId`/`slug`, preserving v1.0 sharing, favorites, and history IDs such as `mapo-tofu`.
- **D-12:** Database UUID remains backend-internal and must not become the miniapp business id.
- **D-13:** If the DTO exposes the UUID, name it explicitly as an internal/database id such as `databaseId`; frontend business logic should not depend on it.
- **D-14:** Detail lookup must continue accepting `legacyId` and `slug` through `GET /api/recipes/:id`.

### Match Fields and Defaults
- **D-15:** `include=matchFields` must return matcher/detail-ready fields: public id data, title, summary, cuisine, tastes, tags, cookMinutes, difficulty, ingredients, seasonings, and steps.
- **D-16:** DTO serialization should fill stable defaults for miniapp consumption: `summary ?? ""`, `cookMinutes ?? 0`, `difficulty` from `metadata.difficulty` with default `2`, and array defaults for `ingredients`, `seasonings`, and `steps`.
- **D-17:** Only `PUBLISHED` recipes should be returned to the miniapp read contract.
- **D-18:** Future pagination, caching, or server-side matching can be introduced later when recipe volume grows; Phase 9 optimizes for a simple full read pool.

### the agent's Discretion
- Choose the exact TypeScript type/DTO implementation style that best matches the existing NestJS codebase.
- Choose whether `include` is parsed as a string or future-proofed as a comma-separated list, as long as `include=matchFields` works and is tested.
- Choose validation/error handling details for unsupported `include` values, but avoid adding unrelated API features.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning
- `.planning/ROADMAP.md` - Phase 9 goal, requirements mapping, and v1.1 phase order.
- `.planning/REQUIREMENTS.md` - API-01 through API-04 are the locked Phase 9 requirements.
- `.planning/PROJECT.md` - v1.1 scope and out-of-scope boundaries.
- `.planning/STATE.md` - current milestone status and known context.

### Backend Code
- `apps/api/src/recipes/recipes.controller.ts` - current recipes routes and query handling.
- `apps/api/src/recipes/recipes.service.ts` - current Prisma queries, `take` behavior, and `legacyId`/`slug` lookup logic.
- `apps/api/prisma/schema.prisma` - Recipe model fields, `RecipeStatus`, and JSON fields.
- `apps/api/prisma/seed.ts` - mapping from miniapp mock data into database fields.

### Miniapp Contract Consumers
- `apps/miniapp/src/types/recipe.ts` - frontend `Recipe`, `RecipeStep`, `Cuisine`, and `Taste` types.
- `apps/miniapp/src/services/generator.ts` - current local `ALL_RECIPES` dependency that Phase 10 will replace.
- `apps/miniapp/src/services/matcher.ts` - matcher field requirements (`ingredients`, `seasonings`, `cuisine`, `taste`).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/api/src/recipes/recipes.controller.ts`: existing `GET /api/recipes` can be extended with an `include` query parameter.
- `apps/api/src/recipes/recipes.service.ts`: existing `getRecipes()` can branch on `include=matchFields` while preserving plain-list behavior.
- `apps/api/prisma/seed.ts`: already stores miniapp recipe ids into both `legacyId` and `slug`, making public-id compatibility practical.
- `apps/miniapp/src/types/recipe.ts`: defines the Phase 10 target type for frontend mapping.

### Established Patterns
- Backend currently uses NestJS controller/service modules with Prisma select/findMany calls.
- Existing list endpoint has `cuisine` and `take` query parameters and caps `take` at 100.
- Detail lookup already avoids UUID parsing errors for non-UUID ids by using `legacyId` and `slug`.
- Miniapp matcher expects local `Recipe[]` and should not be rewritten in Phase 9.

### Integration Points
- Add query parsing in `RecipesController.getRecipes()`.
- Add DTO/serializer functions in or near `RecipesService`, or a small local DTO helper if that keeps files under the project line limit.
- Include `where: { status: "PUBLISHED" }` for miniapp-facing reads.
- Preserve current detail route while applying the same stable DTO thinking where useful.

</code_context>

<specifics>
## Specific Ideas

- Request form for Phase 10: `GET /api/recipes?include=matchFields`.
- Expected miniapp public id mapping in Phase 10: `Recipe.id = dto.slug ?? dto.legacyId`.
- The backend API DTO should expose `difficulty` directly instead of forcing the miniapp to read `metadata.difficulty`.
- Normal lightweight list behavior remains available for future non-matcher list views.

</specifics>

<deferred>
## Deferred Ideas

- Remote favorites/history write APIs belong to a future phase.
- Image upload, OCR, and recognition jobs belong to a future milestone.
- Pagination, caching, or server-side matching can be revisited when recipe volume grows.
- User login, profile, clientKey sync, and cross-device data are out of scope for Phase 9.

</deferred>

---

*Phase: 9-recipes-api-contract*
*Context gathered: 2026-06-21*
