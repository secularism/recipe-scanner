import { BadRequestException, Injectable } from "@nestjs/common";
import { RecipeStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import {
  serializeRecipeFull,
  serializeRecipeListItem,
} from "./recipes.dto";

export interface RecipeListQuery {
  cuisine?: string;
  include?: string;
  take?: number;
}

const LIGHTWEIGHT_RECIPE_SELECT = {
  legacyId: true,
  slug: true,
  title: true,
  summary: true,
  cuisine: true,
  tastes: true,
  tags: true,
  cookMinutes: true,
} as const;

const FULL_RECIPE_SELECT = {
  ...LIGHTWEIGHT_RECIPE_SELECT,
  ingredients: true,
  seasonings: true,
  steps: true,
  metadata: true,
} as const;

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(query: RecipeListQuery) {
    const include = parseInclude(query.include);
    const take = getTake(query.take, include.matchFields ? undefined : 20);
    const where = {
      status: RecipeStatus.PUBLISHED,
      ...(query.cuisine ? { cuisine: query.cuisine } : {}),
    };

    if (include.matchFields) {
      const recipes = await this.prisma.recipe.findMany({
        where,
        orderBy: [{ createdAt: "desc" }, { title: "asc" }],
        ...(take ? { take } : {}),
        select: FULL_RECIPE_SELECT,
      });

      return recipes.map(serializeRecipeFull);
    }

    const recipes = await this.prisma.recipe.findMany({
      where,
      orderBy: [{ createdAt: "desc" }, { title: "asc" }],
      take,
      select: LIGHTWEIGHT_RECIPE_SELECT,
    });

    return recipes.map(serializeRecipeListItem);
  }

  async getRecipeById(id: string) {
    const orConditions = isUuid(id)
      ? [{ id }, { legacyId: id }, { slug: id }]
      : [{ legacyId: id }, { slug: id }];

    const recipe = await this.prisma.recipe.findFirst({
      where: {
        status: RecipeStatus.PUBLISHED,
        OR: orConditions,
      },
      select: FULL_RECIPE_SELECT,
    });

    return recipe ? serializeRecipeFull(recipe) : null;
  }
}

function parseInclude(include?: string) {
  const tokens = (include ?? "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
  const unsupported = tokens.filter((token) => token !== "matchFields");

  if (unsupported.length > 0) {
    throw new BadRequestException(
      `Unsupported recipe include: ${unsupported.join(",")}`,
    );
  }

  return {
    matchFields: tokens.includes("matchFields"),
  };
}

function getTake(take: number | undefined, defaultTake: number | undefined) {
  if (typeof take === "number" && Number.isFinite(take) && take > 0) {
    return Math.min(take, 100);
  }

  return defaultTake;
}
