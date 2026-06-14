# 后端启动与构建错误分析

## 背景

本次 Phase 8 在接入 Prisma、PostgreSQL 和 seed 之后，后端经历了几类连续问题：

- `npm run dev:api` 报 `Cannot find module './_Symbol'`
- `npm run build:api` 报 `Cannot find module 'lodash/toArray'`
- Prisma seed 报类型错误
- PrismaService 报 `$on("beforeExit")` 类型错误
- `start` 阶段报 `Cannot find module 'dist/main'`
- `GET /api/recipes/mapo-tofu` 返回 500

这些问题不是单点故障，而是 workspace 依赖、Nest build 输出、Prisma 类型和查询逻辑叠加后的结果。

## 1. Nest CLI 启动时报 `Cannot find module './_Symbol'`

### 现象

执行：

```bash
npm run dev:api
```

或：

```bash
npm --prefix apps/api run build
```

会在 Nest CLI 启动阶段报 `Cannot find module './_Symbol'`。

### 根因

`@nestjs/cli` 的依赖链会间接用到 `node-emoji` 和 `lodash`。当前仓库切到 npm workspaces 后，CLI 实际优先解析的是仓库根目录的依赖树，而不是只看 `apps/api` 自己的 `node_modules`。

当时根目录存在异常的 `lodash` 解析结果，导致内部子模块文件缺失，于是出现：

- `Cannot find module './_Symbol'`
- `Cannot find module 'lodash/toArray'`

### 修复

- 在根目录 `package.json` 增加：

```json
"overrides": {
  "lodash": "4.17.21"
}
```

- 重新安装 workspace 依赖，生成新的根 `package-lock.json`

### 结论

这是 workspace 根依赖污染问题，不是单纯的 `apps/api` 代码错误。以后遇到 Nest CLI 启动异常，要优先检查根目录 lockfile 和 override。

## 2. Nest build 后找不到 `dist/main.js`

### 现象

执行：

```bash
npm run start
```

报：

```text
Cannot find module 'D:\\code\\recipe-scanner\\apps\\api\\dist\\main'
```

### 根因

`apps/api/prisma/seed.ts` 里引用了 `../../miniapp/src/data/recipes`，而 `tsconfig.build.json` 初版没有把 `prisma/**/*.ts` 排除掉。

结果是 Nest build 时把 seed 和它依赖的小程序数据一起编进了输出目录，导致编译产物目录结构偏移，`nest start` 期待的 `dist/main.js` 没按预期生成。

### 修复

在 `apps/api/tsconfig.build.json` 中排除：

```json
"exclude": ["node_modules", "test", "dist", "**/*spec.ts", "prisma/**/*.ts"]
```

### 结论

Prisma seed 属于开发辅助脚本，不应该进入 Nest 服务端运行时产物。以后凡是 build 输出路径异常，先检查 `tsconfig.build.json` 是否误包含了脚本目录。

## 3. Prisma seed 类型错误

### 现象

`prisma/seed.ts` 报错：

- `RecipeStatus` 未导出
- `Prisma.InputJsonValue` 不存在

### 根因

当前 Prisma Client 生成结果里，没有按最初写法暴露这些成员；同时 seed 只是做入库脚本，不需要把类型约束写得过重。

### 修复

- 去掉对 `RecipeStatus` 枚举成员的直接依赖，改成写入字符串值 `"PUBLISHED"`
- 去掉对 `Prisma.InputJsonValue` 的强依赖，改为 `toPlainJson()` 做 JSON 序列化

### 结论

seed 脚本优先保证稳定和可执行，不必为了“类型最严”去依赖 Prisma Client 的细节导出。

## 4. PrismaService 的 `$on("beforeExit")` 类型错误

### 现象

`src/prisma/prisma.service.ts` 报：

```text
Argument of type '"beforeExit"' is not assignable to parameter of type 'never'
```

### 根因

当前 Prisma Client 的类型定义与早期常见示例不完全一致，`$on("beforeExit")` 这套写法在这里不再合适。

### 修复

改为更直接、也更稳定的 Nest 生命周期实现：

- `OnModuleInit` 中 `$connect()`
- `OnModuleDestroy` 中 `$disconnect()`

### 结论

优先用 Nest 生命周期包住 Prisma 连接，比依赖 Prisma 事件钩子更稳。

## 5. `GET /api/recipes/mapo-tofu` 返回 500

### 现象

`/api/recipes` 正常，但：

```text
/api/recipes/mapo-tofu
```

返回 500。

### 根因

详情接口初版同时用 `id / legacyId / slug` 做 OR 查询，但其中 `id` 是 PostgreSQL UUID 字段。传入 `mapo-tofu` 这种 slug 时，数据库会先尝试把它当 UUID 解析，从而报错。

### 修复

在 `recipes.service.ts` 中先做 UUID 判断：

- 如果是 UUID，才把 `id` 加入 OR 条件
- 如果不是 UUID，只查 `legacyId / slug`

### 结论

带有多种主键入口的接口，必须先按字段类型分流，不要把字符串 slug 直接塞给 UUID 条件。

## 6. 这次排障后的稳定方案

当前已经稳定下来的做法是：

1. 根目录通过 npm workspaces 管理依赖
2. 根目录锁定 `lodash` 版本，避免 Nest CLI 依赖解析漂移
3. `prisma/seed.ts` 只用于开发辅助，不参与 Nest build
4. 本机 Prisma 统一通过 SSH Tunnel 连接远程 PostgreSQL
5. 真实数据库链路先用只读接口验证，再继续推进写接口

## 7. 后续避免再次踩坑的建议

- 每次改 workspace 依赖后，优先检查根 `package-lock.json`
- Prisma 脚本和 Nest 运行时代码分开管理
- `schema.prisma` 变更后先 `generate`，再 `migrate`，最后才写 seed
- 对 `UUID / slug / legacyId` 这类混合查询入口，先做参数类型分流
- 换电脑时直接复用 `docs/local-prisma-remote-postgres.md` 的流程，不要手工猜连接方式
