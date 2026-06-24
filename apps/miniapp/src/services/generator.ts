import type { MatchResult, GenerateInput, Recipe } from '../types'
import { ALL_RECIPES } from '../data/recipes'
import { matchRecipes } from './matcher'

const DEFAULT_LIMIT = 3

/**
 * 菜谱生成器 — 对外的统一入口
 * 包装 matcher，限制返回数量
 */
export function generateRecipe(
  input: GenerateInput,
  limit: number = DEFAULT_LIMIT,
  recipes: Recipe[] = ALL_RECIPES
): MatchResult[] {
  const results = matchRecipes(input, recipes)
  return results.slice(0, limit)
}

/**
 * 换一换 — 在前 N 个候选里换一个
 * 避免点"换一换"老出同一道
 */
export function shuffleResult(
  currentId: string | null,
  input: GenerateInput,
  poolSize: number = 10,
  recipes: Recipe[] = ALL_RECIPES
): MatchResult | null {
  const candidates = matchRecipes(input, recipes).slice(0, poolSize)
  if (candidates.length === 0) return null
  const filtered = currentId ? candidates.filter(c => c.recipe.id !== currentId) : candidates
  const pool = filtered.length > 0 ? filtered : candidates
  const idx = Math.floor(Math.random() * pool.length)
  return pool[idx]
}
