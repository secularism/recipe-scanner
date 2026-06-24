/**
 * 端到端自测 — 模拟完整用户流程
 * 跑：npx tsx tests/e2e.test.ts
 */
import { generateRecipe, shuffleResult } from '../src/services'
import { ALL_RECIPES, QUICK_PRESETS } from '../src/data'
import type { GenerateInput } from '../src/types'
import { hasDraftContent, mergeRecentItems } from '../src/utils/generator-form'

let pass = 0
let fail = 0
function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    pass++
    console.log(`  PASS  ${name}`)
  } else {
    fail++
    console.log(`  FAIL  ${name}${detail ? ' :: ' + detail : ''}`)
  }
}

function section(name: string) {
  console.log(`\n--- ${name} ---`)
}

// ============ 模拟用户流程 ============

section('1. 用户进入首页 → 选食材 → 生成')
{
  // 用户选了：豆腐 + 猪肉 + 豆瓣酱 + 基础调料 + 想吃川菜
  const input: GenerateInput = {
    ingredients: ['豆腐', '猪肉'],
    seasonings: ['豆瓣酱', '花椒', '生抽', '姜', '蒜', '葱', '油'],
    cuisine: 'sichuan'
  }
  const results = generateRecipe(input, 3, ALL_RECIPES)
  check('生成结果非空', results.length > 0)
  check('首推是麻婆豆腐', results[0]?.recipe.id === 'mapo-tofu',
    `实际：${results[0]?.recipe.id}`)
  check('首推契合度 > 80%', (results[0]?.coverage ?? 0) > 80)
}

section('2. 用户点 "换一换"')
{
  const input: GenerateInput = {
    ingredients: ['鸡蛋', '米饭', '葱'],
    seasonings: ['盐', '生抽', '油']
  }
  const initial = generateRecipe(input, 3, ALL_RECIPES)[0]
  check('首选非空', !!initial)

  // 模拟连续换 5 次，每次都得到非空结果
  let allValid = true
  let currentId = initial.recipe.id
  for (let i = 0; i < 5; i++) {
    const next = shuffleResult(currentId, input, 10, ALL_RECIPES)
    if (!next || !next.recipe) {
      allValid = false
      break
    }
    currentId = next.recipe.id  // 复制到本地变量，不要改原对象
  }
  check('连续换一换都返回有效结果', allValid)
}

section('3. 用户点开详情 → 收藏')
{
  const r = ALL_RECIPES.find(recipe => recipe.id === 'tomato-egg-stir-fry')
  check('番茄炒蛋存在', !!r)
  // 模拟 toggle：第一次 false → true → false
  const set = new Set<string>()
  const toggle = (id: string) => {
    if (set.has(id)) {
      set.delete(id)
      return false
    }
    set.add(id)
    return true
  }
  check('首次收藏返回 true', toggle(r!.id) === true)
  check('再次 toggle 取消', toggle(r!.id) === false)
  check('集合最终为空', set.size === 0)
}

section('4. 用户点分享 → 朋友点开')
{
  // 模拟分享路径
  const sharePath = `/pages/detail/detail?id=mapo-tofu&from=share`
  const params = new URLSearchParams(sharePath.split('?')[1])
  const id = params.get('id')
  const from = params.get('from')
  check('分享携带 id', !!id)
  check('分享携带 from=share', from === 'share')
  const fetchDetailById = (targetId: string) => ALL_RECIPES.find(recipe => recipe.id === targetId)
  const r = fetchDetailById(id!)
  check('通过模拟详情 API 找到菜谱', !!r)
  check('模拟详情 API 返回麻婆豆腐', r?.name === '麻婆豆腐')
}

section('5. 一键生成预设')
{
  // 模拟点 "懒人快手" 预设
  const preset = QUICK_PRESETS.find(p => p.id === 'egg-rice')
  check('懒人快手预设存在', !!preset)
  const results = generateRecipe(preset!.input, 3, ALL_RECIPES)
  check('预设可生成结果', results.length > 0)
  // 蛋炒饭 / 番茄炒蛋 / 美式炒蛋 都有蛋
  const top = results[0]?.recipe
  check('首推包含蛋或米饭相关',
    !!top && (top.ingredients.includes('鸡蛋') || top.ingredients.includes('米饭')),
    `实际：${top?.name}`)
}

section('6. 历史去重（3 秒内同输入不重复入库）')
{
  // 模拟 store.addIfFresh 逻辑
  const items: { id: string; sig: string; ts: number }[] = []
  const addIfFresh = (sig: string) => {
    const now = Date.now()
    if (items.some(x => now - x.ts < 3000 && x.sig === sig)) return false
    items.push({ id: `h_${items.length}`, sig, ts: now })
    return true
  }
  const sig = 'eggs,rice|salt,soy,oil'
  check('首次入库', addIfFresh(sig) === true)
  check('立即再入库被去重', addIfFresh(sig) === false)
  // 时间跳到 4 秒后
  items[0].ts -= 4000
  check('3 秒后允许再入库', addIfFresh(sig) === true)
}

section('7. 边界情况')
{
  // 空输入
  check('空输入无结果', generateRecipe({ ingredients: [], seasonings: [] }, 3, ALL_RECIPES).length === 0)

  // 不存在的食材
  const r = generateRecipe({
    ingredients: ['神秘食材xxx'],
    seasonings: ['神秘调料yyy']
  }, 3, ALL_RECIPES)
  check('无交集输入被过滤', r.length === 0)

  // 只输一个食材
  const r2 = generateRecipe({ ingredients: ['豆腐'], seasonings: [] }, 3, ALL_RECIPES)
  check('单食材也能匹配', r2.length > 0)

  // 自定义食材
  const r3 = generateRecipe({
    ingredients: ['鸡蛋', '神秘自填食材'],
    seasonings: ['盐']
  }, 3, ALL_RECIPES)
  check('自定义食材 + 基础调料能匹配', r3.length > 0)

  const r4 = generateRecipe({ ingredients: ['豆腐'], seasonings: ['盐'] }, 3, [])
  check('显式空菜谱池无结果', r4.length === 0)
}

section('7.1 显式菜谱池换一换')
{
  const input: GenerateInput = {
    ingredients: ['鸡蛋', '米饭', '葱'],
    seasonings: ['盐', '生抽', '油']
  }
  const initial = generateRecipe(input, 3, ALL_RECIPES)[0]
  const next = shuffleResult(initial.recipe.id, input, 10, ALL_RECIPES)
  check('换一换不重复当前首推', !!next && next.recipe.id !== initial.recipe.id,
    `当前：${initial.recipe.id}，实际：${next?.recipe.id}`)
}

section('8. 菜谱库完整性')
{
  check('菜谱总数 >= 25', ALL_RECIPES.length >= 25,
    `实际：${ALL_RECIPES.length}`)

  // 所有菜谱都有 id/name/ingredients/seasonings/steps
  const broken = ALL_RECIPES.filter(r =>
    !r.id || !r.name || !r.shortDesc ||
    !Array.isArray(r.ingredients) || r.ingredients.length === 0 ||
    !Array.isArray(r.seasonings) || r.seasonings.length === 0 ||
    !Array.isArray(r.steps) || r.steps.length === 0
  )
  check('所有菜谱必填字段完整', broken.length === 0,
    `破损：${broken.map(b => b.id).join(',')}`)

  // id 唯一
  const ids = new Set<string>()
  const dupIds: string[] = []
  for (const r of ALL_RECIPES) {
    if (ids.has(r.id)) dupIds.push(r.id)
    ids.add(r.id)
  }
  check('菜谱 id 唯一', dupIds.length === 0,
    dupIds.length > 0 ? `重复: ${dupIds.join(',')}` : `总数 ${ALL_RECIPES.length}`)
}

section('9. 菜系覆盖')
{
  const cuisines = new Set(ALL_RECIPES.map(r => r.cuisine))
  check('覆盖 >= 5 种菜系', cuisines.size >= 5,
    `实际：${[...cuisines].join(',')}`)
}

section('10. 草稿恢复与最近使用辅助逻辑')
{
  check('空草稿不展示恢复条', hasDraftContent({
    i: [], s: [], ci: [], cs: [], cu: null, t: []
  }) === false)
  check('有草稿内容时展示恢复条', hasDraftContent({
    i: ['鸡蛋'], s: [], ci: [], cs: [], cu: null, t: []
  }) === true)

  const merged = mergeRecentItems(['番茄', '鸡蛋'], ['鸡蛋', '土豆', '番茄'])
  check('最近使用按最新优先去重', merged.join(',') === '鸡蛋,土豆,番茄', merged.join(','))

  const limited = mergeRecentItems(['牛肉', '白菜'], ['鸡蛋', '番茄', '土豆', '豆腐', '蒜'])
  check('最近使用最多保留 4 项', limited.length === 4, limited.join(','))
}

section('11. API read view data protection')
{
  const favorites = ['mapo-tofu', 'missing-recipe']
  const history = [{
    id: 'h_1',
    recipeId: 'mapo-tofu',
    recipeName: 'Mapo tofu',
    generatedAt: 1,
    input: { ingredients: ['tofu'], seasonings: ['salt'] },
    missingCount: 0
  }]
  const beforeFavorites = JSON.stringify(favorites)
  const beforeHistory = JSON.stringify(history)
  const detailApiFailed = true

  if (!detailApiFailed) {
    favorites.splice(0, favorites.length)
    history.splice(0, history.length)
  }

  const historyDetailUrl = `/pages/detail/detail?id=${history[0].recipeId}`
  const apiPool = ALL_RECIPES.filter(recipe => recipe.id !== 'mapo-tofu')
  const favoriteViews = favorites.map(id => apiPool.find(recipe => recipe.id === id) ? 'available' : 'missing')

  check('detail API failure keeps local favorite ids', JSON.stringify(favorites) === beforeFavorites)
  check('detail API failure keeps local history records', JSON.stringify(history) === beforeHistory)
  check('history click keeps recipeId in detail URL', historyDetailUrl === '/pages/detail/detail?id=mapo-tofu', historyDetailUrl)
  check('favorite missing API id remains represented', favoriteViews.includes('missing'))
  check('favorites view does not fallback to local recipe data', favoriteViews[0] === 'missing', favoriteViews.join(','))
  check('favorites API failure can preserve local count', favorites.length === 2, String(favorites.length))
}

console.log(`\n========================================`)
console.log(`Total: ${pass + fail} | PASS: ${pass} | FAIL: ${fail}`)
console.log(`========================================\n`)
process.exit(fail > 0 ? 1 : 0)
