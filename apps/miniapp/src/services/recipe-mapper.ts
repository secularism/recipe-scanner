import type { Cuisine, Recipe, RecipeStep, Taste } from '../types'

export interface RecipeStepDto {
  order?: unknown
  text?: unknown
}

export interface RecipeFullDto {
  legacyId?: string | null
  slug?: string | null
  title?: unknown
  summary?: unknown
  cuisine?: unknown
  tastes?: unknown
  tags?: unknown
  cookMinutes?: unknown
  difficulty?: unknown
  ingredients?: unknown
  seasonings?: unknown
  steps?: unknown
}

export class RecipeMapperError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RecipeMapperError'
  }
}

const CUISINES: Cuisine[] = [
  'sichuan',
  'cantonese',
  'home',
  'western',
  'japanese',
  'korean',
  'hunan',
  'northeast'
]

const TASTES: Taste[] = ['spicy', 'light', 'sweet', 'salty', 'sour']

export function mapRecipeDtoToRecipe(dto: RecipeFullDto): Recipe {
  const id = normalizePublicId(dto.slug) || normalizePublicId(dto.legacyId)

  if (!id) {
    throw new RecipeMapperError('Recipe DTO missing public id')
  }

  return {
    id,
    name: toText(dto.title),
    shortDesc: toText(dto.summary),
    cuisine: toCuisine(dto.cuisine),
    taste: toTastes(dto.tastes),
    cookTime: toNumber(dto.cookMinutes),
    difficulty: toDifficulty(dto.difficulty),
    ingredients: toStringArray(dto.ingredients),
    seasonings: toStringArray(dto.seasonings),
    steps: toRecipeSteps(dto.steps),
    tags: toStringArray(dto.tags)
  }
}

export function mapRecipeDtosToRecipes(dtos: RecipeFullDto[]): Recipe[] {
  return dtos.map(mapRecipeDtoToRecipe)
}

function normalizePublicId(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim() : ''
}

function toText(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function toCuisine(value: unknown): Cuisine {
  return typeof value === 'string' && CUISINES.includes(value as Cuisine)
    ? value as Cuisine
    : 'home'
}

function toTastes(value: unknown): Taste[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is Taste =>
    typeof item === 'string' && TASTES.includes(item as Taste)
  )
}

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function toDifficulty(value: unknown): 1 | 2 | 3 {
  return value === 1 || value === 2 || value === 3 ? value : 2
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function toRecipeSteps(value: unknown): RecipeStep[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return []
    const step = item as RecipeStepDto
    return typeof step.order === 'number' && typeof step.text === 'string'
      ? [{ order: step.order, text: step.text }]
      : []
  })
}
