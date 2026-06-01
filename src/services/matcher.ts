import type { MatchResult, GenerateInput, Recipe } from '@/types'

const INGREDIENT_WEIGHT = 0.7
const SEASONING_WEIGHT = 0.3
const CUISINE_BONUS = 5
const TASTE_BONUS_PER_MATCH = 3
const MIN_COVERAGE_THRESHOLD = 0.25

/**
 * 菜谱匹配 — 找出契合度最高的几道菜
 * 评分规则：
 *   score = 食材覆盖率 * 70 + 调味料覆盖率 * 30 + 菜系加分 + 口味加分
 * 覆盖率 < 25% 的菜谱直接过滤（避免无意义推荐）
 */
export function matchRecipes(input: GenerateInput, recipes: Recipe[]): MatchResult[] {
  const userIngredients = normalizeList(input.ingredients)
  const userSeasonings = normalizeList(input.seasonings)

  if (userIngredients.size === 0 && userSeasonings.size === 0) {
    return []
  }

  const results: MatchResult[] = []

  for (const recipe of recipes) {
    const recipeIngredients = recipe.ingredients.map(normalize)
    const recipeSeasonings = recipe.seasonings.map(normalize)

    const matchedIngredients = recipeIngredients.filter(r => userIngredients.has(r))
    const missingIngredients = recipe.ingredients.filter(r => !userIngredients.has(normalize(r)))

    const matchedSeasonings = recipeSeasonings.filter(r => userSeasonings.has(r))
    const missingSeasonings = recipe.seasonings.filter(r => !userSeasonings.has(normalize(r)))

    const ingredientCoverage = recipeIngredients.length === 0
      ? 0
      : matchedIngredients.length / recipeIngredients.length
    const seasoningCoverage = recipeSeasonings.length === 0
      ? 0
      : matchedSeasonings.length / recipeSeasonings.length

    const coverage = ingredientCoverage * INGREDIENT_WEIGHT + seasoningCoverage * SEASONING_WEIGHT

    if (coverage < MIN_COVERAGE_THRESHOLD) {
      continue
    }

    let score = coverage * 100

    if (input.cuisine && recipe.cuisine === input.cuisine) {
      score += CUISINE_BONUS
    }

    if (input.tastes && input.tastes.length > 0) {
      const matchedTastes = input.tastes.filter(t => recipe.taste.includes(t))
      score += matchedTastes.length * TASTE_BONUS_PER_MATCH
    }

    results.push({
      recipe,
      score: Math.round(score * 10) / 10,
      missingIngredients,
      missingSeasonings,
      coverage: Math.round(coverage * 100)
    })
  }

  results.sort((a, b) => b.score - a.score)
  return results
}

function normalize(name: string): string {
  return name.trim().toLowerCase()
}

function normalizeList(list: string[]): Set<string> {
  return new Set(list.map(normalize))
}
