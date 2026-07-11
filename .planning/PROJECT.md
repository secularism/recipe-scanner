# 菜谱生成小程序 (recipe-scanner)

## What This Is

一个微信小程序，用户输入或选择自己有的食材和调味料，再选菜系和口味偏好，系统生成当前可做的菜谱。v1.1 已完成从本地 mock 菜谱数据到真实 recipes 读接口的接入：结果页、详情页、收藏页展示和历史跳转均可读取真实 API，同时保留本地 matcher、收藏、历史和草稿体验。

## Core Value

**用户输入食材和调味料，立刻得到一份可做的菜谱**，无需思考“今天吃什么”。

## Current State

- **Shipped:** v1.0 MVP on 2026-06-21.
- **Shipped:** v1.1 API 接入 on 2026-06-26.
- **Frontend:** `apps/miniapp` 保留本地 matcher/generator、收藏、历史和分享主流程；结果页、详情页、收藏页展示已接入真实 recipes API。
- **Backend:** `apps/api` 已有 NestJS、Prisma、PostgreSQL、健康检查、match-ready recipes 列表接口和详情接口。
- **Data:** 现有 mock 菜谱可通过 `npm run prisma:seed` 写入远程 PostgreSQL。
- **Domain:** `http://978978978.xyz/api` 已可访问现有 API；`https://978978978.xyz/api` 当前仍需完成 HTTPS 配置后再切换小程序 base URL。
- **Planning:** v1.0 与 v1.1 roadmap/requirements 均已归档到 `.planning/milestones/`；v1.2 requirements/roadmap 已创建。
- **Current milestone:** v1.2 用户身份与远程同步，先补齐 HTTPS 域名前置项，再聚焦微信静默登录、收藏/历史远程写入与本地数据合并。

## Current Milestone: v1.2 用户身份与远程同步

**Goal:** 为小程序建立真实用户身份基础，并把本地收藏、历史记录接入后端远程写入与恢复同步，同时保留现有本地缓存体验。

**Target features:**

- 微信静默登录优先：小程序端通过 `uni.login` 获取登录 code，后端维护用户身份与鉴权边界。
- HTTPS 域名前置：备案域名的 HTTPS API 健康检查和 recipes 冒烟测试通过后，再切换小程序 API base URL。
- 收藏远程同步：收藏/取消收藏写入后端，收藏页可从远程恢复并保留本地缓存。
- 历史远程同步：生成历史写入后端，历史页可读取远程记录并保留本地体验。
- 首次登录本地数据合并：已有本地收藏和历史在首次登录后上传合并到云端。
- 失败与冲突边界：网络失败不破坏本地收藏/历史，同步失败可保持本地可用并支持后续重试。

## Tech Stack

- **小程序框架:** uni-app + Vue 3 + TypeScript + Composition API
- **构建:** Vite / uni-app build scripts
- **目标平台:** 微信小程序（主），H5 兼容
- **UI 库:** uni-ui
- **状态管理:** Pinia
- **前端存储:** uni.setStorageSync（收藏/历史）
- **后端:** NestJS + TypeScript
- **数据库:** PostgreSQL + Prisma
- **仓库结构:** `apps/miniapp`、`apps/api`、`packages/shared`、`infra`

## Constraints

- 微信小程序主包保持轻量，避免资源、页面和数据过大。
- 单个 `.ts` / `.vue` 文件保持在 300 行以内，超出时拆 composable、组件或服务。
- 小程序端 matcher/generator 继续保持本地、可测试、网络无关。
- 真实 API 失败时展示错误和重试，不 fallback 到本地 `ALL_RECIPES` 掩盖接口问题。
- 收藏、历史和草稿等本地数据不得因网络失败被清空或破坏。
- 分享仅支持微信好友，不做朋友圈分享。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 本地规则匹配优先 | 响应快、离线可用、成本低，AI 留到后续扩展 | v1.0 已实现，v1.1 继续复用 |
| Pinia 管理收藏与历史 | Vue 3 生态简洁，适合小程序本地状态 | v1.0 已实现，v1.1 继续保持本地存储 |
| 单数据源菜谱库 | 食材、调味料、菜系、口味、步骤集中管理，便于 seed 入库 | v1.0 已实现，v1.1 已映射到后端 DTO |
| 分享走微信好友 path | 用户明确不做朋友圈，详情页可通过 path 直达 | v1.0 已实现，v1.1 改为 API 驱动详情 |
| 按 OpenDesign 重构 UI | Phase 5 起按设计稿统一页面视觉与小程序适配 | v1.0 已实现 |
| 仓库改为 monorepo | 前后端和共享类型在同仓协同演进 | v1.0 已实现 |
| 后端采用 NestJS + Prisma + PostgreSQL | 为后续菜谱接口化、收藏、历史、识别任务提供真实数据层 | v1.0 打通首段链路，v1.1 扩展 recipes 读契约 |
| recipes 读接口先行 | 先替换菜谱读取数据源，避免同时引入用户系统和远程写同步 | v1.1 已完成 |
| 前端 public recipe id 使用 `slug || legacyId` | 数据库 UUID 保持后端内部实现，分享 path 和历史记录保持稳定 | v1.1 已完成 |
| API client 与 mapper 可注入测试 | 默认测试不依赖公网服务或真实 `uni.request` | v1.1 已完成 |
| 不添加本地 recipes fallback | 真实接口问题应暴露为 loading/error/retry，而不是被 mock 数据掩盖 | v1.1 已完成 |
| 正式发布前置文档暂缓 | 当前最多体验版使用，HTTPS/request-domain/ICP 等正式发布材料后续再做 | v1.1 已在 SUMMARY 中记录为 deferred |
| HTTPS 域名接入先于小程序 base URL 切换 | 备案已通过，但 HTTPS 当前未返回正常响应；必须先通过健康检查和 recipes 冒烟测试 | v1.2 Phase 12 前置项 |

## Requirements

### Validated

#### v1.0 MVP
- [x] 用户可从常用食材库多选食材，也可手动输入自定义食材。
- [x] 用户可从常用调味料库多选调味料，也可手动输入自定义调味料。
- [x] 用户可选择菜系和口味偏好。
- [x] 点击生成后基于以上条件匹配出 1-3 个菜谱，并按契合度排序。
- [x] 菜谱展示名称、所需食材、所需调味料和步骤。
- [x] 菜谱支持“换一换”和详情页单独访问。
- [x] 用户可收藏/取消收藏菜谱，收藏页列出本地收藏。
- [x] 历史记录页列出按时间倒序的生成结果，并支持单条删除。
- [x] 菜谱详情页支持微信好友分享和分享 path 直达详情。
- [x] 首页和生成页完成视觉层级、场景预设、已选摘要、草稿恢复和最近使用入口升级。

#### v1.1 API 接入
- [x] **API-01** 后端 recipes 列表接口可返回前端 matcher 所需字段。
- [x] **API-02** 后端 recipes 详情接口可通过 `legacyId` 或 `slug` 返回完整菜谱详情。
- [x] **API-03** 后端只返回 `PUBLISHED` 菜谱给小程序读取。
- [x] **API-04** 后端响应结构有稳定的前端映射边界，前端不直接依赖 Prisma 内部字段命名。
- [x] **CLIENT-01** 小程序有统一 recipes API client，封装 `uni.request`、base URL、错误处理和响应解析。
- [x] **CLIENT-02** 小程序有后端菜谱到前端 `Recipe` 类型的 mapper。
- [x] **CLIENT-03** API base URL 在一个配置文件中集中管理。
- [x] **CLIENT-04** recipes API client 可被测试替换或注入，不让单元测试依赖真实网络。
- [x] **GENAPI-01** 结果页生成流程异步加载真实 recipes 数据后继续使用现有 matcher。
- [x] **GENAPI-02** 结果页加载期间展示 loading，接口失败时展示错误与重试入口。
- [x] **GENAPI-03** “换一换”继续在真实 recipes 数据源产生的候选池中工作。
- [x] **GENAPI-04** 生成历史仍保存到本地缓存，记录的 recipe id 可被详情接口解析。
- [x] **READ-01** 详情页通过真实 recipes 详情接口读取菜谱，不再依赖本地 `findRecipeById`。
- [x] **READ-02** 微信分享 path 可用 path 中的 id/slug 拉取真实菜谱详情。
- [x] **READ-03** 收藏页仍使用本地收藏 id 列表，但展示菜谱卡片时从真实接口读取对应菜谱信息。
- [x] **READ-04** 历史页仍使用本地历史记录，但点击历史记录可通过真实接口进入详情页。
- [x] **READ-05** 网络失败不会清空或破坏本地收藏、历史和草稿数据。
- [x] **VERIFY-01** mapper 和 API client 有网络无关测试覆盖成功响应、缺失字段和错误响应。
- [x] **VERIFY-02** e2e/matcher 测试继续用本地测试数据验证排序逻辑。
- [x] **VERIFY-03** miniapp type-check、recipes-api/e2e/matcher 测试和 mp-weixin build 已通过。
- [x] **VERIFY-04** 按 Phase 11 决策在 SUMMARY 中记录为 deferred，不新增 README/release checklist。

### Active

- [ ] 小程序后端 API 可通过已备案域名的 HTTPS 地址访问。
- [ ] 用户可通过微信静默登录建立后端用户身份。
- [ ] 用户的收藏可写入远程并从远程恢复。
- [ ] 用户的生成历史可写入远程并从远程恢复。
- [ ] 用户首次登录后，本地收藏和历史可合并到云端，避免已有数据丢失。
- [ ] 网络或同步失败不会清空或破坏本地收藏、历史和草稿数据。

### Next Milestone Candidate Goals

- 图片上传、对象存储、OCR 和拍照识别任务链路。
- AI 生成菜谱。
- 用户资料页与更完整的跨设备同步体验。

### Out of Scope

- 分享到朋友圈 - 用户明确排除。
- 营养计算 - 后续可加。
- 视频菜谱 - 后续可加。
- 一次性重写核心 matcher/generator 推荐逻辑 - 当前本地 matcher 仍是稳定核心体验。
- 完整正式发布材料 - v1.2 只补 HTTPS/request 合法域名相关前置项，隐私指引、提审文案等后续再做。

## Evolution

本文档随 milestone 完成和新需求定义而演进。v1.0 和 v1.1 已归档，v1.2 已完成 requirements 和 roadmap 拆分，下一步从 Phase 12 HTTPS 域名就绪开始。

---
*Last updated: 2026-07-01 after creating v1.2 requirements and roadmap*
