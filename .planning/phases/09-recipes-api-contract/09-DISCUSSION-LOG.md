# Phase 9: recipes-api-contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-21
**Phase:** 09-recipes-api-contract
**Areas discussed:** 接口形态, 响应 DTO 形状, 公开 id 策略, matchFields 字段默认值

---

## 接口形态

| Option | Description | Selected |
|--------|-------------|----------|
| 扩展 `GET /api/recipes` | Directly return match-ready DTO from the existing list endpoint. | |
| `GET /api/recipes?include=matchFields` | Keep the existing endpoint and request matcher fields through an explicit query parameter. | yes |
| 新增 `GET /api/recipes/matchable` | Dedicated matcher endpoint with a separate route. | |

**User's choice:** Use `GET /api/recipes?include=matchFields`.
**Notes:** User preferred the more future-proof query-parameter shape instead of the quickest one-endpoint expansion. Follow-up decision: when `include=matchFields` is present, return all `PUBLISHED` recipes by default; plain list keeps default `take=20`.

---

## 响应 DTO 形状

| Option | Description | Selected |
|--------|-------------|----------|
| 后端直接返回前端 `Recipe` 形状 | Backend maps fields into miniapp naming. | |
| 后端返回稳定 API DTO，前端 mapper 转换 | Backend exposes API DTO; Phase 10 maps it to miniapp `Recipe`. | yes |
| 后端裸返 Prisma 字段 | Fastest backend path but leaks internal schema. | |

**User's choice:** Backend returns stable API DTO; frontend mapper converts in Phase 10.
**Notes:** Backend should lift `metadata.difficulty` to top-level `difficulty` and avoid exposing raw `metadata` to the miniapp contract.

---

## 公开 id 策略

| Option | Description | Selected |
|--------|-------------|----------|
| 小程序继续使用 `legacyId`/`slug` | Preserve readable, v1.0-compatible ids for sharing, favorites, and history. | yes |
| 小程序切到数据库 UUID | Use database id everywhere. | |
| DTO 同时返回多套 id，前端自行选择 | Flexible but risks inconsistent frontend usage. | |

**User's choice:** Miniapp public id remains `legacyId`/`slug`.
**Notes:** Database UUID remains backend-internal. If exposed, it should be clearly named as `databaseId`; frontend `Recipe.id` should not become UUID.

---

## matchFields 字段默认值

| Option | Description | Selected |
|--------|-------------|----------|
| 后端补默认值，前端拿到稳定 DTO | Backend serializer makes DTO miniapp-consumable. | yes |
| 后端返回真实 null，前端 mapper 兜底 | API mirrors database more directly. | |
| 字段不完整的菜谱不返回 | Cleaner pool but may silently hide data. | |

**User's choice:** Backend DTO layer fills stable defaults.
**Notes:** Defaults should include `summary ?? ""`, `cookMinutes ?? 0`, `difficulty` default `2`, and arrays for `ingredients`, `seasonings`, and `steps`.

---

## the agent's Discretion

- Choose the exact DTO helper/type structure.
- Choose how to parse `include`, as long as `include=matchFields` works.
- Choose test shape and unsupported-include behavior without adding unrelated API capabilities.

## Deferred Ideas

- Remote favorites/history write APIs.
- Image upload, OCR, and recognition jobs.
- Pagination, caching, or server-side matching when recipe volume grows.
