# AGENTS.md — AI Agent 工作规则 (菜谱生成小程序)

> 本文件供 AI Agent（Claude / opencode / 其他 LLM）每次进入本项目时**必读**。
> 后续所有 phase / plan 的执行都按本文件规则走。

---

## 0. 项目背景

- **项目**：微信小程序「菜谱生成」(recipe-scanner)
- **技术栈**：uni-app + Vue 3 + TypeScript + Vite + Pinia + uni-ui
- **目标平台**：微信小程序（主），H5 兼容
- **当前 main 分支**：bootstrap 状态（4 个 build phase + 自测修复 + UI-SPEC）

`.planning/` 下有：
- `PROJECT.md` — 项目定义
- `REQUIREMENTS.md` — 17 条 v1 需求
- `ROADMAP.md` — 5 个 phase 路线图
- `STATE.md` — 当前进度
- `phases/NN-xxx/` — 每个 phase 的详细产物（CONTEXT/RESEARCH/PLAN/UI-SPEC/REVIEW）

---

## 1. 分支管理规则（强制）

### 1.1 主分支

- **`main`** — 受保护分支。**只接受** feature 分支的 PR/merge，不允许直接 commit 至此分支。
- Agent **永远不要**直接在 `main` 上做开发。

### 1.2 feature 分支命名

每次接到新的 GSD phase / plan / 任务时，**第一步**从 main 拉取新分支：

```bash
git checkout main
git pull origin main
git checkout -b feat/MM-DD/phase-NN-<功能简述>
```

- `MM-DD`：当前日期（月-日），如 `06-02`
- `phase-NN`：当前 phase 编号，2 位补零，如 `phase-05`
- `<功能简述>`：英文短横线分隔，≤ 30 字符
  - 全部小写英文
  - 例：`ui-redesign` / `add-favorites-share` / `fix-history-dedup`

**示例**：
- `feat/06-02/phase-05-ui-redesign`
- `feat/06-15/phase-06-ai-integration`
- `feat/07-01/hotfix-empty-state-crash`

### 1.3 拉取分支后必须告知用户

每次拉取完新分支，**必须**用以下格式向用户报告（中文）：

```
已拉取分支：feat/MM-DD/phase-NN-<功能简述>
当前工作分支：<分支名>（基于 main @ <commit hash>）
开始执行：<本次任务一句话描述>
```

然后再 `git checkout` 切换到该分支（`git checkout -b` 已自动切换）。

### 1.4 提交与推送

每次开发完毕（一个 plan / 一个 phase 结束）：

```bash
git add <具体文件>      # 不要用 git add -A，先看 git status
git status              # 复核暂存区
git diff --cached --stat  # 复核变更规模
git commit -m "<type>(<scope>): <subject>" -m "<body>"
git push -u origin feat/MM-DD/phase-NN-<功能简述>
```

**必须遵守**：
- 不要用 `git add -A` / `git add .`（可能误提交 .env、token 等）
- commit 前用 `git status` + `git diff --cached` 复核
- push 前用 `git log --oneline` 确认只包含本次任务的 commits
- 推送成功后向用户报告 commit hash + 文件清单

### 1.5 合并由用户处理

- Agent **不要**自己 merge 到 main
- 推送完成后告知用户：「请验证后自行 merge 到 main」

---

## 2. Commit 信息规范

### 格式

```
type: 具体更改内容
```

**只写一行**，不加 body。type 后用**英文冒号 + 空格**，内容用中文描述。

### type 清单

| Type | 场景 |
|---|---|
| `feat` | 新功能（新 plan、新页面、新组件） |
| `fix` | 修 bug（闪退、NPE、逻辑错误） |
| `refactor` | 改结构不改功能（重命名、拆文件、移动包） |
| `docs` | 文档（CLAUDE.md、plan 文档、ROADMAP） |
| `test` | 测试 |
| `chore` | 杂项（删文件、清理代码、build 配置） |

### 示例

```
feat: 新增首页一键预设卡
fix: 修复 result 页历史重复入库
refactor: 拆分 history store 为 addIfFresh 与 add 两个方法
docs: 更新 AGENTS.md commit 规范
test: 补 e2e 用例覆盖换一换场景
chore: 删除废弃的 vue-cli 配置文件
```

### 注意事项

- 不加 scope（不要写 `fix(stores):` 这种）
- 不加 body
- type 必须是上述 6 个之一，其他不接受
- 内容开头用动词：「新增」「修复」「重构」「更新」「删除」「拆分」

---

## 3. 工作流（与 GSD 配合）

### 3.1 接到新 phase / plan 时

1. 读 `.planning/STATE.md` 确认当前 phase
2. 读 `.planning/ROADMAP.md` 看 phase 详情
3. 读 `phases/NN-xxx/` 下的 CONTEXT.md / RESEARCH.md / PLAN.md
4. 拉取 feature 分支（见 §1.2）
5. 告知用户（见 §1.3）
6. 开始按 PLAN.md 的任务清单执行

### 3.2 执行任务时

- 严格按 PLAN.md 的任务列表顺序执行
- 每个任务完成后用 `todowrite` 工具标记 `completed`
- 不要跳过验证步骤（type-check / test / build）
- 不要超过 PLAN 范围（scope creep）

### 3.3 一个 phase 结束时

1. 跑完整验证（`npm run type-check` + `npm test` + `npm run build:mp-weixin`）
2. 更新 `.planning/STATE.md`（Last Updated、当前 phase、Plan 计数）
3. 写本 phase 的 REVIEW.md（如适用）
4. 提交 + 推送 feature 分支
5. 告知用户 commit hash + 等用户 merge

### 3.4 UI 类 phase 特殊流程（Phase 5 起）

UI 相关 phase **不要**直接动手改组件代码，必须等 OpenDesign 设计图：

1. 先产出 `UI-SPEC.md`（中文设计契约）
2. 提交 feature 分支 + 推送到远程
3. **告知用户**：请用 OpenDesign 按 UI-SPEC §12 prompt 模板生成设计图
4. **等用户把图发回来**之后，再按图重写组件代码
5. UI 重构完成后单独一个 commit 推送

---

## 4. 代码约束

### 4.1 文件粒度

- 单个 `.ts` / `.vue` 文件 ≤ 300 行
- 超 300 行就拆分（拆 hook / 拆组件 / 拆 store module）

### 4.2 命名

- 文件：`kebab-case`（如 `recipe-card.vue`）
- 类/类型/接口：`PascalCase`（如 `MatchResult`）
- 变量/函数：`camelCase`（如 `matchRecipes`）
- 常量：`UPPER_SNAKE_CASE`（如 `COMMON_INGREDIENTS`）

### 4.3 注释

- **默认不加注释**（除非用户明确要求）
- 复杂算法可以加 1-2 行说明 why
- 不写废话注释（"// 获取数据" 这种删掉）

### 4.4 测试

- `tests/` 下用 `npx tsx` 直接跑（项目无 jest/vitest 配置）
- 改业务代码前先看测试用例，避免改坏
- 新功能加 e2e 用例覆盖
- 修 bug 加一个能复现 bug 的回归测试

### 4.5 UI 规范

- **不用 emoji**（用户硬性要求）
- 走 `<uni-icons type="xxx" />` 提供图标
- 装饰用手绘内联 SVG
- 颜色用 `var(--color-*)` 变量，集中在 `src/uni.scss`
- 间距用 rpx，必须是 4 的倍数

---

## 5. 验证门（每次提交前必跑）

```bash
npx tsc --noEmit           # type-check
npx tsx tests/e2e.test.ts  # e2e 测试
npx tsx tests/matcher.test.ts  # matcher 单测
npm run build:mp-weixin    # 微信构建
```

四个都通过才能 commit。

---

## 6. 禁止事项

- ❌ 直接 commit 到 main
- ❌ 用 `git add -A` / `git add .`
- ❌ 改 git config（global / local）
- ❌ 跳过 hook（`--no-verify`）
- ❌ force push（`--force` / `--force-with-lease`）除非用户明确同意
- ❌ amend 失败的 commit（创建新的 fix commit 即可）
- ❌ 把 `.env` / `node_modules` / `dist` / `.uniapp/` 提交
- ❌ 任何 emoji 字符出现在 UI 代码或 commit message
- ❌ Tailwind 类名（除非用户明确引入）
- ❌ 在代码里加用户没要求的注释

---

## 7. 上下文恢复（新会话启动时）

按以下顺序读：

1. `AGENTS.md`（本文件）
2. `.planning/STATE.md`
3. `.planning/ROADMAP.md`
4. 当前 phase 的 `phases/NN-xxx/CONTEXT.md` + `PLAN.md`
5. `git log --oneline -10` 看最近提交
6. `git status` 看未提交改动
7. `git branch --show-current` 确认在 feature 分支

读完这些后再开干。

---

## 8. 联系用户

拿不准的事**直接问**，不要猜：
- 需求模糊 → 用 `question` 工具列出选项
- 多个实现路径 → 列出 2-3 个 trade-off 让用户选
- 涉及破坏性变更（数据迁移、API 改名）→ **必须**先确认

---

**版本**：v1 · 2026-06-02 初始化
**下次更新**：用户提供 commit 信息规范后覆盖 §2
