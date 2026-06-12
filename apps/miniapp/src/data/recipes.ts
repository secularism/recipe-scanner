import type { Recipe } from '@/types'
import { SICHUAN_HUNAN_RECIPES } from './recipes-sichuan'
import { CANTONESE_HOME_RECIPES } from './recipes-home'
import { WESTERN_RECIPES } from './recipes-western'
import { NOURTHERN_SOUP_RECIPES } from './recipes-northeast'

/**
 * 全量菜谱库
 * 单一数据源，所有匹配和生成都从这里读取
 */
export const ALL_RECIPES: Recipe[] = [
  ...SICHUAN_HUNAN_RECIPES,
  ...CANTONESE_HOME_RECIPES,
  ...WESTERN_RECIPES,
  ...NOURTHERN_SOUP_RECIPES
]

/** 按 ID 快速查找 */
const RECIPE_MAP = new Map(ALL_RECIPES.map(r => [r.id, r]))

export function findRecipeById(id: string): Recipe | undefined {
  return RECIPE_MAP.get(id)
}

/** 菜系列表（供 UI 渲染） */
export const CUISINE_LABELS: Record<Recipe['cuisine'], string> = {
  sichuan: '川菜',
  cantonese: '粤菜',
  home: '家常',
  western: '西餐',
  japanese: '日料',
  korean: '韩餐',
  hunan: '湘菜',
  northeast: '东北菜'
}

/** 口味列表 */
export const TASTE_LABELS: Record<string, string> = {
  spicy: '辣',
  light: '清淡',
  sweet: '甜',
  salty: '咸',
  sour: '酸'
}

/** 难度标签 */
export const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: '简单',
  2: '中等',
  3: '进阶'
}
