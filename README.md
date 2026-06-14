# recipe-scanner

微信小程序「菜谱生成」的 monorepo 仓库。

当前仓库同时承载：

- `apps/miniapp`：uni-app 小程序前端
- `apps/api`：NestJS 后端
- `packages/shared`：前后端共享类型、常量、DTO 预留区
- `infra/`：Nginx、SQL 与部署相关资源

## 技术栈

- 前端：uni-app + Vue 3 + TypeScript + Pinia + uni-ui
- 后端：NestJS + Prisma + PostgreSQL
- 仓库组织：npm workspaces monorepo

## 目录结构

```text
recipe-scanner/
  .planning/
  apps/
    api/
    miniapp/
  infra/
    nginx/
    sql/
  packages/
    shared/
  docs/
  AGENTS.md
  README.md
  package.json
```

## 当前状态

- 小程序前端已迁移到 `apps/miniapp`
- 后端已在 `apps/api` 初始化 NestJS 骨架
- PostgreSQL 已接入 Prisma
- 远程数据库已完成首版 migration 建表
- 现有 mock 菜谱已可通过 seed 写入 PostgreSQL
- 已提供只读接口用于验证真实数据库查询链路

## 根目录命令

```bash
# 微信小程序开发
npm run dev:miniapp:weixin

# 微信小程序生产构建
npm run build:miniapp:weixin

# 小程序类型检查
npm run type-check:miniapp

# 启动 NestJS 后端开发模式
npm run dev:api

# 构建 NestJS 后端
npm run build:api
```

## 小程序前端

前端目录：`apps/miniapp`

核心能力：

- 食材 / 调味料输入与本地规则匹配
- 首页场景预设卡与生成页草稿恢复
- 收藏 / 历史本地持久化
- 微信好友分享与详情页深链

常用命令：

```bash
cd apps/miniapp
npm install
npm run dev:mp-weixin
npm run build:mp-weixin
```

## 后端与数据库

后端目录：`apps/api`

当前已落地：

- `main.ts`
- `app.module.ts`
- `health` 模块
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/prisma/*`
- `src/recipes/*`
- `.env.example`

当前接口：

- `GET /api`：服务概览
- `GET /api/health`：健康检查
- `GET /api/recipes`：菜谱列表，支持 `?cuisine=sichuan&take=10`
- `GET /api/recipes/:id`：按 `id / legacyId / slug` 查询单个菜谱

常用命令：

```bash
cd apps/api
npm install
npm run prisma:generate
npm run prisma:migrate:dev -- --name init
npm run prisma:seed
npm run start:dev
```

## Prisma 远程连接说明

本机通过 SSH Tunnel 连接远程 PostgreSQL 的完整步骤见：

- [docs/local-prisma-remote-postgres.md](/D:/code/recipe-scanner/docs/local-prisma-remote-postgres.md)

## 当前数据库进展

- Prisma 已接入 `apps/api`
- 第一版 schema 已覆盖 `User`、`Recipe`、`Favorite`、`GenerationHistory`、`RecognitionJob`
- migration 已在远程 PostgreSQL 执行成功
- seed 已可将现有 mock 菜谱写入数据库
- 只读 `recipes` 接口已完成首轮联调验证

## 本次排障文档

后端启动、构建、seed 与 Prisma 连接的错误分析见：

- [docs/backend-startup-build-error-analysis.md](/D:/code/recipe-scanner/docs/backend-startup-build-error-analysis.md)

## 下一步建议

- 扩展 `recipes` 的筛选、分页与详情字段裁剪
- 接入收藏、历史、识别任务的真实写接口
- 为图片上传、OCR 和拍照识别预留对象存储与异步任务链路
- 为服务器部署补齐 `prisma migrate deploy` 与进程守护脚本

## 验收说明

本阶段未运行完整自动化测试，按你的要求以手动验收为主。当前已完成数据库建表、seed 入库、NestJS 启动和核心只读接口联调。
