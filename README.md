# recipe-scanner

微信小程序：根据你的食材和调味料，智能推荐菜谱。

## 技术栈

- **uni-app** (Vue 3 + TypeScript + Composition API)
- **Vite** 构建（uni-app 官方推荐，vue-cli 已废弃）
- **Pinia** 状态管理（收藏/历史持久化）
- **uni-ui** 组件库
- **Sass** 样式预处理

## 功能

- 选食材（多选/自定义）+ 选调味料（多选/自定义）
- 选菜系 + 选口味偏好
- 本地匹配算法：食材覆盖率 70% + 调味料覆盖率 30% + 菜系/口味加分
- 26 道真实菜谱（川/粤/家常/西餐/日韩/东北）
- 收藏 / 历史记录（本地存储）
- 微信分享给好友（不含朋友圈）
- 分享卡片点开直达菜谱详情（`?id=xxx&from=share`）

## 目录结构

```
src/
├── pages/        # 6 个页面：index/generator/result/detail/favorites/history
├── components/   # 5 个公共组件：TagSelector/ChipInput/RecipeCard/EmptyState/SectionTitle
├── stores/       # Pinia stores：favorites/history
├── services/     # matcher.ts + generator.ts（业务服务）
├── types/        # TS 领域类型
├── data/         # 静态数据：食材/调味料/菜谱（按菜系分文件）
├── static/       # 静态资源
├── App.vue
├── main.ts       # 启动入口（注册 Pinia）
├── manifest.json # uni-app 应用配置
├── pages.json    # 页面路由配置
└── uni.scss      # 全局样式（手绘插画风）
```

当前源码文件遵循 AGENTS.md 的单文件 ≤ 300 行约束，模块边界清晰。

## 开发

```bash
# 安装依赖
npm install

# 微信小程序开发
npm run dev:mp-weixin
# 微信开发者工具导入 dist/dev/mp-weixin

# 微信小程序生产构建
npm run build:mp-weixin

# H5 开发
npm run dev:h5

# 类型检查
npm run type-check

# 单元测试
npx tsx tests/matcher.test.ts
```

## 关键设计

- **模块化菜谱数据**：`src/data/recipes-{sichuan,home,western,northeast}.ts` 按菜系分文件
- **匹配算法**：`services/matcher.ts` 单一职责，可独立测试
- **状态持久化**：Pinia + `uni.setStorageSync`，跨页实时同步
- **分享策略**：`onShareAppMessage` 提供 path 含 `?id=xxx&from=share`；**没有** `onShareTimeline`，确保不上朋友圈
- **UI 风格**：手绘插画风 — 暖橘主色、米白背景、圆角卡片、uni-icons 图标与内联 SVG 装饰；UI 代码不使用 emoji
- **收藏/历史机制**：当前版本不接登录与云端账号。收藏保存 recipe id 到本机小程序缓存 `recipe-favorites`；历史保存最近生成记录到本机小程序缓存 `recipe-history`，最多 50 条。换设备、清缓存或卸载小程序后不会保留。

## 小程序验证

```bash
# 微信小程序开发构建，供开发者工具导入
npm run dev:mp-weixin
# 导入 dist/dev/mp-weixin

# 微信小程序生产构建
npm run build:mp-weixin
# 导入 dist/build/mp-weixin
```

当前微信小程序 appid 统一配置为 `wxb8b86d12083c52cd`。
