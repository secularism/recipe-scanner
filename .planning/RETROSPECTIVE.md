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

## Cross-Milestone Trends

### Process Evolution

| Milestone | Sessions | Phases | Key Change |
|-----------|----------|--------|------------|
| v1.0 | multiple | 8 | 从单体小程序推进到 monorepo + 后端真实数据链路 |

### Cumulative Quality

| Milestone | Tests | Coverage | Zero-Dep Additions |
|-----------|-------|----------|-------------------|
| v1.0 | miniapp type-check/e2e/matcher/build in covered phases | Manual + scripted verification by phase | Not recorded |

### Top Lessons (Verified Across Milestones)

1. 小程序视觉和组件变更必须在微信开发者工具中验收。
2. 规划文档需要和实际仓库结构同步，否则后续 phase 会消耗额外恢复成本。
