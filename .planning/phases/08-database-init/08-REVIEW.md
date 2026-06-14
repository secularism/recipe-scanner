# Phase 8 Review — 数据库初始化

## What Went Well

- 先通过 SSH Tunnel 固定住“本机 Prisma + 远程 PostgreSQL”的开发方式，后续迁移和换电脑都更容易复用
- 先建 schema、再 migration、再 seed、最后补读接口，路径清晰，排障也更容易定位
- 真实读接口提前落地，让 schema 不只是停留在“能建表”，而是验证到了业务查询层

## Issues Found

- Nest CLI 启动与构建阶段受 workspace 根依赖污染影响，出现 `lodash` 相关模块缺失
- Prisma seed 的类型写法与当前 client 生成结果不一致，导致编译失败
- `prisma/seed.ts` 被打进 Nest build 输出后，影响了 `dist/main.js` 生成位置
- `GET /api/recipes/:id` 初版把 slug 也当成 UUID 查询的一部分，导致 PostgreSQL 抛错

## Fixes Applied

- 在根目录锁定 `lodash` 版本并重建 workspace 依赖
- 调整 seed 类型写法，避免依赖当前 client 未暴露的类型成员
- 在 `tsconfig.build.json` 中排除 `prisma/**/*.ts`
- 在 `recipes.service.ts` 中加入 UUID 判断，非 UUID 参数只走 `legacyId / slug`
- 将 Prisma 生命周期接入改为 `OnModuleInit + OnModuleDestroy`

## Follow-up Suggestions

- 下一阶段优先做 `recipes` 查询增强和真实写接口
- 服务器部署阶段补上 `prisma migrate deploy`、环境变量加载与 PM2 启动脚本
- 后续接拍照识别时，把数据库层、对象存储层和异步任务层拆开推进，避免一次性耦合过高
