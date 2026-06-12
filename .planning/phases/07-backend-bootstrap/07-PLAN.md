# Phase 7 Plan — Monorepo 与后端初始化

## Objective

在不影响现有小程序业务代码的前提下，完成仓库 monorepo 化收口，并初始化 `apps/api` NestJS 后端骨架，为后续数据库接入、文件上传与拍照识别能力做准备。

## Scope

- 补齐 monorepo 根目录配置
- 初始化 `apps/api` NestJS 工程骨架
- 明确 `packages/shared` 与 `infra/` 的用途
- 更新 README、AGENTS 与 `.planning` 文档状态

## Non-Goals

- 不接入 PostgreSQL、Redis、对象存储
- 不增加登录、鉴权、上传、识别、菜谱 API
- 不修改小程序业务逻辑和页面表现
- 不运行测试或构建验收

## Tasks

### 1. 仓库结构收口

- [x] 新增根目录 `.gitignore`
- [x] 新增根目录 workspace `package.json`
- [x] 校正 `apps/miniapp/package.json` 包名与私有配置

### 2. 后端初始化

- [x] 新增 `apps/api/package.json`
- [x] 新增 NestJS `tsconfig`、`nest-cli.json`、`.env.example`
- [x] 新增 `src/main.ts`、`app.module.ts`、`app.controller.ts`、`app.service.ts`
- [x] 新增 `health` 模块作为基础可用接口

### 3. 基础占位目录

- [x] 为 `packages/shared` 增加说明文件
- [x] 为 `infra/nginx`、`infra/sql` 增加占位文件

### 4. 文档同步

- [x] 更新 `README.md`
- [x] 更新 `AGENTS.md`
- [x] 更新 `.planning/ROADMAP.md`
- [x] 更新 `.planning/STATE.md`
- [x] 补充本 phase 的 `SUMMARY` 与 `REVIEW`

## Verification Gate

- [x] 本次按用户要求不跑测试，由用户自行验收

## Acceptance Criteria

- [x] 仓库根目录能清晰表达 monorepo 结构和启动命令
- [x] `apps/api` 具备标准 NestJS 项目骨架
- [x] 后续可在 `apps/api` 继续接数据库、上传与识别能力
- [x] 项目文档已同步到当前结构与阶段状态
