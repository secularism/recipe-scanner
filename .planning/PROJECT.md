# 菜谱生成小程序 (recipe-scanner)

## What This Is

一个微信小程序，用户输入或选择自己有的食材和调味料，再选菜系和口味偏好，系统生成当前可做的菜谱。v1.0 已完成本地规则匹配、收藏、历史、微信好友分享、首页/生成页体验升级，并补齐 NestJS + Prisma + PostgreSQL 的后端基础链路。

## Core Value

**用户输入食材和调味料，立刻得到一份可做的菜谱**，无需思考“今天吃什么”。

## Current State

- **Shipped:** v1.0 MVP on 2026-06-21
- **Frontend:** `apps/miniapp` 保留本地 matcher/generator、收藏、历史和分享主流程
- **Backend:** `apps/api` 已有 NestJS 骨架、健康检查、Prisma 数据层和 match-ready `recipes` 只读 DTO 契约
- **Data:** 现有 mock 菜谱可通过 `npm run prisma:seed` 写入远程 PostgreSQL
- **Planning:** v1.0 roadmap 和 requirements 已归档到 `.planning/milestones/`
- **Current milestone:** v1.1 API 接入
- **Next focus:** Phase 10 小程序 recipes API client/mapper 与结果页生成链路接入

## Current Milestone: v1.1 API 接入

**Goal:** 把前端菜谱读取从本地 mock 数组切到真实后端 API，同时保留现有本地 matcher 的推荐体验。

**Target features:**
- 后端提供 match-ready 的 recipes 读接口，返回前端 matcher 和详情页所需字段。
- 前端新增 recipes API client、字段 mapper 和可配置 API base URL。
- 结果页生成流程异步加载真实菜谱数据后继续使用本地 matcher 排序。
- 详情页、收藏页展示和历史记录跳转通过真实接口读取菜谱。
- 网络失败时给出 loading、error 和 retry 反馈，不破坏本地收藏/历史数据。

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
- v1.0 小程序端主流程仍可离线运行，本地 matcher/generator 不依赖后端。
- 后端能力先按真实数据链路渐进接入，避免一次性重写前端推荐逻辑。
- 分享仅支持微信好友，不做朋友圈分享。

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 本地规则匹配优先 | 响应快、离线可用、成本低，AI 留到后续扩展 | v1.0 已实现 |
| Pinia 管理收藏与历史 | Vue 3 生态简洁，适合小程序本地状态 | v1.0 已实现 |
| 单数据源菜谱库 | 食材、调味料、菜系、口味、步骤集中管理，便于 seed 入库 | v1.0 已实现 |
| 分享走微信好友 path | 用户明确不做朋友圈，详情页可通过 path 直达 | v1.0 已实现 |
| 按 OpenDesign 重构 UI | Phase 5 起按设计稿统一页面视觉与小程序适配 | v1.0 已实现 |
| 仓库改为 monorepo | 前后端和共享类型在同仓协同演进 | v1.0 已实现 |
| 后端采用 NestJS + Prisma + PostgreSQL | 为后续菜谱接口化、收藏、历史、识别任务提供真实数据层 | v1.0 已打通首段链路 |

## Requirements

### Validated

#### 输入与生成
- [x] **INPUT-01** 用户可从常用食材库多选食材
- [x] **INPUT-02** 用户可手动输入自定义食材
- [x] **INPUT-03** 用户可从常用调味料库多选调味料
- [x] **INPUT-04** 用户可手动输入自定义调味料
- [x] **INPUT-05** 用户可选择菜系（川/粤/家常/西餐/日韩等）
- [x] **INPUT-06** 用户可选择口味偏好（辣/清淡/酸甜/咸鲜）
- [x] **GEN-01** 点击生成后基于以上条件匹配出 1-3 个菜谱
- [x] **GEN-02** 匹配结果按契合度排序（食材覆盖率优先）

#### 菜谱展示
- [x] **DISP-01** 菜谱展示名称、所需食材、所需调味料、步骤
- [x] **DISP-02** 菜谱支持“换一换”重新匹配
- [x] **DISP-03** 菜谱详情页可单独访问（带 path 参数）

#### 收藏与历史
- [x] **FAV-01** 用户可收藏/取消收藏菜谱
- [x] **FAV-02** 收藏页列出所有收藏的菜谱
- [x] **HIST-01** 历史记录页列出按时间倒序的生成结果
- [x] **HIST-02** 历史记录可单条删除

#### 分享
- [x] **SHARE-01** 菜谱详情页支持分享给微信好友（不含朋友圈）
- [x] **SHARE-02** 分享卡片点开进入对应菜谱详情
- [x] **SHARE-03** 分享时显示菜名 + 简介

#### 体验升级
- [x] **UX-01** 首页主 CTA、场景预设、收藏/历史入口形成清晰视觉层级
- [x] **UX-02** 一键预设升级为场景化做饭入口
- [x] **UX-03** 生成页展示已选食材、调味料、菜系、口味摘要反馈
- [x] **UX-04** 生成页支持恢复上次输入、清空输入与继续编辑流程
- [x] **UX-05** 生成页增加最近使用食材/调味料入口
- [x] **UX-06** 首页到生成页体验升级不改核心匹配算法

### Active

#### v1.1 API 接入
- [x] **API-01** 后端 recipes 列表接口可返回前端 matcher 所需的完整字段
- [ ] **API-02** 前端可通过统一 API client 请求真实 recipes 接口
- [ ] **API-03** 生成结果从真实接口获取菜谱库后仍按现有 matcher 排序
- [ ] **API-04** 详情页可通过真实接口读取分享 path 中的菜谱 id/slug
- [ ] **API-05** 收藏和历史仍本地存储，但展示菜谱数据时从真实接口读取

### Next Milestone Goals

- 完成 recipes 读链路 API 化，替换前端 mock 菜谱数据源。
- 保持收藏、历史本地存储，不在 v1.1 引入用户身份或远程同步。
- 为后续收藏/历史写接口、识别任务和上传/OCR 链路留下清晰边界。

### Out of Scope

- AI 生成菜谱 - 已留接口，本期不实现
- 分享到朋友圈 - 用户明确排除
- 营养计算 - 后续可加
- 视频菜谱 - 后续可加
- 收藏、历史、识别任务远程写接口 - v1.1 先只做 recipes 读接口接入
- 图片上传、OCR、拍照识别 - 后续 milestone 再做
- 完整用户资料系统（昵称、头像、手机号、资料页）
- 非微信生态的跨平台账号体系
- 一次性重写核心 matcher/generator 推荐逻辑

## Evolution

本文档随 milestone 完成和新需求定义而演进。v1.0 已归档，下一次应从 `$gsd-new-milestone` 开始重新定义 requirements 和 roadmap。

---
*Last updated: 2026-06-21 after starting v1.1 API 接入 milestone*
