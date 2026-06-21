import type { Prisma } from "@prisma/client";

export interface RecipeListItemDto {
  legacyId: string | null;
  slug: string | null;
  title: string;
  summary: string;
  cuisine: string | null;
  tastes: string[];
  tags: string[];
  cookMinutes: number;
}

export interface RecipeStepDto {
  order: number;
  text: string;
}

export interface RecipeFullDto extends RecipeListItemDto {
  difficulty: 1 | 2 | 3;
  ingredients: string[];
  seasonings: string[];
  steps: RecipeStepDto[];
}

export interface RecipeListSource {
  legacyId: string | null;
  slug: string | null;
  title: string;
  summary: string | null;
  cuisine: string | null;
  tastes: string[];
  tags: string[];
  cookMinutes: number | null;
}

export interface RecipeFullSource extends RecipeListSource {
  ingredients: Prisma.JsonValue;
  seasonings: Prisma.JsonValue;
  steps: Prisma.JsonValue;
  metadata: Prisma.JsonValue | null;
}

export function serializeRecipeListItem(
  recipe: RecipeListSource,
): RecipeListItemDto {
  return {
    legacyId: recipe.legacyId,
    slug: recipe.slug,
    title: recipe.title,
    summary: recipe.summary ?? "",
    cuisine: recipe.cuisine,
    tastes: recipe.tastes ?? [],
    tags: recipe.tags ?? [],
    cookMinutes: recipe.cookMinutes ?? 0,
  };
}

export function serializeRecipeFull(recipe: RecipeFullSource): RecipeFullDto {
  return {
    ...serializeRecipeListItem(recipe),
    difficulty: normalizeDifficulty(recipe.metadata),
    ingredients: toStringArray(recipe.ingredients),
    seasonings: toStringArray(recipe.seasonings),
    steps: toRecipeSteps(recipe.steps),
  };
}

function normalizeDifficulty(metadata: Prisma.JsonValue | null): 1 | 2 | 3 {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const value = (metadata as Record<string, unknown>).difficulty;

    if (value === 1 || value === 2 || value === 3) {
      return value;
    }
  }

  return 2;
}

function toStringArray(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function toRecipeSteps(value: Prisma.JsonValue): RecipeStepDto[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return [];
    }

    const step = item as Record<string, unknown>;

    if (typeof step.order !== "number" || typeof step.text !== "string") {
      return [];
    }

    return [{ order: step.order, text: step.text }];
  });
}
