# Roadmap: 菜谱生成小程序 (recipe-scanner)

## Milestones

- [x] **v1.0 MVP** - Phase 1-8 shipped on 2026-06-21. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)
- [ ] **v1.1 API 接入** - Phase 9-11 planned on 2026-06-21.

## Current Position

Phase 9 is complete. Phase 10 is planned and ready for execution.

Next command:

```bash
$gsd-execute-phase 10
```

## v1.1 API 接入

**Goal:** 把前端菜谱读取从本地 mock 数组切到真实后端 API，同时保留现有本地 matcher 的推荐体验。

| # | Phase | Goal | Requirements | Status |
|---|---|---|---|---|
| 9 | recipes-api-contract | 补齐后端 match-ready recipes 读接口和稳定响应映射边界 | API-01..04 | Complete |
| 10 | miniapp-api-generation | 新增小程序 API client/mapper，并让结果页从真实 recipes 数据源生成 | CLIENT-01..04, GENAPI-01..04 | Ready to execute |
| 11 | api-read-views-verification | 详情、收藏展示、历史跳转走真实接口，并补齐测试和发布前置文档 | READ-01..05, VERIFY-01..04 | Planned |

### Phase 9: recipes-api-contract

**Goal:** 后端 recipes 接口返回前端 matcher 与详情页需要的稳定读模型。

**Requirements:** API-01, API-02, API-03, API-04

**Success Criteria:**
1. `GET /api/recipes` 或专用 match-ready 读接口返回 ingredients、seasonings、steps 等 matcher 必需字段。
2. `GET /api/recipes/:id` 支持 `legacyId`/`slug`，`mapo-tofu` 等旧分享路径继续可用。
3. 小程序读取接口只暴露 `PUBLISHED` 菜谱。
4. 后端响应有清晰 DTO 或 serializer，前端不用理解 Prisma 内部字段。

### Phase 10: miniapp-api-generation

**Goal:** 小程序结果页从真实 recipes API 拉取菜谱数据，再沿用现有 matcher 完成生成和换一换。

**Requirements:** CLIENT-01, CLIENT-02, CLIENT-03, CLIENT-04, GENAPI-01, GENAPI-02, GENAPI-03, GENAPI-04

**Success Criteria:**
1. 小程序存在统一 recipes API client，集中管理 base URL、`uni.request` 和错误处理。
2. 后端菜谱响应可映射成现有 `Recipe` 类型，matcher 测试数据不依赖真实网络。
3. 结果页生成流程支持 loading、error、retry。
4. “换一换”和历史入库继续基于真实 API 菜谱数据工作。

**Plans:**

**Wave 1**
- `10-01-miniapp-recipes-client-mapper` — 新增 API config、recipes API client、DTO mapper，并让 generator/shuffle 支持显式 recipe pool。

**Wave 2** *(blocked on Wave 1 completion)*
- `10-02-result-api-generation` — 将 result 页接入真实 recipes API，补齐 loading/error/retry、真实 pool 换一换和成功后历史写入。

**Cross-cutting constraints:**
- API 失败不得 fallback 到本地 `ALL_RECIPES`，默认测试不得依赖真实网络。

### Phase 11: api-read-views-verification

**Goal:** 详情页、收藏页展示和历史记录跳转全部通过真实 recipes 读接口获取菜谱，并完成验证门。

**Requirements:** READ-01, READ-02, READ-03, READ-04, READ-05, VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04

**Success Criteria:**
1. 详情页不再依赖本地 `findRecipeById`，分享 path 可直接请求真实详情。
2. 收藏页仍存本地 id 列表，但卡片展示数据来自 API。
3. 历史页仍存本地记录，但点击记录进入 API 驱动详情。
4. 网络失败不会清空收藏、历史、草稿等本地数据。
5. mapper/API client 测试、miniapp type-check、e2e、matcher 和 build 全部通过。

## Archived Phases

<details>
<summary>v1.0 MVP (Phase 1-8) - shipped 2026-06-21</summary>

| # | Phase | Goal | Final Status |
|---|---|---|---|
| 1 | 项目骨架与基础架构 | 初始化 uni-app + Vue 3 + TypeScript 工程 | 已完成 |
| 2 | 菜谱数据与匹配引擎 | 建立本地菜谱库与匹配逻辑 | 已完成 |
| 3 | 页面与组件 | 完成输入、结果、详情主流程 | 已完成 |
| 4 | 收藏 / 历史 / 分享 / 收尾 | 完成 v1 持久化与分享能力 | 已完成 |
| 5 | UI 重构 | 按 OpenDesign 重写页面与组件视觉 | 已完成，已合并 |
| 6 | 首页与生成页体验升级 | 强化主流程表达、草稿恢复、最近使用 | 已完成，已合并 |
| 7 | Monorepo 与后端初始化 | 整理同仓结构并初始化 NestJS | 已完成，已合并 |
| 8 | 数据库初始化 | 接入 Prisma + PostgreSQL，打通首段真实数据链路 | 已完成，已合并 |

Detailed archive:
- [v1.0 roadmap archive](milestones/v1.0-ROADMAP.md)
- [v1.0 requirements archive](milestones/v1.0-REQUIREMENTS.md)

Phase execution directories remain in `.planning/phases/` for traceability.

</details>

## Backlog / Future Direction

1. 收藏、历史、识别任务真实写接口。
2. 图片上传、对象存储、OCR 和拍照识别任务链路。
3. AI 生成菜谱。
4. 远程用户身份、跨设备同步和用户资料系统。
