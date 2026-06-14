# Phase 8 Research — 数据库初始化

## Chosen Stack

### PostgreSQL

适合作为当前项目主库，原因：

- 关系型结构更适合用户、收藏、历史、菜谱、识别任务等数据
- 支持 `jsonb`，可给菜谱扩展字段、识别原始结果和第三方回包预留空间
- 后续如果需要搜索、筛选、统计，也比文档库更稳

### Prisma

作为 `apps/api` 的首选 ORM，原因：

- 与 TypeScript / NestJS 配合自然
- schema 明确，适合从早期把数据结构约束清楚
- migration 能力适合当前从 0 到 1 的数据库初始化阶段
- 开发体验好，后续生成类型和客户端都方便

## Initial Data Domains

建议第一批先覆盖这些领域：

1. `recipes`
2. `recipe_tags` / `recipe_cuisines` / `recipe_tastes` 或等价枚举/关联结构
3. `users`（即使暂不开放登录，也先决定是否留空壳）
4. `favorites`
5. `generation_history`
6. `recognition_jobs`（为拍照识别预留）

## Scope Recommendation

本 phase 建议只做：

- Prisma 初始化
- PostgreSQL 连接
- `.env.example` 扩展
- 第一版 schema 设计
- 迁移命令与开发流程

本 phase 不建议直接做：

- 全量 mock 菜谱入库
- 完整业务接口
- 上传、OCR、对象存储真实接入

## Risks

- 如果一开始就把用户体系设计过重，会拖慢整体推进
- 如果完全不为识别任务留结构，后续拍照识别接入会反复改 schema
- 如果 schema 只按当前前端 mock 设计，后面扩展成本会偏高
