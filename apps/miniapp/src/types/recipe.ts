export type Cuisine =
  | 'sichuan' | 'cantonese' | 'home' | 'western' | 'japanese' | 'korean' | 'hunan' | 'northeast'

export type Taste = 'spicy' | 'light' | 'sweet' | 'salty' | 'sour'

export interface Ingredient {
  id: string
  name: string
  category: 'meat' | 'veg' | 'seafood' | 'staple' | 'dairy' | 'other'
}

export interface Seasoning {
  id: string
  name: string
  type: 'basic' | 'sauce' | 'spice' | 'oil'
}

export interface RecipeStep {
  order: number
  text: string
}

export interface Recipe {
  id: string
  name: string
  shortDesc: string
  cuisine: Cuisine
  taste: Taste[]
  cookTime: number
  difficulty: 1 | 2 | 3
  ingredients: string[]
  seasonings: string[]
  steps: RecipeStep[]
  tags?: string[]
}

export interface MatchResult {
  recipe: Recipe
  score: number
  missingIngredients: string[]
  missingSeasonings: string[]
  coverage: number
}

export interface GenerateInput {
  ingredients: string[]
  seasonings: string[]
  cuisine?: Cuisine | null
  tastes?: Taste[]
}

export interface HistoryItem {
  id: string
  recipeId: string
  recipeName: string
  generatedAt: number
  input: GenerateInput
  missingCount?: number
}
