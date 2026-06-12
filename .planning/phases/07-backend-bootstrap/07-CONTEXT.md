# Phase 7 Context — Monorepo 与后端初始化

## Why Now

当前小程序的数据仍以本地 mock 菜谱和本地存储为主。用户已明确准备引入云服务器、自建后端与数据库，并为后续拍照识别、账号能力与可扩展性预留架构空间。

## Current State

- 前端已从仓库根目录迁移到 `apps/miniapp`
- `apps/api`、`packages/shared`、`infra/` 已创建，但后端尚未初始化
- 现有 `.planning` 文档仍主要描述单前端工程状态，尚未反映 monorepo 结构

## Constraints

- 本次先完成后端工程初始化与仓库结构收口，不接入数据库、不改业务接口
- 不破坏现有 uni-app 小程序代码和业务逻辑
- 用户本次要求不跑测试，由用户自行验收

## Decisions

- 仓库采用 monorepo：`apps/miniapp + apps/api + packages/shared + infra`
- 后端框架采用 NestJS，作为后续数据库、上传、识别与鉴权能力入口
- 根目录补工作区脚本，便于后续统一管理前后端命令
