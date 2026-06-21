---
phase: 09-recipes-api-contract
plan: 09-01-backend-recipes-read-contract
subsystem: api
tags: [nestjs, prisma, recipes, dto, contract-test]
requires:
  - phase: 08-database-init
    provides: Prisma Recipe model, seed data, and initial recipes read endpoints
provides:
  - Match-ready `GET /api/recipes?include=matchFields` backend read contract
  - Stable backend recipes DTO serializers
  - `PUBLISHED`-only public recipes reads
  - Database-free recipes contract test script
affects: [phase-10-miniapp-api-generation, phase-11-api-read-views-verification]
tech-stack:
  added: []
  patterns:
    - NestJS controller delegates query parsing boundary to service query object
    - Recipes service returns DTO serializers rather than raw Prisma records
    - Backend contract tests use fake Prisma client calls without live database access
key-files:
  created:
    - apps/api/src/recipes/recipes.dto.ts
    - apps/api/tests/recipes-contract.test.ts
  modified:
    - apps/api/src/recipes/recipes.controller.ts
    - apps/api/src/recipes/recipes.service.ts
    - apps/api/package.json
key-decisions:
  - "Use `include=matchFields` on the existing `GET /api/recipes` endpoint."
  - "Keep database UUID internal and expose `legacyId`/`slug` as public recipe identifiers."
  - "Return stable backend DTO fields and leave frontend `Recipe` mapping to Phase 10."
patterns-established:
  - "Recipe DTO serializers normalize nullable database fields before controller responses leave the backend."
  - "Contract tests assert Prisma query shape and response shape without requiring a live PostgreSQL connection."
requirements-completed: [API-01, API-02, API-03, API-04]
duration: 25 min
completed: 2026-06-22
---

# Phase 9 Plan 09-01: Backend Recipes Read Contract Summary

**Backend recipes reads now expose a stable match-ready DTO through `include=matchFields` while preserving lightweight list behavior.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-06-22T00:00:00+08:00
- **Completed:** 2026-06-22T00:20:00+08:00
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Added `recipes.dto.ts` with explicit lightweight and full recipe DTO serializers.
- Extended `GET /api/recipes` to support `include=matchFields` while leaving the plain list lightweight with `take=20`.
- Added `PUBLISHED` filtering to public list and detail reads.
- Kept detail lookup compatible with `legacyId` and `slug` values such as `mapo-tofu`.
- Added `test:recipes-contract`, a database-free contract test that checks query shape, response shape, defaults, and unsupported include rejection.

## Task Commits

Each plan task was delivered in one implementation commit because the three tasks are tightly coupled and the project commit format requires a single-line message:

1. **Task T1: Create stable recipes DTO serializers** - `6880eca` (`feat: 新增 recipes API 契约响应`)
2. **Task T2: Extend recipes list and detail reads through the DTO contract** - `6880eca` (`feat: 新增 recipes API 契约响应`)
3. **Task T3: Add backend recipes contract verification** - `6880eca` (`feat: 新增 recipes API 契约响应`)

## Files Created/Modified

- `apps/api/src/recipes/recipes.dto.ts` - Defines stable recipes DTOs and serializer defaults.
- `apps/api/src/recipes/recipes.service.ts` - Adds `include=matchFields`, `PUBLISHED` filters, DTO serialization, and unsupported include rejection.
- `apps/api/src/recipes/recipes.controller.ts` - Accepts and forwards the `include` query parameter.
- `apps/api/tests/recipes-contract.test.ts` - Verifies backend recipes contract without a live database.
- `apps/api/package.json` - Adds `test:recipes-contract`.

## Decisions Made

- Used a local DTO helper file instead of shared package types so Phase 9 stays backend-only.
- Omitted raw Prisma `id`, `status`, and `metadata` from public DTOs; UUID remains backend-internal.
- Kept explicit positive `take` support for `include=matchFields`, but no default `take` is applied to match-ready reads.

## Deviations from Plan

None - the implementation stayed within the Phase 9 backend API contract scope.

## Issues Encountered

- The first contract test run needed TypeScript narrowing for the full DTO result; fixed with an explicit `RecipeFullDto[]` assertion in the test.
- The first contract test run used an incompatible default import for `node:assert/strict`; fixed by using a namespace import.
- AGENTS-wide miniapp verification commands were attempted, but current frontend tooling failed independently of Phase 9 backend changes:
  - `npm --prefix apps/miniapp run type-check` failed in `vue-tsc` with `Search string not found: "/supportedTSExtensions = .*(?=;)/"`.
  - `npx tsx apps/miniapp/tests/e2e.test.ts` and `npx tsx apps/miniapp/tests/matcher.test.ts` failed resolving `@/data/recipes`.
  - `npm --prefix apps/miniapp run build:mp-weixin` failed with an existing uni build `output.chunkFileNames` pattern error.

## Verification

- `npm --prefix apps/api run test:recipes-contract` - passed.
- `npm --prefix apps/api run build` - passed.
- `git diff --check` - passed before implementation commit.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 10 can now add a miniapp recipes API client and mapper against `GET /api/recipes?include=matchFields`. The backend returns `title`, `summary`, `tastes`, `cookMinutes`, `difficulty`, `ingredients`, `seasonings`, and `steps`, so Phase 10 should map those into the existing frontend `Recipe` fields without importing Prisma concepts.

## Self-Check: PASSED

- All Phase 9 plan tasks completed.
- All Phase 9 backend verification commands passed.
- API-01, API-02, API-03, and API-04 are satisfied by code and contract tests.
- No Prisma schema changes were made.

---
*Phase: 09-recipes-api-contract*
*Completed: 2026-06-22*
