# Requirements: 菜谱生成小程序 v1.1 API 接入

**Defined:** 2026-06-21
**Core Value:** 用户输入食材和调味料，立刻得到一份可做的菜谱。

## v1.1 Requirements

### Backend Recipes API

- [x] **API-01**: 后端 recipes 列表接口可返回前端 matcher 所需字段，包括 `legacyId`/`slug`、名称、简介、菜系、口味、标签、烹饪时间、难度、食材、调味料和步骤。
- [x] **API-02**: 后端 recipes 详情接口可通过 `legacyId` 或 `slug` 返回完整菜谱详情，并保持现有 `mapo-tofu` 等分享路径可用。
- [x] **API-03**: 后端只返回 `PUBLISHED` 菜谱给小程序读取，避免草稿或归档菜谱进入前端推荐。
- [x] **API-04**: 后端响应结构有稳定的前端映射边界，前端不直接依赖 Prisma 内部字段命名。

### Miniapp API Client

- [x] **CLIENT-01**: 小程序有统一 recipes API client，封装 `uni.request`、base URL、错误处理和响应解析。
- [x] **CLIENT-02**: 小程序有后端菜谱到前端 `Recipe` 类型的 mapper，覆盖字段重命名和 `metadata.difficulty` 默认值。
- [x] **CLIENT-03**: API base URL 在一个配置文件中集中管理，开发环境可指向 `http://47.96.36.31/api`。
- [x] **CLIENT-04**: recipes API client 可被测试替换或注入，不让单元测试依赖真实网络。

### Generation Flow

- [x] **GENAPI-01**: 结果页生成流程异步加载真实 recipes 数据后继续使用现有 matcher 计算排序和契合度。
- [x] **GENAPI-02**: 结果页加载期间展示明确 loading 状态，接口失败时展示错误与重试入口。
- [x] **GENAPI-03**: “换一换”继续在真实 recipes 数据源产生的候选池中工作，不重复当前首推菜谱。
- [x] **GENAPI-04**: 生成历史仍保存到本地缓存，记录的 recipe id 使用可被详情接口解析的 `legacyId` 或 `slug`。

### Detail, Favorites, History

- [x] **READ-01**: 详情页通过真实 recipes 详情接口读取菜谱，不再依赖本地 `findRecipeById`。
- [x] **READ-02**: 从微信分享 path 打开详情页时，可用 path 中的 id/slug 拉取真实菜谱详情。
- [x] **READ-03**: 收藏页仍使用本地收藏 id 列表，但展示菜谱卡片时从真实接口读取对应菜谱信息。
- [x] **READ-04**: 历史页仍使用本地历史记录，但点击历史记录可通过真实接口进入详情页。
- [x] **READ-05**: 网络失败不会清空或破坏本地收藏、历史和草稿数据。

### Verification

- [x] **VERIFY-01**: 新增 mapper 和 API client 的单元测试，覆盖成功响应、缺失可选字段和错误响应。
- [x] **VERIFY-02**: 更新现有 e2e/matcher 测试，使 matcher 仍可用本地测试数据验证排序逻辑。
- [x] **VERIFY-03**: 提交前通过 miniapp type-check、e2e、matcher 测试和 mp-weixin build。
- [x] **VERIFY-04**: 按 Phase 11 决策在 SUMMARY 中记录为 deferred，不新增 README/release checklist。

## Future Requirements

### Remote Writes

- **WRITE-01**: 收藏/取消收藏写入后端。
- **WRITE-02**: 生成历史写入后端。
- **WRITE-03**: 使用 `clientKey` 或 guest user 关联跨会话数据。

### Recognition

- **RECOG-01**: 图片上传后创建识别任务。
- **RECOG-02**: OCR 结果转为候选食材。
- **RECOG-03**: 识别任务状态可轮询或刷新。

## Out of Scope

| Feature | Reason |
|---------|--------|
| 收藏/历史远程写接口 | v1.1 先收窄为 recipes 读链路，避免同时引入用户身份和同步策略 |
| 用户登录、手机号、资料页 | recipes 读接口不需要用户系统 |
| 图片上传、OCR、拍照识别 | 依赖对象存储和异步任务链路，后续单独规划 |
| AI 生成菜谱 | 本阶段只替换菜谱读取数据源，不改推荐生成方式 |
| 重写 matcher 算法 | 保持现有推荐行为稳定，只替换菜谱数据来源 |
| 离线 fallback 菜谱库 | 本阶段目标是接入真实接口；网络失败以错误和重试处理 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| API-01 | Phase 9 | Complete |
| API-02 | Phase 9 | Complete |
| API-03 | Phase 9 | Complete |
| API-04 | Phase 9 | Complete |
| CLIENT-01 | Phase 10 | Complete |
| CLIENT-02 | Phase 10 | Complete |
| CLIENT-03 | Phase 10 | Complete |
| CLIENT-04 | Phase 10 | Complete |
| GENAPI-01 | Phase 10 | Complete |
| GENAPI-02 | Phase 10 | Complete |
| GENAPI-03 | Phase 10 | Complete |
| GENAPI-04 | Phase 10 | Complete |
| READ-01 | Phase 11 | Complete |
| READ-02 | Phase 11 | Complete |
| READ-03 | Phase 11 | Complete |
| READ-04 | Phase 11 | Complete |
| READ-05 | Phase 11 | Complete |
| VERIFY-01 | Phase 11 | Complete |
| VERIFY-02 | Phase 11 | Complete |
| VERIFY-03 | Phase 11 | Complete |
| VERIFY-04 | Phase 11 | Deferred by user decision in Phase 11 summary |

**Coverage:**
- v1.1 requirements: 21 total
- Mapped to phases: 21
- Unmapped: 0

---
*Requirements defined: 2026-06-21*
*Last updated: 2026-06-24 after Phase 11 execution*
