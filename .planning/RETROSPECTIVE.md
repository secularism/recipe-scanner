# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: v1.0 MVP

**Shipped:** 2026-06-21  
**Phases:** 8 roadmap phases | **GSD-tracked plans:** 5 | **Sessions:** multiple

### What Was Built

- 微信小程序 v1 主流程：食材/调味料输入、菜系/口味选择、本地匹配、结果和详情。
- 本地收藏、历史记录、微信好友分享和分享 path 直达详情。
- OpenDesign 驱动的页面视觉重构，以及首页/生成页体验升级。
- Monorepo 结构：`apps/miniapp`、`apps/api`、`packages/shared`、`infra`。
- NestJS 后端骨架、健康检查、Prisma/PostgreSQL 数据层、seed 和 recipes 只读接口。

### What Worked

- 前端先保持本地 matcher/generator，后端逐步接入真实数据链路，避免一次性重写核心体验。
- UI phase 先沉淀设计契约，再按设计稿实现，有利于减少视觉方向反复。
- Phase summary 和 troubleshooting docs 对后续换电脑、重新部署和排障很有价值。
- monorepo 改造让后续共享类型、API DTO 和部署资源有了明确位置。

### What Was Inefficient

- 早期 Phase 1-4 缺少完整 GSD phase 目录，归档时只能从 ROADMAP 和 git 历史补齐上下文。
- milestone audit 文件缺失，虽然 open artifact audit 清零，但缺少一份独立的 requirements coverage 报告。
- 后端启动、构建、Prisma 和 PM2 问题花了额外排障时间，后续应更早固化环境启动脚本。

### Patterns Established

- 每个后续 phase 继续保留 `CONTEXT`、`PLAN`、`SUMMARY`、`REVIEW`，避免归档时上下文缺口。
- UI 相关工作先产出设计契约和验收边界，再修改组件代码。
- 后端能力优先打通真实但窄的链路，再扩展接口范围。
- milestone close 时保留 phase 目录原位，只归档 ROADMAP 和 REQUIREMENTS，减少历史路径移动。

### Key Lessons

1. 小程序端的真实运行约束要早测，尤其是内联 SVG、`uni-icons` 类型和组件注册方式。
2. 后端接入远程 PostgreSQL 前，应先写清 SSH Tunnel、环境变量、migration、seed 和 PM2 运行方式。
3. 归档前最好补跑 milestone audit，让 requirement coverage 和 cross-phase integration 有明确证据。
4. Phase summary 要写 Outcome、Delivered、Validation 和 Known Issues，后续归档会轻很多。

### Cost Observations

- Model mix: not recorded.
- Sessions: not recorded.
- Notable: GSD artifacts reduced context recovery cost, but missing early phase summaries created manual reconstruction work.

---

## Milestone: v1.1 API 接入

**Shipped:** 2026-06-26  
**Phases:** 3 | **Plans:** 5 | **Tasks:** 20

### What Was Built

- 后端 recipes 列表和详情读取形成稳定 DTO 契约，支持 `include=matchFields`、`legacyId`/`slug` 查询和 `PUBLISHED` 过滤。
- 小程序新增集中 API config、recipes API client、DTO mapper 和 fake-request 测试路径。
- 结果页从真实 recipes API 拉取候选池后继续运行本地 matcher，补齐 loading、error、retry 和无匹配状态。
- 详情页改为 `fetchRecipeById(id)` 驱动，分享 path、历史跳转和收藏入口都进入真实详情读取。
- 收藏页保留本地 id 存储，但用真实 recipes 数据展示卡片；历史页保持本地快照并跳转 API 驱动详情。

### What Worked

- 先后端契约、再前端 client/mapper、最后读视图接入的 phase 顺序很顺，减少了跨层猜测。
- API client 注入 request 函数让测试保持网络无关，避免公网接口波动影响默认验证。
- 明确“不 fallback 到 `ALL_RECIPES`”让错误状态可见，防止真实接口问题被 mock 数据掩盖。
- Phase 10 及时修复 `vue-tsc` 与 `uni-icons` 构建问题，使 Phase 11 可以完整跑 miniapp 验证门。

### What Was Inefficient

- 没有单独跑 `$gsd-audit-milestone`，close 时缺少一份独立 milestone audit 文件，只能用 open artifact audit 和 requirements traceability 证明收尾状态。
- Phase 9 初期暴露的小程序工具链问题跨 phase 才完全解决，说明 shared build gate 应更早修复。
- SDK 自动生成的 milestone task 统计偏低，需要人工从 PLAN/SUMMARY 重新核对。

### Patterns Established

- 后端 DTO serializer 隔离 Prisma 内部字段，前端只消费稳定 public id 和业务字段。
- 小程序 API client 使用集中 base URL、统一错误类型、可注入 request 的测试模式。
- 结果页、详情页、收藏页分别处理 loading/error/retry，不用本地 recipes fallback。
- 收藏和历史继续作为本地用户数据边界，远程写入留到后续 milestone。

### Key Lessons

1. 真实 API 接入要把“错误是否可见”作为验收条件，否则 fallback 很容易掩盖集成问题。
2. 前后端 public id 策略要早定，本项目固定为 `slug || legacyId`，数据库 UUID 不进入小程序业务逻辑。
3. 默认测试应保持 fake/local，真实服务只做人工或专项验证。
4. milestone close 前最好先跑 `$gsd-audit-milestone`，这样归档时不会缺少审计证据。

### Cost Observations

- Model mix: not recorded.
- Sessions: multiple.
- Notable: v1.1 的 GSD phase artifacts 完整度明显高于 v1.0，归档主要成本来自 PROJECT/ROADMAP/RETROSPECTIVE 的人工演进判断。

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | multiple | 8 | 从单体小程序推进到 monorepo + 后端真实数据链路 |
| v1.1 | multiple | 3 | 从本地 mock 菜谱读取推进到真实 recipes API 读链路 |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | miniapp type-check/e2e/matcher/build in covered phases | Manual + scripted verification by phase | Not recorded |
| v1.1 | api contract, recipes-api, e2e, matcher, type-check, mp-weixin build | Requirements traceability 21/21, open artifact audit 0 issues | Network-free fake request tests for API client/mapper |

### Top Lessons (Verified Across Milestones)

1. 小程序视觉和组件变更必须在微信开发者工具中验收。
2. 规划文档需要和实际仓库结构同步，否则后续 phase 会消耗额外恢复成本。
3. 真实 API 集成应禁止默认 fallback，确保 loading/error/retry 行为被测试覆盖。
4. Public id 策略和 DTO mapper 是前后端解耦的关键边界，应在后续写接口继续沿用。
