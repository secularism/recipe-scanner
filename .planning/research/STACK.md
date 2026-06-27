# v1.2 研究：技术栈

**Milestone:** v1.2 用户身份与远程同步  
**日期:** 2026-06-27  
**范围:** 微信静默登录、后端用户身份、收藏/历史远程同步、本地数据首次合并。

## 参考来源

- 微信小程序登录指南：https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html
- 微信 `wx.login` API：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
- 微信 `code2Session` API：https://developers.weixin.qq.com/miniprogram/dev/OpenApiDoc/user-login/code2Session.html
- uni-app `uni.login`：https://uniapp.dcloud.net.cn/api/plugins/login.html
- 当前后端 schema：`apps/api/prisma/schema.prisma`
- 当前小程序 API client：`apps/miniapp/src/services/recipes-api.ts`
- 当前本地 stores：`apps/miniapp/src/stores/favorites.ts`、`apps/miniapp/src/stores/history.ts`

## 当前技术栈适配度

项目已经有 v1.2 所需的大部分数据基础：

- `User` 已存在，包含 `authProvider`、`externalId`、`deviceKey`、昵称/头像占位字段，以及收藏、历史、识别任务关系。
- `Favorite` 已存在，包含 `userId`、`clientKey`、`recipeId`，并已有用户/菜谱、clientKey/菜谱唯一约束。
- `GenerationHistory` 已存在，包含用户/client 字段、输入数组、匹配菜谱 id 数组和 JSON 快照。
- `RecognitionJob` 已存在，但用户已明确排除识别/OCR 工作，不进入 v1.2。
- 前端 API 调用已集中在 `API_BASE_URL`、`joinApiUrl` 和 `recipes-api.ts` 的可注入 request 模式上。

v1.2 缺的不是大方向建表，而是 auth/session 模块、鉴权 endpoint、DTO、前端 auth/sync client，以及让同步可重试且不重复写入的细节。

## 建议新增

### 后端

新增 auth 模块、同步域模块和轻量鉴权 guard：

- `apps/api/src/auth/`
  - `auth.controller.ts`：`POST /auth/wechat`
  - `auth.service.ts`：用 code 换 openid，upsert user，并创建应用自己的 session。
  - `wechat-auth.client.ts`：隔离 `code2Session` HTTP 调用，方便测试替换。
  - `auth.guard.ts`：读取 bearer token，并把用户上下文挂到 request。
  - `auth.dto.ts`：请求/响应契约。
- `apps/api/src/sync/`，或拆成 `favorites/` 与 `history/`
  - 收藏 list/upsert/delete/bulk-merge endpoints。
  - 历史 list/create/delete/clear/bulk-merge endpoints。

本 milestone 建议优先使用服务端自有的 opaque session token，而不是立刻引入 JWT/Passport：

- 用 Node `crypto` 生成随机 token。
- 服务端只存 token hash。
- 原始 token 只在登录成功时返回给小程序。
- `Authorization: Bearer <token>` 进入后端后 hash 查表验证。

这样可以少加依赖，也能明确遵守微信文档边界：`session_key` 不下发给小程序。

### Prisma

为可重试同步补齐幂等字段：

- 新增 `UserSession`
  - `id`、`userId`、`tokenHash`、`expiresAt`、`createdAt`、`lastUsedAt`、可选 `revokedAt`
  - `tokenHash` 唯一索引
- 给 `GenerationHistory` 新增 `clientItemId` 或 `sourceLocalId`
  - 有值时按 `[userId, clientItemId]` 唯一
  - 用于首次登录合并重试时避免重复上传旧本地历史。
- 只有 v1.2 要做完整离线删除冲突时才考虑 `deletedAt`。首版可先用本地 pending op 队列。

收藏的幂等性已经可以依赖 `@@unique([userId, recipeId])`，前提是服务端 endpoint 先把小程序 public recipe id 解析成内部 recipe UUID。

### 小程序

沿用现有可注入 request 风格新增客户端：

- `services/auth-api.ts`
  - `loginWithWechatCode(code)`
  - 登录成功后把 token/user 写入 auth store。
- `services/user-sync-api.ts`
  - `fetchFavorites`、`mergeFavorites`、`addFavorite`、`removeFavorite`
  - `fetchHistory`、`mergeHistory`、`createHistory`、`removeHistory`、`clearHistory`
- 把 recipes-only 的 `GET` request 类型扩展为支持 method/header/body 的通用请求 helper。

新增 Pinia store：

- `stores/auth.ts`：token、user id、登录状态、`ensureLogin()`、load/persist token。
- 扩展 `stores/favorites.ts` 和 `stores/history.ts`：保留本地优先行为，登录后再调度远程同步。

### 配置

后端 `.env.example` 需要新增：

- `WECHAT_APP_ID`
- `WECHAT_APP_SECRET`
- `AUTH_SESSION_TTL_DAYS`
- 如果使用签名 token，再加 `AUTH_TOKEN_SECRET`；opaque token 不需要。

小程序端可继续保留 `API_BASE_URL`，但 auth/sync client 需要统一加 token header。

## 不建议新增

- 不做用户资料页，除非后续 requirements 明确需要。
- 不把 `session_key` 暴露或存到小程序端。
- 不做图片上传、OCR 或识别任务工作流。
- 不让收藏/历史按钮依赖网络成功。
- 不改 matcher/generator 的推荐逻辑。

## 测试影响

后端：

- Auth service 用 fake `code2Session` 覆盖成功和错误响应。
- Guard 覆盖缺失、非法、过期、有效 token。
- 收藏/历史 contract tests 尽量沿用当前 `recipes-contract.test.ts` 的轻量 fake Prisma 风格。

小程序：

- Auth API client 用 fake request 测试。
- Store 测试覆盖本地优先和同步失败保留本地数据。
- 现有 `recipes-api`、matcher、e2e 测试继续保持网络无关。

