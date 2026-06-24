import {
  RecipesApiError,
  RecipeMapperError,
  createRecipesApiClient,
  mapRecipeDtoToRecipe,
  type RecipeFullDto,
  type RecipesRequest
} from '../src/services'
import { joinApiUrl } from '../src/config/api'

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

function sampleDto(overrides: Partial<RecipeFullDto> = {}): RecipeFullDto {
  return {
    legacyId: 'legacy-mapo-tofu',
    slug: 'mapo-tofu',
    title: '麻婆豆腐',
    summary: '下饭川菜',
    cuisine: 'sichuan',
    tastes: ['spicy', 'salty'],
    tags: ['快手'],
    cookMinutes: 18,
    difficulty: 2,
    ingredients: ['豆腐', '猪肉'],
    seasonings: ['豆瓣酱', '花椒'],
    steps: [{ order: 1, text: '炒香调料' }],
    ...overrides
  }
}

function fakeRequest(data: unknown, statusCode = 200): RecipesRequest {
  return (options) => {
    options.success({ statusCode, data })
  }
}

async function rejectsWith(name: string, run: () => Promise<unknown>, errorName: string) {
  try {
    await run()
    assert(name, false, 'resolved')
  } catch (error) {
    assert(name, error instanceof Error && error.name === errorName,
      error instanceof Error ? error.name : String(error))
  }
}

console.log('\n== recipes api config ==')
assert(
  'joinApiUrl 拼接 matchFields 地址',
  joinApiUrl('recipes?include=matchFields') === 'http://47.96.36.31/api/recipes?include=matchFields'
)

console.log('\n== recipe mapper ==')
{
  const recipe = mapRecipeDtoToRecipe(sampleDto())
  assert('slug 映射为 Recipe.id', recipe.id === 'mapo-tofu', recipe.id)
  assert('title 映射为 name', recipe.name === '麻婆豆腐')
  assert('summary 映射为 shortDesc', recipe.shortDesc === '下饭川菜')
  assert('tastes 映射为 taste', recipe.taste.join(',') === 'spicy,salty', recipe.taste.join(','))
  assert('cookMinutes 映射为 cookTime', recipe.cookTime === 18)
  assert('difficulty 保留合法值', recipe.difficulty === 2)
  assert('steps 映射成功', recipe.steps[0]?.text === '炒香调料')
}

{
  const recipe = mapRecipeDtoToRecipe(sampleDto({ slug: '', legacyId: 'tomato-egg-stir-fry' }))
  assert('legacyId 作为 fallback id', recipe.id === 'tomato-egg-stir-fry', recipe.id)
}

{
  const recipe = mapRecipeDtoToRecipe(sampleDto({
    slug: 'defaults',
    cuisine: 'unknown',
    tastes: ['spicy', 'bad'],
    tags: undefined,
    cookMinutes: undefined,
    difficulty: 99,
    ingredients: undefined,
    seasonings: undefined,
    steps: [{ order: 'bad', text: 'skip' }]
  }))
  assert('未知菜系默认 home', recipe.cuisine === 'home', recipe.cuisine)
  assert('非法口味被过滤', recipe.taste.join(',') === 'spicy', recipe.taste.join(','))
  assert('非法 difficulty 默认 2', recipe.difficulty === 2)
  assert('缺失 cookMinutes 默认 0', recipe.cookTime === 0)
  assert('缺失 ingredients 默认空数组', recipe.ingredients.length === 0)
  assert('缺失 seasonings 默认空数组', recipe.seasonings.length === 0)
  assert('非法 steps 默认空数组', recipe.steps.length === 0)
  assert('缺失 tags 默认空数组', recipe.tags?.length === 0)
}

try {
  mapRecipeDtoToRecipe(sampleDto({ slug: '', legacyId: '' }))
  assert('缺失 public id 抛错', false, 'no error')
} catch (error) {
  assert('缺失 public id 抛错', error instanceof RecipeMapperError, error instanceof Error ? error.name : String(error))
}

async function main() {
  console.log('\n== recipes api client ==')
  {
    const client = createRecipesApiClient({
      baseUrl: 'https://example.test/api',
      request: fakeRequest([sampleDto(), sampleDto({ slug: 'tomato-egg-stir-fry', title: '番茄炒蛋' })])
    })
    const recipes = await client.fetchMatchReadyRecipes()
    assert('fake 200 响应映射两个菜谱', recipes.length === 2, String(recipes.length))
    assert('client 使用映射后的 Recipe', recipes[1].name === '番茄炒蛋')
  }

  await rejectsWith(
    'fake 500 响应抛 RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest({ message: 'bad' }, 500) }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  await rejectsWith(
    'fake request failure 抛 RecipesApiError',
    () => createRecipesApiClient({
      request: (options) => options.fail(new Error('offline'))
    }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  await rejectsWith(
    'fake 非数组响应抛 RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest({ rows: [] }) }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  await rejectsWith(
    'mapper failure 被包装为 RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest([sampleDto({ slug: '', legacyId: '' })]) }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  console.log(`\n${pass} passed, ${fail} failed\n`)
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
