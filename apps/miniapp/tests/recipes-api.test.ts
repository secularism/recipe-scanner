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
    title: 'Mapo tofu',
    summary: 'A spicy Sichuan dish',
    cuisine: 'sichuan',
    tastes: ['spicy', 'salty'],
    tags: ['quick'],
    cookMinutes: 18,
    difficulty: 2,
    ingredients: ['tofu', 'pork'],
    seasonings: ['doubanjiang', 'peppercorn'],
    steps: [{ order: 1, text: 'Fry the aromatics' }],
    ...overrides
  }
}

function fakeRequest(data: unknown, statusCode = 200): RecipesRequest {
  return (options) => options.success({ statusCode, data })
}

function recordingRequest(data: unknown, urls: string[], statusCode = 200): RecipesRequest {
  return (options) => {
    urls.push(options.url)
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
  'joinApiUrl joins matchFields path',
  joinApiUrl('recipes?include=matchFields') === 'http://47.96.36.31/api/recipes?include=matchFields'
)

console.log('\n== recipe mapper ==')
{
  const recipe = mapRecipeDtoToRecipe(sampleDto())
  assert('slug maps to Recipe.id', recipe.id === 'mapo-tofu', recipe.id)
  assert('title maps to name', recipe.name === 'Mapo tofu')
  assert('summary maps to shortDesc', recipe.shortDesc === 'A spicy Sichuan dish')
  assert('tastes map to taste', recipe.taste.join(',') === 'spicy,salty', recipe.taste.join(','))
  assert('cookMinutes maps to cookTime', recipe.cookTime === 18)
  assert('difficulty keeps valid value', recipe.difficulty === 2)
  assert('steps map successfully', recipe.steps[0]?.text === 'Fry the aromatics')
}

{
  const recipe = mapRecipeDtoToRecipe(sampleDto({ slug: '', legacyId: 'tomato-egg-stir-fry' }))
  assert('legacyId is fallback id', recipe.id === 'tomato-egg-stir-fry', recipe.id)
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
  assert('unknown cuisine defaults to home', recipe.cuisine === 'home', recipe.cuisine)
  assert('invalid tastes are filtered', recipe.taste.join(',') === 'spicy', recipe.taste.join(','))
  assert('invalid difficulty defaults to 2', recipe.difficulty === 2)
  assert('missing cookMinutes defaults to 0', recipe.cookTime === 0)
  assert('missing ingredients default empty', recipe.ingredients.length === 0)
  assert('missing seasonings default empty', recipe.seasonings.length === 0)
  assert('invalid steps default empty', recipe.steps.length === 0)
  assert('missing tags default empty', recipe.tags?.length === 0)
}

try {
  mapRecipeDtoToRecipe(sampleDto({ slug: '', legacyId: '' }))
  assert('missing public id throws', false, 'no error')
} catch (error) {
  assert('missing public id throws', error instanceof RecipeMapperError, error instanceof Error ? error.name : String(error))
}

async function main() {
  console.log('\n== recipes api client ==')
  {
    const client = createRecipesApiClient({
      baseUrl: 'https://example.test/api',
      request: fakeRequest([sampleDto(), sampleDto({ slug: 'tomato-egg-stir-fry', title: 'Tomato egg' })])
    })
    const recipes = await client.fetchMatchReadyRecipes()
    assert('fetchMatchReadyRecipes maps fake 200 array', recipes.length === 2, String(recipes.length))
    assert('fetchMatchReadyRecipes returns mapped Recipe items', recipes[1].name === 'Tomato egg')
  }

  {
    const urls: string[] = []
    const client = createRecipesApiClient({
      baseUrl: 'https://example.test/api',
      request: recordingRequest(sampleDto(), urls)
    })
    const recipe = await client.fetchRecipeById('mapo-tofu')
    assert('fetchRecipeById maps fake 200 object', recipe.id === 'mapo-tofu', recipe.id)
    assert('fetchRecipeById uses public id URL', urls[0] === 'https://example.test/api/recipes/mapo-tofu', urls[0])
  }

  {
    const urls: string[] = []
    const client = createRecipesApiClient({
      baseUrl: 'https://example.test/api',
      request: recordingRequest(sampleDto(), urls)
    })
    await client.fetchRecipeById('spicy/tofu')
    assert('fetchRecipeById URL encodes id', urls[0] === 'https://example.test/api/recipes/spicy%2Ftofu', urls[0])
  }

  await rejectsWith(
    'fetchMatchReadyRecipes fake 500 rejects RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest({ message: 'bad' }, 500) }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchRecipeById fake 404 rejects RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest({ message: 'missing' }, 404) }).fetchRecipeById('missing'),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchRecipeById fake 500 rejects RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest({ message: 'bad' }, 500) }).fetchRecipeById('mapo-tofu'),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchMatchReadyRecipes request failure rejects RecipesApiError',
    () => createRecipesApiClient({
      request: (options) => options.fail(new Error('offline'))
    }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchRecipeById request failure rejects RecipesApiError',
    () => createRecipesApiClient({
      request: (options) => options.fail(new Error('offline'))
    }).fetchRecipeById('mapo-tofu'),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchMatchReadyRecipes non-array rejects RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest({ rows: [] }) }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchRecipeById non-object rejects RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest([sampleDto()]) }).fetchRecipeById('mapo-tofu'),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchMatchReadyRecipes mapper failure rejects RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest([sampleDto({ slug: '', legacyId: '' })]) }).fetchMatchReadyRecipes(),
    'RecipesApiError'
  )

  await rejectsWith(
    'fetchRecipeById mapper failure rejects RecipesApiError',
    () => createRecipesApiClient({ request: fakeRequest(sampleDto({ slug: '', legacyId: '' })) }).fetchRecipeById('mapo-tofu'),
    'RecipesApiError'
  )

  assert('RecipesApiError class remains exported', new RecipesApiError('x').name === 'RecipesApiError')
  console.log(`\n${pass} passed, ${fail} failed\n`)
  process.exit(fail > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
