/**
 * matcher.ts 单元测试 — 直接用 node 跑
 * 验证核心匹配逻辑
 */
import { matchRecipes, generateRecipe } from '../src/services'
import { ALL_RECIPES } from '../src/data'

let pass = 0
let fail = 0

function assert(name: string, cond: boolean, detail?: string) {
  if (cond) {
    pass++
    console.log(`  PASS  ${name}`)
  } else {
    fail++
    console.log(`  FAIL  ${name}${detail ? ' :: ' + detail : ''}`)
  }
}

console.log('\n== matchRecipes ==')

// 1. 完全匹配
let r = matchRecipes(
  { ingredients: ['豆腐', '猪肉'], seasonings: ['豆瓣酱', '花椒', '生抽', '姜', '蒜', '葱', '食用油'] },
  []
)
assert('空菜谱库返回空', r.length === 0)

r = matchRecipes(
  { ingredients: ['豆腐', '猪肉'], seasonings: ['豆瓣酱', '花椒', '生抽', '姜', '蒜', '葱', '食用油'] },
  ALL_RECIPES
)
assert('精确食材+调味料匹配到麻婆豆腐', r.length > 0 && r[0].recipe.id === 'mapo-tofu',
  `got ${r[0]?.recipe.id}`)

// 2. 部分匹配
r = matchRecipes(
  { ingredients: ['豆腐', '猪肉'], seasonings: ['生抽', '食用油'] },
  ALL_RECIPES
)
assert('部分匹配仍能命中（覆盖率>25%）', r.length > 0)

// 3. 空输入
r = matchRecipes({ ingredients: [], seasonings: [] }, ALL_RECIPES)
assert('空输入返回空', r.length === 0)

// 4. 菜系筛选加分
r = matchRecipes(
  {
    ingredients: ['五花肉', '蒜苗', '青椒'],
    seasonings: ['豆瓣酱', '甜面酱', '生抽', '糖', '姜', '蒜', '食用油']
  },
  ALL_RECIPES
)
assert('回锅肉被匹配到', r.some(x => x.recipe.id === 'twice-cooked-pork'))

r = matchRecipes(
  {
    ingredients: ['五花肉', '蒜苗', '青椒'],
    seasonings: ['豆瓣酱', '甜面酱', '生抽', '糖', '姜', '蒜', '食用油'],
    cuisine: 'sichuan'
  },
  ALL_RECIPES
)
assert('指定川菜，回锅肉排名靠前', r.findIndex(x => x.recipe.id === 'twice-cooked-pork') < 3)

// 5. 极低匹配度应被过滤
r = matchRecipes(
  { ingredients: ['米饭'], seasonings: [] },
  ALL_RECIPES
)
assert('极低匹配被过滤', r.every(x => x.coverage >= 25))

// 6. generateRecipe 限制数量
const limited = generateRecipe(
  {
    ingredients: ['豆腐', '猪肉', '鸡肉', '番茄', '鸡蛋', '黄瓜', '土豆', '米饭'],
    seasonings: ['盐', '糖', '生抽', '食用油', '蒜', '姜', '葱', '醋']
  },
  3
)
assert('generateRecipe 限制返回 3 个', limited.length <= 3)

// 7. 大小写不敏感（去 normalize）
r = matchRecipes(
  { ingredients: ['豆腐'], seasonings: ['盐'] },
  ALL_RECIPES
)
assert('中文 + 基础调料能匹配', r.length > 0)

console.log(`\n${pass} passed, ${fail} failed\n`)
process.exit(fail > 0 ? 1 : 0)
