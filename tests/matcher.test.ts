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
    console.log(`  ✓ ${name}`)
  } else {
    fail++
    console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`)
  }
}

console.log('\n== matchRecipes ==')

// 1. 完全匹配
let r = matchRecipes(
  { ingredients: ['tofu', 'pork'], seasonings: ['bean-paste', 'sichuan-pepper', 'soy-sauce', 'ginger', 'garlic', 'scallion', 'oil'] },
  []
)
assert('空菜谱库返回空', r.length === 0)

r = matchRecipes(
  { ingredients: ['tofu', 'pork'], seasonings: ['bean-paste', 'sichuan-pepper', 'soy-sauce', 'ginger', 'garlic', 'scallion', 'oil'] },
  ALL_RECIPES
)
assert('精确食材+调味料匹配到麻婆豆腐', r.length > 0 && r[0].recipe.id === 'mapo-tofu', `got ${r[0]?.recipe.id}`)

// 2. 部分匹配
r = matchRecipes(
  { ingredients: ['tofu', 'pork'], seasonings: ['soy-sauce', 'oil'] },
  ALL_RECIPES
)
assert('部分匹配仍能命中（覆盖率>25%）', r.length > 0)

// 3. 空输入
r = matchRecipes({ ingredients: [], seasonings: [] }, ALL_RECIPES)
assert('空输入返回空', r.length === 0)

// 4. 菜系筛选加分
r = matchRecipes(
  {
    ingredients: ['pork-belly', 'garlic-sprout', 'pepper'],
    seasonings: ['bean-paste', 'sweet-bean', 'soy-sauce', 'sugar', 'ginger', 'garlic', 'oil']
  },
  ALL_RECIPES
)
assert('回锅肉被匹配到', r.some(x => x.recipe.id === 'twice-cooked-pork'))

r = matchRecipes(
  {
    ingredients: ['pork-belly', 'garlic-sprout', 'pepper'],
    seasonings: ['bean-paste', 'sweet-bean', 'soy-sauce', 'sugar', 'ginger', 'garlic', 'oil'],
    cuisine: 'sichuan'
  },
  ALL_RECIPES
)
assert('指定川菜，回锅肉排名靠前', r.findIndex(x => x.recipe.id === 'twice-cooked-pork') < 3)

// 5. 极低匹配度应被过滤
r = matchRecipes(
  { ingredients: ['rice'], seasonings: [] },
  ALL_RECIPES
)
assert('极低匹配被过滤', r.every(x => x.coverage >= 25))

// 6. generateRecipe 限制数量
const limited = generateRecipe(
  {
    ingredients: ['tofu', 'pork', 'chicken', 'tomato', 'egg', 'cucumber', 'potato', 'rice'],
    seasonings: ['salt', 'sugar', 'soy-sauce', 'oil', 'garlic', 'ginger', 'scallion', 'vinegar']
  },
  3
)
assert('generateRecipe 限制返回 3 个', limited.length <= 3)

console.log(`\n${pass} passed, ${fail} failed\n`)
process.exit(fail > 0 ? 1 : 0)
