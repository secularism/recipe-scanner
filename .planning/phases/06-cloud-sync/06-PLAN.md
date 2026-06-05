# Phase 6 Plan — 用户登录与收藏/历史云同步

## Objective

在不破坏当前本地缓存体验的前提下，为收藏与历史增加微信用户身份和云同步能力，让同一用户在换设备或清缓存后可以恢复数据。

## Scope

- 新增同步状态管理与云端 adapter 契约。
- 扩展 favorites/history store 支持 local-first 同步。
- 收藏页和历史页显示同步状态与失败重试。
- 保留本地缓存 key 与现有页面流转。
- 补测试和文档。

## Non-Goals

- 不做用户资料页。
- 不保存昵称、头像、手机号、位置。
- 不改菜谱本地数据源。
- 不接 AI。
- 不做朋友圈分享。

## Tasks

### 1. 同步契约与类型

- [ ] 新增 sync/user 相关类型：用户标识、同步状态、收藏云记录、历史云记录。
- [ ] 新增 sync adapter 接口，隔离真实微信云端与测试 mock。
- [ ] 明确本地缓存与云端记录的转换函数。

### 2. 登录与同步状态

- [ ] 新增 user/sync store，提供 `anonymous`、`syncing`、`ready`、`error` 状态。
- [ ] 在 `App.vue` 启动阶段初始化同步，但不阻塞页面渲染。
- [ ] 登录失败时保留本地模式。

### 3. 收藏同步

- [ ] favorites store 保持本地即时 toggle。
- [ ] 登录后拉取云端收藏并与本地 id 合并去重。
- [ ] toggle 后触发云端 upsert/delete。
- [ ] 失败时保留本地变更并标记待同步。

### 4. 历史同步

- [ ] history store 保持本地即时 add/remove。
- [ ] 登录后拉取云端历史，按 `generatedAt` 倒序合并，最多 50 条。
- [ ] add/remove 后触发云端 upsert/delete。
- [ ] 保留 3 秒内同输入去重逻辑。

### 5. UI 状态与重试

- [ ] 收藏页显示同步中、已同步、同步失败状态。
- [ ] 历史页显示同步中、已同步、同步失败状态。
- [ ] 同步失败时提供重试入口。
- [ ] 文案不使用 emoji，图标用 `uni-icons`。

### 6. 测试与验证

- [ ] 补 sync adapter/mock 单测。
- [ ] 补 e2e：收藏本地即时更新、云端恢复、取消收藏同步。
- [ ] 补 e2e：历史新增、云端恢复、删除同步。
- [ ] 覆盖同步失败降级场景。
- [ ] 跑完整验证门。

### 7. 文档同步

- [ ] 更新 README 的收藏/历史机制说明。
- [ ] 更新 `.planning/PROJECT.md`、`.planning/REQUIREMENTS.md`、`.planning/ROADMAP.md`、`.planning/STATE.md`。
- [ ] 写 Phase 6 SUMMARY/REVIEW。

## Verification Gate

- [ ] `npx tsc --noEmit`
- [ ] `npx tsx tests/e2e.test.ts`
- [ ] `npx tsx tests/matcher.test.ts`
- [ ] `npx tsx tests/sync.test.ts`（如果新增）
- [ ] `npm run build:mp-weixin`
- [ ] `npm run dev:mp-weixin`

## Acceptance Criteria

- [ ] 未登录或云同步失败时，生成、收藏、历史仍能本地使用。
- [ ] 登录同步成功后，收藏可从云端恢复。
- [ ] 登录同步成功后，历史可从云端恢复并保持倒序。
- [ ] 删除/取消操作能同步到云端。
- [ ] 同步状态对用户可见，失败可重试。
- [ ] 不保存昵称、头像、手机号、位置等个人资料。

## Risks

- 微信云开发环境如果未配置，真实云端验收会被阻塞。
- `wx.cloud` API 需要条件隔离，避免 H5/Node 测试环境失败。
- 本地与云端冲突处理如果过于复杂，可能影响 Phase 6 范围；本 phase 优先按去重合并与最新更新时间处理。

