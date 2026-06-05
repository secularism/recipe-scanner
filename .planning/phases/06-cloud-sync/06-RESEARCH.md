# Phase 6 Research — 当前同步接入点

## Existing Persistence

收藏与历史都已经是 Pinia store + local storage 模式。这个结构适合扩展成 local-first sync：

- Store 保持页面状态和本地读写。
- 新增 sync service 负责登录、拉取、上传、失败处理。
- 页面只消费 store 暴露的同步状态，避免直接调用云端 API。

## Candidate Files To Change During Implementation

- `src/App.vue`：启动时初始化同步。
- `src/stores/favorites.ts`：增加 sync/hydrate/push 入口。
- `src/stores/history.ts`：增加 sync/hydrate/push 入口。
- `src/stores/sync.ts` 或 `src/stores/user.ts`：管理登录与同步状态。
- `src/services/sync.ts`：封装云端 adapter。
- `src/pages/favorites/favorites.vue`：显示同步状态与重试。
- `src/pages/history/history.vue`：显示同步状态与重试。
- `src/pages/index/index.vue`：必要时显示轻量状态或保持只显示计数。
- `tests/e2e.test.ts`：补本地优先和同步合并测试。
- `tests/sync.test.ts`：可新增同步 service 单测。

## Technical Risk

- 当前项目没有微信云开发配置，也没有云函数目录。
- Node/uni-app 构建可验证前端代码，但云端真实能力需要微信开发者工具与云环境配置。
- 如果直接依赖 `wx.cloud`，H5 与 Node 测试环境需要条件隔离。

## Recommended Plan Shape

Phase 6 建议拆成两个提交层次：

1. 文档与契约提交：SPEC/PLAN/接口契约/数据结构。
2. 代码实现提交：local-first sync store + adapter + UI 状态 + tests。

如果云开发环境暂时没有配置，代码层先实现 adapter interface 与本地 mock，真实 `wx.cloud` 接入在后续小提交补齐。

