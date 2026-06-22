# Phase 10: miniapp-api-generation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-22
**Phase:** 10-miniapp-api-generation
**Areas discussed:** request timing, failure and retry behavior, recipe pool reuse, history writes, API configuration, testing strategy

---

## Request Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Result page request | Enter result page, show loading, fetch real recipe pool, then run existing matcher. Fits current routing with minimal spread. | Yes |
| Generator page pre-request | Fetch recipes before navigating to result page. Faster result page, but generator page owns loading/error state. | |
| App launch preload | Fetch recipes on app launch and keep in memory. Fastest result page, but adds startup work and unclear failure timing. | |

**User's choice:** Result page request.
**Notes:** Keep generator page focused on input collection. Concentrate loading/error/retry in `result.vue`.

---

## Failure and Retry Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Error + retry, no fallback | Show error state and retry action. Do not use local `ALL_RECIPES` on failure. | Yes |
| Fallback to local recipes | Automatically generate from local recipes after API failure. More forgiving, but can mask backend integration issues. | |
| Development fallback only | Allow fallback in development but not production. Flexible, but adds configuration branches. | |

**User's choice:** Error + retry, no fallback.
**Notes:** This keeps Phase 10 honest: if the real API fails, the user sees a real failure instead of a mock-backed success.

---

## Recipe Pool Reuse

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse current pool | Fetch once on result page load and use the same mapped recipes for generate and shuffle. | Yes |
| Request on every shuffle | Refetch recipes each time "换一换" is tapped. Fresh data, but slower and unnecessary for current dataset. | |
| Short cache with TTL | Cache globally or per page and refetch after expiry. More complete data layer, but extra complexity. | |

**User's choice:** Reuse current pool.
**Notes:** Current live pool is small enough for one full fetch. `generate` and `shuffle` should both use that fetched pool.

---

## History Writes

| Option | Description | Selected |
|--------|-------------|----------|
| Write only after successful result | API succeeds and matcher returns a top result, then write local history. | Yes |
| Write input immediately | Record input when result page opens, even if API fails. Does not match current history schema well. | |
| Write when detail opens | Record only recipes the user opens. Cleaner history, but changes current generate-to-history behavior. | |

**User's choice:** Write only after successful result.
**Notes:** API failures and empty results should not create local history records.

---

## API Configuration

| Option | Description | Selected |
|--------|-------------|----------|
| Central config file | Add a miniapp API config file with default `http://47.96.36.31/api`. Easy to change later. | Yes |
| Environment variable | Inject base URL through Vite/uni env configuration. More formal, but project has no env setup yet. | |
| Constant inside client | Fastest, but couples endpoint changes to client business code. | |

**User's choice:** Central config file.
**Notes:** Phase 10 can use the current HTTP server for development. HTTPS and WeChat domain release requirements remain visible for Phase 11.

---

## Testing Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Fake/local tests | Mapper and client tests use fixtures/fake request; generator tests use explicit local recipe pools. | Yes |
| Live network tests | Automated tests call the real remote API. Stronger end-to-end coverage, but unstable. | |
| Default fake plus manual live script | Keep default tests local and add an optional live script. More complete, but more files. | |

**User's choice:** Fake/local tests.
**Notes:** Default tests should not depend on `47.96.36.31`. Manual curl/browser checks cover live API sanity.

---

## the agent's Discretion

- Choose exact service/config/mapper file names and module boundaries.
- Choose whether to parameterize existing generator helpers or add async wrappers, as long as matcher remains pure.
- Choose result page loading/error UI details that fit the existing visual system.

## Deferred Ideas

- Detail page, favorites page, and history page real API reads are Phase 11.
- HTTPS and WeChat request合法域名 release checklist are Phase 11 verification work.
- Remote writes, login, OCR, AI generation, cache TTL, and server-side matching are out of Phase 10 scope.
