# Requirements: 菜谱生成小程序 v1.2 用户身份与远程同步

**Defined:** 2026-07-01
**Core Value:** 用户输入食材和调味料，立刻得到一份可做的菜谱。

## v1.2 Requirements

### HTTPS Domain Readiness

- [ ] **INFRA-01**: 小程序后端 API 可通过 `https://978978978.xyz/api` 访问健康检查、菜谱列表和菜谱详情接口。
- [ ] **INFRA-02**: 小程序 API base URL 仅在 HTTPS 健康检查和 recipes 冒烟测试通过后切换到 `https://978978978.xyz/api`。
- [ ] **INFRA-03**: 项目文档记录 HTTPS、备案域名和微信 request 合法域名的发布前置检查项，避免再次误把 HTTP IP 当作可发布配置。

### Authentication

- [ ] **AUTH-01**: 用户可通过微信静默登录建立后端用户身份，不需要额外输入账号密码。
- [ ] **AUTH-02**: 后端可用小程序登录 code 调微信 `code2Session`，并按 openid 创建或更新 `User`。
- [ ] **AUTH-03**: 后端只向小程序返回应用自有 session token 和必要用户信息，不返回微信 `session_key`。
- [ ] **AUTH-04**: 受保护的 `/api/me/*` 接口必须校验 `Authorization: Bearer <token>`，无效或过期 token 返回稳定错误。
- [ ] **AUTH-05**: 微信配置缺失、code 无效或微信接口失败时，登录错误不会影响公开 recipes 读取和本地生成主流程。

### Favorites Sync

- [ ] **FAV-01**: 用户登录前已有的本地收藏 id 在登录、远程拉取或同步失败后都不会丢失。
- [ ] **FAV-02**: 首次登录合并会把本地收藏上传到后端，并按用户和菜谱做幂等写入。
- [ ] **FAV-03**: 收藏页可读取远程收藏并与本地收藏做增量合并。
- [ ] **FAV-04**: 收藏和取消收藏保持本地优先，已登录时再尝试同步到远程。
- [ ] **FAV-05**: 收藏远程同步失败时，本地状态保持可用，并保留可重试的 pending 状态。

### History Sync

- [ ] **HIST-01**: 用户登录前已有的本地生成历史在登录、远程拉取或同步失败后都不会丢失。
- [ ] **HIST-02**: 历史记录具备客户端幂等标识，首次登录合并或重试不会导致历史翻倍。
- [ ] **HIST-03**: 结果页成功生成后继续先写本地历史，已登录时再 best-effort 写入远程。
- [ ] **HIST-04**: 历史页可读取远程历史并与本地历史做增量合并，不覆盖未同步的本地记录。
- [ ] **HIST-05**: 删除单条历史和清空历史在远程失败时不会破坏本地数据，并保留明确的待同步状态。

### Sync Resilience and Verification

- [ ] **SYNC-01**: 小程序启动时先加载本地收藏、历史和草稿，再后台执行登录与同步。
- [ ] **SYNC-02**: 小程序遇到 401 或过期 token 时会清理本地 token 并重新登录，不阻塞核心生成流程。
- [ ] **SYNC-03**: 收藏和历史同步接口有 payload 上限，和小程序本地 `MAX_ITEMS` 等边界保持一致。
- [ ] **SYNC-04**: 后端 auth/favorites/history 契约测试、小程序 auth/sync client/store 测试，以及既有 miniapp 验证门均通过。

## Future Requirements

### Profile and Account UX

- **PROFILE-01**: 用户可查看或管理昵称、头像等资料信息。
- **PROFILE-02**: 用户可明确查看当前同步账号和同步状态详情。

### Recognition and Upload

- **RECOG-01**: 用户可上传或拍摄图片创建识别任务。
- **RECOG-02**: OCR 结果可转为候选食材。
- **RECOG-03**: 识别任务状态可轮询或刷新。

### AI Recipe Generation

- **AI-01**: 系统可在本地规则匹配之外生成新菜谱。
- **AI-02**: AI 生成结果有可解释的食材、调味料和步骤结构。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 用户资料页、头像和昵称授权 | v1.2 只需要静默身份支撑同步，资料页会扩大隐私和 UI 范围 |
| 手机号登录或第三方 OAuth | 微信小程序静默登录足够支撑本 milestone |
| 跨设备冲突解决 UI | v1.2 采用本地优先和增量合并，复杂冲突界面后续单独规划 |
| 完整离线操作队列 | 本阶段只保留必要 pending 状态和重试入口 |
| 图片上传、OCR、识别任务 | 依赖对象存储和异步任务链路，后续 milestone 单独规划 |
| AI 生成菜谱 | 当前核心仍是本地 matcher/generator 和真实 recipes 数据源 |
| 管理后台 | 同步能力不需要后台管理界面 |
| 完整正式发布材料 | v1.2 只补 HTTPS/request 合法域名相关发布前置项，隐私指引、提审文案等后续再做 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 12 | Pending |
| INFRA-02 | Phase 12 | Pending |
| INFRA-03 | Phase 12 | Pending |
| AUTH-01 | Phase 13 | Pending |
| AUTH-02 | Phase 13 | Pending |
| AUTH-03 | Phase 13 | Pending |
| AUTH-04 | Phase 13 | Pending |
| AUTH-05 | Phase 13 | Pending |
| FAV-01 | Phase 14 | Pending |
| FAV-02 | Phase 14 | Pending |
| FAV-03 | Phase 14 | Pending |
| FAV-04 | Phase 14 | Pending |
| FAV-05 | Phase 14 | Pending |
| HIST-01 | Phase 15 | Pending |
| HIST-02 | Phase 15 | Pending |
| HIST-03 | Phase 15 | Pending |
| HIST-04 | Phase 15 | Pending |
| HIST-05 | Phase 15 | Pending |
| SYNC-01 | Phase 16 | Pending |
| SYNC-02 | Phase 16 | Pending |
| SYNC-03 | Phase 16 | Pending |
| SYNC-04 | Phase 16 | Pending |

**Coverage:**
- v1.2 requirements: 22 total
- Mapped to phases: 22
- Unmapped: 0

---
*Requirements defined: 2026-07-01*
*Last updated: 2026-07-01 after v1.2 roadmap creation*
