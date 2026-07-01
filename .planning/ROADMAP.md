# Roadmap: 菜谱生成小程序 (recipe-scanner)

## Milestones

- [x] **v1.0 MVP** - Phase 1-8 shipped on 2026-06-21. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)
- [x] **v1.1 API 接入** - Phase 9-11 shipped on 2026-06-26. Archive: [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md)
- [ ] **v1.2 用户身份与远程同步** - Phase 12-16 planned on 2026-07-01.

## Current Position

v1.2 已完成研究、需求定义和路线图拆分。当前下一步是 Phase 12，先把备案域名的 HTTPS API 访问打通并形成可发布前置检查，再进入微信静默登录和收藏/历史远程同步实现。

Next command:

```bash
$gsd-discuss-phase 12
```

## v1.2 用户身份与远程同步

**Goal:** 为小程序建立真实用户身份基础，并把本地收藏、历史记录接入后端远程写入与恢复同步，同时保留现有本地缓存体验。

| # | Phase | Goal | Requirements | Status |
|---|---|---|---|---|
| 12 | https-domain-readiness | 打通 `https://978978978.xyz/api` 并明确小程序 API base URL 切换门槛 | INFRA-01..03 | Planned |
| 13 | auth-session-foundation | 建立微信静默登录、服务端 session 和 `/api/me/*` 鉴权基础 | AUTH-01..05 | Planned |
| 14 | favorites-remote-sync | 实现收藏远程 list/merge/add/delete 与小程序本地优先同步 | FAV-01..05 | Planned |
| 15 | history-remote-sync | 实现历史远程 list/merge/create/delete/clear 与幂等上传 | HIST-01..05 | Planned |
| 16 | bootstrap-sync-hardening | 串联启动登录、首次合并、token 过期恢复和完整验证门 | SYNC-01..04 | Planned |

### Phase 12: https-domain-readiness

**Goal:** 让已备案域名成为小程序可用的 HTTPS API 入口，并避免在 HTTPS 未通过时误切前端配置。

**Requirements:** INFRA-01, INFRA-02, INFRA-03

**Success Criteria:**
1. `https://978978978.xyz/api/health` 返回 200，并返回 `recipe-scanner-api` 健康检查 JSON。
2. `https://978978978.xyz/api/recipes` 和 `https://978978978.xyz/api/recipes/mapo-tofu` 返回 200。
3. 文档记录当前 HTTP 可用、HTTPS 未通时不得修改 `API_BASE_URL` 的规则。
4. HTTPS 通过后，小程序 request 合法域名和前端 API base URL 有明确切换步骤。

**Plans:** TBD

**Cross-cutting constraints:**
- 在 HTTPS 冒烟测试通过前，不修改 `apps/miniapp/src/config/api.ts`。
- 不把完整提审材料、隐私指引或用户资料页纳入本 phase。

### Phase 13: auth-session-foundation

**Goal:** 后端接入微信静默登录，建立服务端自有 session，并为用户同步接口提供鉴权边界。

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05

**Success Criteria:**
1. `POST /api/auth/wechat` 可用登录 code 换取用户身份并返回应用自有 token。
2. 后端新增 `UserSession` 或等价 session 存储，只保存 token hash 和过期时间。
3. 登录响应、日志和测试 fixture 都不包含微信 `session_key`。
4. `/api/me/*` 可通过 guard 读取当前用户上下文，无 token、无效 token 和过期 token 都返回稳定错误。
5. 微信配置缺失或 code2Session 失败时，公开 recipes 接口和本地生成流程不受影响。

**Plans:** TBD

**Cross-cutting constraints:**
- 优先使用 opaque random bearer token，不引入 JWT/Passport，除非实现阶段证明需要。
- 微信 `session_key` 只允许留在后端 auth service 内部边界。

### Phase 14: favorites-remote-sync

**Goal:** 收藏能力从本地 id 列表扩展到远程幂等同步，同时保持本地优先和失败可恢复体验。

**Requirements:** FAV-01, FAV-02, FAV-03, FAV-04, FAV-05

**Success Criteria:**
1. 后端提供当前用户收藏 list、merge、add、delete endpoint，公开 recipe id 由服务端解析成内部 UUID。
2. 收藏 merge 对同一用户和菜谱幂等，重复上传不会产生重复收藏。
3. 小程序收藏 store 保留本地优先更新，远程失败不回滚本地状态。
4. 收藏页可从远程 hydrate 本地收藏，但不能清空未同步的本地收藏。
5. 收藏同步失败有 pending 状态和重试入口。

**Plans:** TBD

**Cross-cutting constraints:**
- 不改变 recipes 公开读接口契约。
- 不引入复杂跨设备冲突 UI，v1.2 采用本地最后操作优先。

### Phase 15: history-remote-sync

**Goal:** 生成历史从本地快照扩展到远程同步，并通过客户端幂等标识避免 bootstrap 重复写入。

**Requirements:** HIST-01, HIST-02, HIST-03, HIST-04, HIST-05

**Success Criteria:**
1. `GenerationHistory` 或 DTO 具备 `clientItemId` 等幂等字段，重复 merge 不会让历史翻倍。
2. 后端提供当前用户历史 list、merge、create、delete、clear endpoint。
3. 结果页仍先调用本地 `addIfFresh`，远程写入为 best-effort。
4. 历史页可从远程 hydrate 本地历史，但不覆盖未同步的本地记录。
5. 删除单条历史和清空历史在远程失败时保留清晰 pending 状态。

**Plans:** TBD

**Cross-cutting constraints:**
- `matchedRecipeIds` 对小程序继续返回 public id，不把数据库 UUID 暴露给前端业务逻辑。
- 不重写 matcher/generator 推荐算法。

### Phase 16: bootstrap-sync-hardening

**Goal:** 串联小程序启动登录、首次本地数据合并、token 过期恢复和完整验证门，确保同步失败不破坏核心体验。

**Requirements:** SYNC-01, SYNC-02, SYNC-03, SYNC-04

**Success Criteria:**
1. `App.vue` 或启动协调逻辑先加载本地 store，再后台执行登录与同步。
2. 401/过期 token 会清理 token 并重新登录或等待重试，不阻塞生成、收藏和历史本地使用。
3. 收藏和历史同步 payload 有数量上限，并和本地 `MAX_ITEMS` 等边界保持一致。
4. 后端 contract tests、小程序 auth/sync API/store tests、miniapp type-check、e2e、matcher 和 mp-weixin build 全部通过。
5. v1.2 SUMMARY/REVIEW 记录 HTTPS、auth、收藏、历史和同步验证结果。

**Plans:** TBD

**Cross-cutting constraints:**
- 同步失败不得清空或破坏本地收藏、历史和草稿数据。
- 默认测试继续使用 fake request，不依赖公网微信接口或真实 `uni.request`。

## Archived Milestones

<details>
<summary>v1.1 API 接入 (Phase 9-11) - shipped 2026-06-26</summary>

| # | Phase | Goal | Plans | Final Status |
|---|---|---|---|---|
| 9 | recipes-api-contract | 补齐后端 match-ready recipes 读接口和稳定响应映射边界 | 1/1 | Complete |
| 10 | miniapp-api-generation | 新增小程序 API client/mapper，并让结果页从真实 recipes 数据源生成 | 2/2 | Complete, merged |
| 11 | api-read-views-verification | 详情、收藏展示、历史跳转走真实接口，并完成验证门 | 2/2 | Complete, merged |

Detailed archive:
- [v1.1 roadmap archive](milestones/v1.1-ROADMAP.md)
- [v1.1 requirements archive](milestones/v1.1-REQUIREMENTS.md)

Phase execution directories remain in `.planning/phases/` for traceability.

</details>

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

1. 图片上传、对象存储、OCR 和拍照识别任务链路。
2. AI 生成菜谱。
3. 用户资料页与更完整的跨设备同步体验。
4. 完整正式发布材料、隐私指引和提审文案。
