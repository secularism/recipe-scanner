# Phase 11: api-read-views-verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-06-24
**Phase:** 11-api-read-views-verification
**Areas discussed:** 详情页失败与分享打开体验, 收藏页 API 展示策略, 历史页列表与点击详情边界, API client 与测试扩展边界

---

## 详情页失败与分享打开体验

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| 详情页 API 加载/失败状态 | 整页 loading + 错误页重试; toast 后自动返回; 保留空白详情壳 + 局部错误 | 整页 loading + 错误页重试 |
| 分享来源提示 | 成功后 toast 一次; 页面顶部显示分享来源条; 不再提示分享来源 | 成功后 toast 一次 |
| 匹配上下文保留 | 只在结果页跳转详情时保留; 所有入口普通详情; 历史页也恢复匹配上下文 | 只在结果页跳转详情时保留 |
| 错误页返回动作 | 重试 + 智能返回; 重试 + 固定返回首页; 只提供重试 | 重试 + 智能返回 |

**User's choice:** 接受推荐路径，重点保护分享打开体验，不自动返回。
**Notes:** 分享 toast 只在 API 成功后显示；历史、收藏、分享入口不恢复 `已有` / `还差` 分组。

---

## 收藏页 API 展示策略

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| 收藏页获取展示数据 | 加载 match-ready 全量列表后按收藏 id 过滤; 按每个收藏 id 分别请求详情; 新增批量接口 | 加载 match-ready 全量列表后按收藏 id 过滤 |
| API 中找不到收藏 id | 保留 id 并显示暂不可用占位; 本次视图隐藏; 自动移除 | 保留 id 并显示暂不可用占位 |
| 收藏页整体 API 失败 | 保留本地收藏数量 + 错误重试; 只显示空状态; fallback 本地 ALL_RECIPES | 保留本地收藏数量 + 错误重试 |
| 暂不可用收藏操作 | 允许取消收藏; 只展示占位不提供操作; 批量清理不可用收藏 | 允许取消收藏 |

**User's choice:** 接受推荐路径，优先保护本地收藏数据。
**Notes:** 不新增后端批量接口；不 fallback 本地菜谱库；取消收藏只修改本地 ids。

---

## 历史页列表与点击详情边界

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| 历史列表是否刷新真实菜谱信息 | 继续显示本地快照，点击时 API 详情加载; 打开历史页时刷新真实名称/状态; 复用 recipes 池刷新展示 | 继续显示本地快照，点击时 API 详情加载 |
| 详情 API 失败后历史记录处理 | 不改历史记录; 返回历史页后提示可删除; 自动删除对应历史记录 | 不改历史记录 |
| 是否从历史 input 恢复分组 | 不恢复，只显示普通详情; 恢复分组但不显示契合度; 完整恢复分组 + 契合度 | 不恢复，只显示普通详情 |

**User's choice:** 接受推荐路径，历史页维持本地快照和轻边界。
**Notes:** 历史页本身不做 API 列表刷新；失败由详情页处理。

---

## API client 与测试扩展边界

| Decision | Options Considered | Selected |
|----------|--------------------|----------|
| API client 扩展 | 只新增 fetchRecipeById(id); 新增详情读取 + 内存缓存; 新增批量详情/ids 查询 | 只新增 fetchRecipeById(id) |
| 默认测试范围 | client/mapper + 页面行为模拟 + 全量验证门; 只扩展 client 测试; 新增组件级测试栈 | client/mapper + 页面行为模拟 + 全量验证门 |
| 发布前置文档 | 新增 README/docs 清单; 仅 README; 仅 docs; 不新增发布前置文档 | 不新增发布前置文档 |

**User's choice:** API client 只加详情读取；测试沿用现有 `tsx` 脚本；正式发布前置条件不写入 README/docs。
**Notes:** 用户已清楚 HTTPS、微信 request 合法域名和备案域名事项，当前正在备案域名，近期最多体验版使用，不进行正式发布。该边界只写入 GSD 上下文，避免 planner 扩大文档 scope。

---

## the agent's Discretion

- Loading/error/retry 文案和布局细节由执行者按现有页面风格处理。
- Favorites API view model 的具体拆分方式由执行者决定，但必须保持 local ids 为唯一持久化源。
- 测试辅助函数和 fake request 的组织方式由执行者按现有测试风格决定。

## Deferred Ideas

- Remote favorites/history writes and cross-device sync.
- Backend batch recipe lookup for ids.
- History list live refresh from API.
- Historical match-context restoration from history entries.
- Official WeChat release checklist documentation.
- API caching and TTL refresh behavior.
