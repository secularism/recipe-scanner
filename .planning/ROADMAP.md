# Roadmap: 菜谱生成小程序 (recipe-scanner)

## Milestones

- [x] **v1.0 MVP** - Phase 1-8 shipped on 2026-06-21. Archive: [v1.0-ROADMAP.md](milestones/v1.0-ROADMAP.md)

## Current Position

v1.0 has been archived. There is no active phase.

Start the next milestone with:

```bash
$gsd-new-milestone
```

## Archived Phases

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

## Next Phase Direction

Recommended next milestone: “菜谱接口化与写接口打通”。

Candidate goals:

1. 扩展 `recipes` 查询参数、分页与响应裁剪。
2. 接入收藏、历史、识别任务的真实写接口。
3. 为图片上传、OCR、拍照识别保留对象存储与异步任务链路。
