# v1.2 研究：风险与坑点

**Milestone:** v1.2 用户身份与远程同步  
**日期:** 2026-06-27

## 登录风险

### 把 `session_key` 下发给小程序

微信文档把 `session_key` 定位为敏感的服务端密钥。应用应该只返回自己的 session token，不能把 `session_key` 写进前端 storage、DTO、日志或测试 fixture。

预防：

- Auth DTO 不包含 `session_key`。
- WeChat client 返回的内部对象只在 auth service 内使用。
- 测试断言登录响应不包含 `session_key`。

### 复用登录 code

登录 code 是临时且一次性的。用同一个 code 重试 `POST /auth/wechat` 可能触发 invalid-code。

预防：

- 小程序重试时重新调用 `uni.login` 获取新 code。
- 登录错误提示应表达“重新登录”，而不是重试同一个 code。
- 后端把微信错误映射成稳定的应用错误。

### app secret 配置缺失

缺少 `WECHAT_APP_ID` / `WECHAT_APP_SECRET` 时，后端应清晰失败。

预防：

- `.env.example` 补齐配置项。
- Auth service 启动或首次调用时给出明确错误。
- 测试覆盖缺配置场景。

## 同步风险

### 远程覆盖导致本地数据丢失

用户已选择本地优先合并。远程 hydrate 不能清空未同步的本地收藏或历史。

预防：

- 首次登录同步必须是 additive merge。
- 本地 store 合并远程结果，不做无条件赋值，除非用户明确选择远程恢复。
- 测试覆盖远程失败或返回更少记录时，本地收藏/历史仍保留。

### 重复 bootstrap 导致历史翻倍

收藏 merge 可以依赖 user/recipe 唯一约束。历史没有本地 id 或签名就无法安全重试。

预防：

- 给 `GenerationHistory` 增加 `clientItemId` 或等价幂等 key。
- bulk merge 使用 upsert 或 skip duplicates。
- 测试连续调用两次 bootstrap，历史数量不翻倍。

### public id 与数据库 UUID 混淆

小程序使用 public recipe id（slug 或 legacyId），而 `Favorite.recipeId` 是内部 UUID。直接把 public id 写入 `recipeId` 会破坏关系。

预防：

- 服务端 endpoint 接受 public recipe id，并在服务端解析菜谱。
- DTO 返回 public id 给小程序。
- 测试覆盖 slug、legacyId、缺失菜谱和 UUID-looking 字符串。

### 离线删除冲突

用户离线取消收藏后，如果之后直接拉远程状态，旧远程收藏可能被重新并回本地。

预防：

- 本地记录 pending favorite ops。
- 展示远程结果前先应用 pending delete。
- v1.2 明确采用简单的“最后本地操作优先”；跨设备冲突 UI 延后。

### 账号失败阻塞核心体验

当前应用不需要账号也能用。v1.2 不能让登录失败导致生成菜谱不可用。

预防：

- 登录在 app 启动或首次同步时 best-effort 执行。
- recipes 读接口保持公开。
- 收藏/历史本地 store 在无 token 时继续工作。

## 安全风险

### token 无过期或不可吊销

永久 token 难以失效，设备共享时风险更高。

预防：

- 服务端 session 存 `expiresAt`。
- 小程序遇到 401 清 token 并重新登录。
- 服务端只存 token hash，不存原始 token。

### 过早采集用户资料

静默登录不需要昵称/头像/profile 授权。过早采集会扩大隐私和 UI 范围。

预防：

- v1.2 只保存同步所需身份字段。
- 资料页和昵称头像留给后续 milestone。

### 缺少 payload 上限

登录和同步接口都可能被频繁调用或传大 payload。

预防：

- 增加基础请求校验和 payload 长度限制。
- history list 和 merge payload 有上限。
- 后端契约与当前前端 `MAX_ITEMS = 50` 保持一致。

## 测试风险

### 测试误打真实微信或真实网络

v1.1 已建立可注入 client 模式，v1.2 应继续沿用。

预防：

- Auth service 的 WeChat client 可替换。
- 小程序 auth/sync client 接受 fake request。
- 现有测试继续不依赖真实 `uni.request`。

### schema 已有但能力未实现

因为 `User`、`Favorite`、`GenerationHistory` 已经存在，很容易误以为同步已经完成。

预防：

- Requirements 必须写用户可见和 API 可见能力，不只写 schema。
- Roadmap 要把 schema hardening、endpoint、前端 store 集成分开。

