# v1.2 研究：架构

**Milestone:** v1.2 用户身份与远程同步  
**日期:** 2026-06-27

## 推荐流程

### 登录

1. 小程序调用 `uni.login({ provider: 'weixin' })`。
2. 小程序把 code 发给 `POST /api/auth/wechat`。
3. 后端携带 `WECHAT_APP_ID`、`WECHAT_APP_SECRET` 和一次性 code 调微信 `code2Session`。
4. 后端 upsert `User`：
   - `authProvider = WECHAT`
   - `externalId = openid`
   - unionid 可保存到 metadata 或新增一等字段。
5. 后端创建自有 app session，返回：
   - user id
   - token
   - 过期时间
   - 可选 `isNewUser`
6. 小程序保存 token，并用 `Authorization: Bearer <token>` 调同步接口。

### 首次登录合并

1. Auth store 登录成功。
2. Sync coordinator 读取当前本地收藏和历史。
3. 小程序调用 `POST /api/me/sync/bootstrap`，或分别调用收藏/历史 merge endpoint。
4. 后端把 public recipe id（`slug || legacyId`）解析成内部 recipe UUID。
5. 后端按 `[userId, recipeId]` upsert 收藏。
6. 后端按 `clientItemId` 或幂等签名创建缺失历史。
7. 后端返回 canonical remote 收藏/历史。
8. 小程序把远程状态合并进本地 store，并标记当前用户已完成首次同步。

### 后续收藏

保持本地优先：

1. 用户点击收藏。
2. Store 立即更新本地 ids 并持久化。
3. 如果已登录，发送或入队远程 mutation：
   - `PUT /api/me/favorites/:publicRecipeId`
   - `DELETE /api/me/favorites/:publicRecipeId`
4. 成功后标记已同步。
5. 失败时保留本地状态，并保留可重试 pending op。

### 后续历史

1. 结果页成功生成后继续调用 `histStore.addIfFresh(...)`。
2. Store 创建本地 item。
3. 如果已登录，发送 `POST /api/me/history`。
4. 后端带 `clientItemId` 或幂等签名存储。
5. 历史页可拉远程状态并合并到本地。

## 后端模块

建议 phase 拆分顺序：

1. `AuthModule`
   - 登录 endpoint
   - WeChat client
   - session 存储
   - guard
2. `FavoritesModule`
   - 当前用户 list/add/delete/merge
3. `HistoryModule`
   - 当前用户 list/create/delete/clear/merge
4. DTO/序列化公共 helper
   - public recipe id 解析
   - 本地历史快照映射

当前 `RecipesModule` 继续保持公开只读。

## 数据模型注意点

现状：

- `Favorite.recipeId` 指向内部 recipe UUID，小程序使用 public id（`slug || legacyId`）。API 层必须负责转换。
- `GenerationHistory.matchedRecipeIds` 当前是 `String[]`。需要明确它存 public id 还是内部 UUID。为了前端稳定，DTO 层应始终返回 public id；关系约束只在需要时内部解析。

建议改动：

- 新增 `UserSession`。
- 新增历史幂等字段：
  - `clientItemId String?`
  - `@@unique([userId, clientItemId])`
- `lastSyncedAt` 优先放客户端即可，服务端可以只作为 canonical 数据源。

## 小程序集成点

- `App.vue`
  - 当前负责加载 favorites/history。
  - 追加 auth load，并在本地 store load 后做后台登录/同步。
- `stores/favorites.ts`
  - 保留当前本地 ids 数组。
  - 增加远程同步状态、pending ops 和异步远程方法。
- `stores/history.ts`
  - 保留当前 list 与 `addIfFresh`。
  - 增加远程 create/fetch/merge 和 pending op 状态。
- `services/recipes-api.ts`
  - 可把现有 request 模式抽成通用 helper，或新增独立 client 保持注入模式。
- `pages/favorites/favorites.vue`
  - 保留本地数量和“收藏记录还在”的提示。
  - 可增加轻量同步失败/重试状态。
- `pages/history/history.vue`
  - 先展示本地，再 hydrate 远程。
- `pages/result/result.vue`
  - 历史写入仍发生在成功生成后；远程写入为 best-effort。

## API 形态候选

```text
POST   /api/auth/wechat
GET    /api/me
GET    /api/me/favorites
POST   /api/me/favorites/merge
PUT    /api/me/favorites/:recipeId
DELETE /api/me/favorites/:recipeId
GET    /api/me/history
POST   /api/me/history
POST   /api/me/history/merge
DELETE /api/me/history/:historyId
DELETE /api/me/history
```

公开 endpoint 的 `recipeId` 应接受小程序已有 public id（slug 或 legacyId），不要要求前端知道数据库 UUID。

## 建议构建顺序

1. 后端 auth/session 基础与测试。
2. 后端收藏/历史 endpoints 与测试。
3. 小程序 auth client/store 和带 token 的 request helper。
4. 小程序收藏同步。
5. 小程序历史同步。
6. fake request 路径和完整小程序验证门。

