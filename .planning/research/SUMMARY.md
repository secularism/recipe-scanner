# v1.2 研究汇总

**Milestone:** v1.2 用户身份与远程同步  
**日期:** 2026-06-27

## 技术栈补充

v1.2 应在现有 NestJS + Prisma 后端上增加一层轻量 auth/session 和用户同步 API。当前 schema 已经包含 `User`、`Favorite`、`GenerationHistory`、`RecognitionJob`，所以本 milestone 的重点是：

- 后端调用微信 `code2Session` 完成登录换取。
- 服务端自有 session，优先使用 opaque random bearer token，并只存 hash。
- `/api/me/*` endpoint 鉴权 guard。
- 收藏/历史 merge 与 mutation API。
- 小程序 auth/sync client，支持 token header。
- Pinia auth store，并扩展收藏/历史 store 的本地优先同步。

首版不需要引入大型认证框架。除非实现阶段证明 opaque session 不够，否则先避免 JWT/Passport 复杂度。

## 基础功能

- 通过 `uni.login` 做微信静默登录。
- 后端用 code 换 openid/unionid/session_key，但绝不把 `session_key` 暴露给小程序。
- 小程序保存应用 session token。
- 首次登录时上传本地收藏/历史并做增量合并。
- 登录后收藏和历史可以写远程。
- 收藏页和历史页可以从远程恢复记录。
- 网络或 auth 失败时，不破坏本地生成、收藏、历史和草稿体验。

## 架构建议

建议顺序：

1. `AuthModule`：`POST /api/auth/wechat`、WeChat client、`UserSession`、auth guard。
2. `FavoritesModule`：当前用户 list、merge、add、delete。
3. `HistoryModule`：当前用户 list、merge、create、delete、clear。
4. 小程序 `auth-api` 和 auth store。
5. 小程序 sync client 与本地优先 store 集成。

同步原则：

- 收藏依赖 `[userId, recipeId]` 唯一约束即可实现幂等。
- 历史需要 `clientItemId` 或幂等 key，避免 bootstrap 重试重复上传。
- 公开 API 应接受小程序 public recipe id（`slug || legacyId`），由服务端解析内部 UUID。

## 主要风险

- 不要把 `session_key` 发给小程序。
- 不要复用失败或过期的登录 code；应重新调用 `uni.login`。
- 不要用远程结果无脑覆盖本地收藏/历史。
- 不要让 bootstrap 重试生成重复历史。
- 不要混淆 public recipe id 和数据库 UUID。
- 不要让 auth 失败阻塞核心生成流程。
- 不要扩范围到识别/OCR、资料页或跨设备冲突 UI。

## 建议需求分类

1. **Auth**：静默登录、session token、auth guard、token 过期处理。
2. **Favorites Sync**：首次合并、远程 list/add/delete、失败保留本地。
3. **History Sync**：首次合并、远程 create/list/delete/clear、bootstrap 幂等。
4. **Client Sync UX**：auth store、本地优先更新、失败可重试、不破坏 hydrate。
5. **Verification**：后端 contract tests、小程序 API/store tests、现有验证门继续通过。

## 研究置信度

登录和安全边界置信度高，因为来自微信和 uni-app 官方文档。同步策略置信度中等，因为这是结合当前仓库结构做出的架构选择；requirements 阶段应继续保持 v1.2 的冲突处理足够简单。

