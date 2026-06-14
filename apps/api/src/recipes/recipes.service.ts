import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

interface RecipeListQuery {
  cuisine?: string;
  take?: number;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecipes(query: RecipeListQuery) {
    const take = query.take && query.take > 0 ? Math.min(query.take, 100) : 20;

    return this.prisma.recipe.findMany({
      where: query.cuisine ? { cuisine: query.cuisine } : undefined,
      orderBy: [{ createdAt: "desc" }, { title: "asc" }],
      take,
      select: {
        id: true,
        legacyId: true,
        slug: true,
        title: true,
        summary: true,
        cuisine: true,
        tastes: true,
        tags: true,
        cookMinutes: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getRecipeById(id: string) {
    const orConditions = isUuid(id)
      ? [{ id }, { legacyId: id }, { slug: id }]
      : [{ legacyId: id }, { slug: id }];

    return this.prisma.recipe.findFirst({
      where: {
        OR: orConditions,
      },
    });
  }
}
