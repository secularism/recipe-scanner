# 菜谱生成小程序 (recipe-scanner)

## What This Is

一个微信小程序，用户输入或选择自己有的食材和调味料，再选菜系和口味偏好，系统生成当前可做的菜谱。v1.0 已完成本地规则匹配、收藏、历史、微信好友分享、首页/生成页体验升级，并补齐 NestJS + Prisma + PostgreSQL 的后端基础链路。

## Core Value

**用户输入食材和调味料，立刻得到一份可做的菜谱**，无需思考“今天吃什么”。

## Current State

- **Shipped:** v1.0 MVP on 2026-06-21
- **Frontend:** `apps/miniapp` 保留本地 matcher/generator、收藏、历史和分享主流程
- **Backend:** `apps/api` 已有 NestJS 骨架、健康检查、Prisma 数据层和 `recipes` 只读接口
- **Data:** 现有 mock 菜谱可通过 `npm run prisma:seed` 写入远程 PostgreSQL
- **Planning:** v1.0 roadmap 和 requirements 已归档到 `.planning/milestones/`
- **Next focus:** 新建 v1.1 milestone，优先讨论菜谱接口化、收藏/历史写接口、识别任务和上传/OCR 链路

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

(None - next milestone should define fresh requirements with `$gsd-new-milestone`.)

### Next Milestone Goals

- 菜谱接口化：查询参数、分页、响应裁剪和前端接入边界。
- 写接口打通：收藏、历史、识别任务进入真实后端链路。
- 图片上传与识别准备：对象存储、OCR、拍照识别任务链路设计。

### Out of Scope

- AI 生成菜谱 - 已留接口，本期不实现
- 分享到朋友圈 - 用户明确排除
- 营养计算 - 后续可加
- 视频菜谱 - 后续可加
- 完整用户资料系统（昵称、头像、手机号、资料页）
- 非微信生态的跨平台账号体系
- 一次性重写核心 matcher/generator 推荐逻辑

## Evolution

本文档随 milestone 完成和新需求定义而演进。v1.0 已归档，下一次应从 `$gsd-new-milestone` 开始重新定义 requirements 和 roadmap。

---
*Last updated: 2026-06-21 after v1.0 milestone*
