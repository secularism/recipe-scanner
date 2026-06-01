# recipe-scanner

微信小程序：根据你的食材和调味料，智能推荐菜谱。

## 技术栈

- uni-app + Vue 3 + TypeScript
- vue-cli 5 构建
- Pinia 状态管理
- uni-ui 组件库

## 项目结构

```
src/
├── pages/        # 页面（index/generator/result/detail/favorites/history）
├── components/   # 公共组件
├── stores/       # Pinia stores
├── services/     # 业务服务（matcher/generator/storage）
├── types/        # TS 类型定义
├── data/         # 静态数据（菜谱库）
├── styles/       # 全局样式
├── static/       # 静态资源
├── App.vue       # 应用入口
├── main.ts       # 启动文件
├── manifest.json # uni-app 应用配置
└── pages.json    # 页面路由配置
```

## 开发

```bash
# 微信小程序
npm run dev:mp-weixin

# H5
npm run dev:h5

# 类型检查
npm run type-check
```

微信开发者工具导入 `dist/dev/mp-weixin` 目录。
