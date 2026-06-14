# Phase 8 Context — 数据库初始化

## Why This Phase

当前 `apps/api` 已具备 NestJS 基础骨架，并已成功部署到服务器，健康检查接口可用。项目下一步需要从纯 mock / 本地存储逐步过渡到可持久化、可扩展的后端数据层，因此优先进行数据库初始化。

## Current State

- 仓库已经完成 monorepo 化：`apps/miniapp`、`apps/api`、`packages/shared`、`infra/`
- `apps/api` 已可启动，`/api/health` 已在服务器上跑通
- 小程序核心业务仍主要依赖本地 mock 菜谱与本地缓存
- 尚未接入 PostgreSQL、ORM、数据库迁移或真实业务接口

## User Intent

- 后续希望租赁服务器、自建后端与数据库，而不是继续走微信云函数
- 希望为未来的拍照识别能力预留扩展空间
- 当前优先级选择为“数据库初始化”

## Constraints

- 本 phase 先打数据层基础，不要求完成完整的菜谱 API
- 不能破坏当前 `/api/health` 已部署可用的基础服务
- 需要兼顾后续：菜谱迁移、用户数据、收藏/历史、上传与识别任务

## Recommended Direction

- 数据库：PostgreSQL
- ORM：Prisma
- 代码位置：`apps/api`
- 环境变量：本地 `.env` 与服务器环境变量并行
- 迁移策略：使用 Prisma migration 管理 schema 演进
