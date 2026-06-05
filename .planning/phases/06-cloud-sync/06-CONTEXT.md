# Phase 6 Context — 用户登录与收藏/历史云同步

## Trigger

用户在 Phase 5 验收时追问：没有登录时收藏与历史如何保存。当前确认答案是本机小程序缓存，换设备、清缓存或卸载后不会保留。Phase 6 因此聚焦账号态与云同步能力。

## Current Code Baseline

- `src/stores/favorites.ts`
  - 存储 key：`recipe-favorites`
  - 数据形态：`string[]` recipe id
  - 能力：load、toggle、isFavorite、computed list/count
- `src/stores/history.ts`
  - 存储 key：`recipe-history`
  - 数据形态：`HistoryItem[]`
  - 能力：load、add、addIfFresh、remove、clear
  - 限制：最多 50 条，3 秒内同输入去重
- `src/App.vue`
  - 启动时加载 favorites/history store
- 页面
  - 首页展示收藏/历史数量
  - 收藏页展示已收藏 recipe
  - 历史页展示生成记录，支持单条删除

## Product Baseline

- v1 已实现本地规则匹配、生成、详情、收藏、历史、分享与 Phase 5 UI。
- 当前不接登录、不接云端账号、不支持跨设备同步。
- 用户已要求每次合并后必须同步 `.planning` 与项目 Markdown。

## Phase 6 Problem Statement

收藏与历史是用户持续使用菜谱小程序的核心资产。只存在本机缓存会导致用户换设备或清缓存后丢失数据，也让“收藏”这个动作在产品语义上显得不完整。Phase 6 需要在不破坏本地即时体验的前提下，引入微信小程序身份与云端同步。

## Key Constraints

- 微信小程序为主平台，H5 兼容不作为本 phase 的主要验收目标。
- 不保存昵称、头像、手机号、位置等个人资料。
- 不能让登录或云同步失败阻塞做饭主流程。
- 保留本地缓存作为首屏数据和离线降级。
- 单个 `.ts` / `.vue` 文件仍需控制在 300 行以内。
- UI 继续使用 uni-ui 图标，不使用 emoji。

## Open Implementation Decisions

- 是否直接接微信云开发，还是先做可替换的 sync adapter。
- 云端写入策略是每次操作即时同步，还是本地队列批量同步。
- 冲突策略是云端优先、本地优先，还是按更新时间合并。
- 是否需要用户手动触发同步重试，或只在失败时显示入口。

