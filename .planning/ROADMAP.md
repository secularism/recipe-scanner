# Roadmap

## Overview

| # | Phase | Goal | Status |
|---|---|---|---|
| 1 | 项目骨架与基础架构 | 初始化 uni-app + Vue 3 + TypeScript 工程 | 已完成 |
| 2 | 菜谱数据与匹配引擎 | 建立本地菜谱库与匹配逻辑 | 已完成 |
| 3 | 页面与组件 | 完成输入、结果、详情主流程 | 已完成 |
| 4 | 收藏 / 历史 / 分享 / 收尾 | 完成 v1 持久化与分享能力 | 已完成 |
| 5 | UI 重构 | 按 OpenDesign 重写页面与组件视觉 | 已完成，已合并 |
| 6 | 首页与生成页体验升级 | 强化主流程表达、草稿恢复、最近使用 | 已完成，已合并 |
| 7 | Monorepo 与后端初始化 | 整理同仓结构并初始化 NestJS | 已完成，已合并 |
| 8 | 数据库初始化 | 接入 Prisma + PostgreSQL，打通首段真实数据链路 | 已完成，已合并 |

## Phase 8

### Goal

在 `apps/api` 现有 NestJS 骨架之上接入 PostgreSQL 与 Prisma，建立菜谱、收藏、历史、识别任务等后续能力可复用的数据层基础。

### Success Criteria

1. `apps/api` 完成 PostgreSQL 连接与 Prisma 初始化
2. 首批核心表结构完成：`User`、`Recipe`、`Favorite`、`GenerationHistory`、`RecognitionJob`
3. 本地 Prisma 开发流程、SSH Tunnel 连接方式、环境变量写法文档化
4. 不影响现有健康检查接口
5. 通过真实数据库读接口验证 schema 可支撑后续菜谱接口化

### Implementation Update

- 已新增 `apps/api/prisma/schema.prisma`
- 已新增 `apps/api/prisma/seed.ts`
- 已新增 `apps/api/src/prisma/*`
- 已新增 `apps/api/src/recipes/*`
- 已补充 `apps/api/.env.example`
- 已补充本机 Prisma 连接远程 PostgreSQL 文档
- 远程 PostgreSQL 已执行首版 `init` migration
- mock 菜谱已成功 seed 到远程数据库
- 已打通 `GET /api/recipes` 与 `GET /api/recipes/:id`
- `mapo-tofu` 详情接口 500 已修复
- 已形成启动 / 构建 / seed 故障分析文档，便于后续换电脑或重新部署时排障

## Next Phase Direction

推荐下一阶段进入“菜谱接口化与写接口打通”：

1. 继续扩展 `recipes` 查询参数、分页与响应裁剪
2. 接入收藏、历史、识别任务的真实写接口
3. 为图片上传、OCR、拍照识别保留对象存储与异步任务链路
