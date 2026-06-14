# Phase 8 Plan — 数据库初始化

## Objective

在 `apps/api` 现有 NestJS 骨架基础上，完成 PostgreSQL 与 Prisma 的初始化，建立项目第一版核心数据模型和数据库开发流程，为后续菜谱接口化与拍照识别扩展打基础。

## Scope

- 安装并配置 Prisma 与 PostgreSQL 相关依赖
- 新增数据库连接环境变量和初始化配置
- 设计第一版核心 schema
- 明确迁移命令、开发命令与文档说明
- 保持现有健康检查接口可继续运行
- 打通首个真实数据库读接口作为闭环验证

## Non-Goals

- 不完成完整业务写接口开发
- 不接入对象存储、OCR 或视觉模型
- 不实现完整登录体系

## Tasks

### 1. 基础依赖与配置

- [x] 在 `apps/api` 安装 Prisma、数据库驱动与必要脚本
- [x] 新增 Prisma 初始化文件与目录结构
- [x] 扩展 `.env.example`，加入数据库连接变量

### 2. 第一版数据模型

- [x] 设计 `Recipe` 基础表
- [x] 设计收藏、生成历史相关表
- [x] 设计拍照识别任务预留表或等价结构
- [x] 设计轻量 `User` 占位模型

### 3. 开发流程与命令

- [x] 定义本地 `generate / migrate / deploy / studio` 命令
- [x] 定义本地 `seed` 命令
- [x] 明确服务器环境变量与部署注意事项
- [x] 更新 `README.md` 与本地连接文档

### 4. 验证与边界

- [x] 验证数据库接入不影响现有 `/api/health`
- [x] 确认 schema 能支撑后续菜谱接口化
- [x] 确认为拍照识别预留足够扩展点
- [x] 新增 `GET /api/recipes` 与 `GET /api/recipes/:id` 作为真实链路验证

## Verification Gate

- [x] `npm --prefix apps/api run build`
- [x] 本机 SSH Tunnel + 远程 PostgreSQL 连接验证
- [x] migration 建表验证
- [x] seed 入库验证
- [x] 健康检查接口回归验证
- [x] 菜谱列表与详情接口回归验证

## Acceptance Criteria

- [x] `apps/api` 已具备数据库层基础能力
- [x] Prisma schema 已覆盖首批核心实体
- [x] 数据库初始化流程可复用、可文档化
- [x] 后续可平滑进入“菜谱接口化”阶段
