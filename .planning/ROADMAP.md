# Roadmap: 菜谱生成小程序 (recipe-scanner)

## Milestones

- [x] **v1.0 MVP** - Phase 1-8 shipped on 2026-06-21. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)
- [x] **v1.1 API 接入** - Phase 9-11 shipped on 2026-06-26. Archive: [v1.1-ROADMAP.md](milestones/v1.1-ROADMAP.md)

## Current Position

v1.1 API 接入已完成并归档。当前没有活动 milestone。

Next command:

```bash
$gsd-new-milestone
```

## Archived Milestones

<details>
<summary>v1.1 API 接入 (Phase 9-11) - shipped 2026-06-26</summary>

| # | Phase | Goal | Plans | Final Status |
|---|---|---|---|---|
| 9 | recipes-api-contract | 补齐后端 match-ready recipes 读接口和稳定响应映射边界 | 1/1 | Complete |
| 10 | miniapp-api-generation | 新增小程序 API client/mapper，并让结果页从真实 recipes 数据源生成 | 2/2 | Complete, merged |
| 11 | api-read-views-verification | 详情、收藏展示、历史跳转走真实接口，并完成验证门 | 2/2 | Complete, merged |

Detailed archive:
- [v1.1 roadmap archive](milestones/v1.1-ROADMAP.md)
- [v1.1 requirements archive](milestones/v1.1-REQUIREMENTS.md)

Phase execution directories remain in `.planning/phases/` for traceability.

</details>

<details>
<summary>v1.0 MVP (Phase 1-8) - shipped 2026-06-21</summary>

| # | Phase | Goal | Final Status |
|---|---|---|---|
| 1 | 项目骨架与基础架构 | 初始化 uni-app + Vue 3 + TypeScript 工程 | 已完成 |
| 2 | 菜谱数据与匹配引擎 | 建立本地菜谱库与匹配逻辑 | 已完成 |
| 3 | 页面与组件 | 完成输入、结果、详情主流程 | 已完成 |
| 4 | 收藏 / 历史 / 分享 / 收尾 | 完成 v1 持久化与分享能力 | 已完成 |
| 5 | UI 重构 | 按 OpenDesign 重写页面与组件视觉 | 已完成，已合并 |
| 6 | 首页与生成页体验升级 | 强化主流程表达、草稿恢复、最近使用 | 已完成，已合并 |
| 7 | Monorepo 与后端初始化 | 整理同仓结构并初始化 NestJS | 已完成，已合并 |
| 8 | 数据库初始化 | 接入 Prisma + PostgreSQL，打通首段真实数据链路 | 已完成，已合并 |

Detailed archive:
- [v1.0 roadmap archive](milestones/v1.0-ROADMAP.md)
- [v1.0 requirements archive](milestones/v1.0-REQUIREMENTS.md)

Phase execution directories remain in `.planning/phases/` for traceability.

</details>

## Backlog / Future Direction

1. 收藏、历史、识别任务真实写接口。
2. 图片上传、对象存储、OCR 和拍照识别任务链路。
3. AI 生成菜谱。
4. 远程用户身份、跨设备同步和用户资料系统。
