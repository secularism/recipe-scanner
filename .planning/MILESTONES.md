# Project Milestones: 菜谱生成小程序 (recipe-scanner)

## v1.1 API 接入 (Shipped: 2026-06-26)

**Delivered:** 菜谱读取链路从本地 mock 数据切换到真实 recipes API，结果页、详情页、收藏页和历史跳转均可通过真实读接口工作，同时保留本地 matcher、收藏和历史体验。

**Phases completed:** Phase 9-11（5 plans, 20 tasks）

**Key accomplishments:**

- 后端 `GET /api/recipes?include=matchFields` 提供稳定 match-ready DTO，并保持列表轻量读取。
- 小程序新增集中 API config、recipes API client、DTO mapper 和可注入 fake request 测试路径。
- 结果页从真实 recipes API 拉取候选池后继续运行现有本地 matcher，并提供 loading、error、retry。
- 详情页通过 `fetchRecipeById(id)` 读取真实详情，分享 path、历史跳转和收藏入口都进入同一 API 驱动详情页。
- 收藏页保留本地 id 存储，但使用真实 recipes 数据展示卡片；API 缺失或失败不会清空本地收藏、历史或草稿。

**Stats:**

- 50 files created or modified since v1.0 archive
- 5,646 insertions / 440 deletions across source, tests, and planning docs
- 3 phases, 5 plans, 20 planned tasks
- Timeline: 2026-06-21 to 2026-06-26
- Open artifact audit: 0 debug sessions, 0 quick tasks, 0 todos, 0 UAT gaps, 0 verification gaps

**Git range:** `f552aed` -> `d36c334`

**Known gaps:** No `.planning/v1.1-MILESTONE-AUDIT.md` file was present at close. The open artifact audit was clear, all v1.1 requirements are mapped, and `VERIFY-04` was intentionally handled as a Phase 11 summary deferral rather than README/release checklist work.

**What's next:** Start the next milestone with `$gsd-new-milestone`, likely focused on remote writes, recognition/upload/OCR, AI recipe generation, or user identity and sync.

---

## v1.0 MVP (Shipped: 2026-06-21)

**Delivered:** 微信小程序 v1 主流程、体验升级、monorepo 后端骨架与首段 PostgreSQL 真实数据链路已完成并归档。

**Phases completed:** Phase 1-8 documented; GSD-tracked Phase 5-8 contained 5 plans total.

**Key accomplishments:**

- 完成食材、调味料、菜系、口味输入到 1-3 个菜谱生成结果的本地匹配主流程。
- 完成菜谱结果、详情、收藏、历史、微信好友分享和分享直达详情能力。
- 按 OpenDesign 方向重构主要页面与公共组件，并修复小程序端首页插图和预设卡问题。
- 升级首页与生成页体验，加入场景预设、已选摘要、草稿恢复和最近使用入口。
- 将仓库整理为 `apps/miniapp`、`apps/api`、`packages/shared`、`infra` 的 monorepo 结构。
- 接入 NestJS、Prisma、PostgreSQL、seed 与 `recipes` 只读接口，打通首段真实后端数据链路。

**Stats:**

- 114 files created or modified since first scaffold commit
- 25,786 tracked text lines across source, docs, schema, config, and planning files
- 8 roadmap phases; 5 GSD-tracked plans in Phase 5-8
- Timeline: 2026-06-01 to 2026-06-21; last implementation merge on 2026-06-14
- Open artifact audit: 0 debug sessions, 0 quick tasks, 0 todos, 0 UAT gaps, 0 verification gaps

**Git range:** `e011793` -> `4b16898`

**Known gaps:** No `.planning/v1.0-MILESTONE-AUDIT.md` file was present at close. The open artifact audit was clear; run `$gsd-audit-milestone` in a future pass if stricter cross-requirement audit evidence is needed.

**What's next:** Start v1.1 with `$gsd-new-milestone`, likely focused on recipe API expansion, write APIs for favorites/history/recognition jobs, and upload/OCR preparation.

---
