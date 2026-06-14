# State

## Current Position

- Phase: 8（数据库初始化）
- Plan: 1 of 1
- Status: Phase 8 已完成开发、验收并合并到 `main`

## Project Memory

- 项目类型：微信小程序（uni-app + Vue 3 + TypeScript）
- 当前仓库结构：`apps/miniapp + apps/api + packages/shared + infra`
- 小程序前端仍保留本地规则匹配与本地存储逻辑
- 后端已完成从 mock 数据到 PostgreSQL 的第一段真实链路
- 远程服务器健康检查接口已可访问：`http://47.96.36.31/api/health`
- 本阶段数据库开发方式已固定为：本机 Prisma + SSH Tunnel + 远程 PostgreSQL

## Accumulated Context

- Phase 5 UI 重构与首页 bugfix 已完成并合并
- Phase 6 首页与生成页体验升级已完成并合并
- Phase 7 monorepo 与 NestJS 后端骨架已完成并合并
- Phase 8 已补齐 Prisma、PostgreSQL、schema、migration、seed、PrismaService 与 `recipes` 只读接口
- 远程 PostgreSQL 已创建 `recipe_scanner` 数据库并执行首版 migration
- 现有 mock 菜谱已可以通过 `npm run prisma:seed` 写入数据库
- 当前已验证接口：
  - `GET /api/health`
  - `GET /api/recipes`
  - `GET /api/recipes/:id`
- `GET /api/recipes/mapo-tofu` 的 500 问题已修复，原因是非 UUID 参数误走了 UUID 查询分支
- 启动与构建阶段遇到的 Nest CLI / lodash / Prisma / build 输出路径问题已全部定位并修复

## Last Updated

- 2026-06-14 Phase 8 完成数据库初始化、seed 入库与只读接口联调，并已合并到 `main`
