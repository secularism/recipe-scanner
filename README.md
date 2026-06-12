# recipe-scanner

微信小程序「菜谱生成」monorepo 仓库。当前仓库同时承载：

- `apps/miniapp`：uni-app 小程序前端
- `apps/api`：NestJS 后端骨架
- `packages/shared`：前后端共享类型、常量、DTO 预留区
- `infra/`：Nginx、SQL 与部署相关资源预留区

## 技术栈

- 小程序前端：uni-app + Vue 3 + TypeScript + Pinia + uni-ui
- 后端骨架：NestJS + TypeScript
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
  AGENTS.md
  README.md
  package.json
```

## 当前状态

- 小程序前端已迁移至 `apps/miniapp`
- 后端已在 `apps/api` 初始化 NestJS 骨架
- 目前仍以本地菜谱数据和本地存储逻辑为主
- 数据库、上传、识别与鉴权能力尚未接入

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

前端常用命令：

```bash
cd apps/miniapp
npm install
npm run dev:mp-weixin
npm run build:mp-weixin
```

## 后端骨架

后端目录：`apps/api`

当前已初始化：

- `main.ts`
- `app.module.ts`
- `app.controller.ts`
- `app.service.ts`
- `health` 模块
- `.env.example`
- Nest CLI / TypeScript 配置

接口约定：

- `GET /api`：返回服务概览
- `GET /api/health`：返回健康状态

后端常用命令：

```bash
cd apps/api
npm install
npm run start:dev
```

## 下一步建议

- 接入 PostgreSQL 与 ORM
- 设计菜谱、用户、收藏、历史、识别任务相关数据表
- 增加上传与对象存储接入
- 为拍照识别预留异步任务与结果表结构

## 验收说明

本次仓库结构调整与后端初始化未运行自动测试，按用户要求由用户自行验收。
