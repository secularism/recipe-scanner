# Phase 6 SPEC — 用户登录与收藏/历史云同步

## Summary

本 phase 解决当前收藏与历史只能保存在本机缓存的问题：用户可通过微信小程序身份建立一个轻量账号态，并把收藏菜谱与历史记录同步到云端。目标是让同一微信用户在换设备、清缓存或重新打开小程序后仍能恢复收藏与历史。

## Current State

- 收藏使用 `src/stores/favorites.ts`，通过 `uni.setStorageSync('recipe-favorites', ids)` 保存 recipe id。
- 历史使用 `src/stores/history.ts`，通过 `uni.setStorageSync('recipe-history', list)` 保存最近生成记录，最多 50 条。
- 项目没有登录态、用户标识、云函数、云数据库、同步服务或离线同步队列。
- 首页、收藏页、历史页已经能从 Pinia store 读取本地数据并展示计数/列表。

## Target State

- 小程序启动后能获得当前微信用户的稳定云端用户标识。
- 收藏与历史仍保留本地缓存作为即时展示来源，同时在登录后同步到云端。
- 用户进入收藏页/历史页时能看到云端合并后的数据。
- 用户新增/取消收藏、生成历史、删除历史时，本地状态与云端状态最终一致。
- 未登录、网络失败或云同步失败时，小程序不崩溃，仍可用本地缓存。

## Requirements

### SYNC-01 登录态初始化

- Current: App 启动时只加载本地 favorites/history store。
- Target: App 启动时初始化微信用户身份，并暴露可被页面/store 读取的登录与同步状态。
- Acceptance:
  - [ ] 冷启动后能区分 `anonymous`、`syncing`、`ready`、`error` 状态。
  - [ ] 登录失败不会阻塞首页、生成页、详情页使用。

### SYNC-02 收藏云同步

- Current: 收藏只保存 recipe id 到本地缓存。
- Target: 收藏 id 列表可上传云端，并可从云端拉取合并回本地。
- Acceptance:
  - [ ] 收藏一道菜后，本地列表立即更新。
  - [ ] 云同步成功后，重新加载小程序仍能恢复该收藏。
  - [ ] 取消收藏后，云端与本地都不再包含该 recipe id。

### SYNC-03 历史云同步

- Current: 历史只保存到本地缓存，最多 50 条。
- Target: 历史记录可上传云端，并按时间倒序从云端恢复，仍保留最多 50 条。
- Acceptance:
  - [ ] 生成菜谱后历史本地立即出现，并进入待同步或已同步状态。
  - [ ] 云端恢复后历史按 `generatedAt` 倒序展示。
  - [ ] 单条删除历史后，云端与本地都删除对应记录。

### SYNC-04 本地优先与失败降级

- Current: 本地缓存是唯一数据源。
- Target: 本地缓存仍是首屏即时数据源，云端作为登录后的同步源。
- Acceptance:
  - [ ] 网络不可用时收藏/历史仍可本地操作。
  - [ ] 同步失败时页面给出非阻塞提示，不清空本地数据。
  - [ ] 下次同步时能把本地未同步变更推送到云端。

### SYNC-05 用户可见同步状态

- Current: 用户不知道收藏/历史只保存在本机。
- Target: 收藏页和历史页显示简洁的同步状态，必要时允许用户重试同步。
- Acceptance:
  - [ ] 同步中、已同步、同步失败三种状态有明确 UI 表达。
  - [ ] 同步失败时提供重试入口。
  - [ ] 文案明确当前登录/同步状态，不使用 emoji。

### SYNC-06 数据与隐私边界

- Current: 无云端数据。
- Target: 云端仅保存同步所需的最小字段。
- Acceptance:
  - [ ] 收藏只保存用户标识、recipe id、更新时间。
  - [ ] 历史只保存用户标识、recipe id、recipeName、input、generatedAt。
  - [ ] 不保存用户昵称、头像、手机号、地理位置或其他个人资料。

## In Scope

- 新增用户/同步相关 store 或 service。
- 收藏与历史 store 增加云同步入口。
- 收藏页、历史页、首页计数的同步状态展示。
- 云端数据结构、接口契约与本地缓存迁移策略。
- 回归测试覆盖收藏、历史、本地优先、同步失败降级。
- GSD/README/PROJECT/REQUIREMENTS 文档同步。

## Out of Scope

- 不做密码登录、手机号登录、用户资料页。
- 不做菜谱库云端管理，菜谱数据仍在本地。
- 不做 AI 生成菜谱。
- 不做朋友圈分享。
- 不做营养、图片识别、视频菜谱。
- 不引入跨平台后端账号系统；本 phase 面向微信小程序主平台。

## Assumptions

- 使用微信小程序身份作为用户标识来源。
- 云端能力优先按微信小程序生态设计；如果实现时发现当前项目未配置云开发环境，Plan 会拆成“接口契约 + 本地 mock + 配置清单”的可验证阶段。
- 本地缓存 key `recipe-favorites` 与 `recipe-history` 继续保留，作为迁移与离线源。

## Ambiguity Report

- Goal Clarity: 0.86
- Boundary Clarity: 0.82
- Constraint Clarity: 0.76
- Acceptance Criteria: 0.84
- Ambiguity: 0.19

Gate passed: ambiguity <= 0.20 and all dimensions meet minimums.

