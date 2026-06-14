import { PrismaClient } from "@prisma/client";
import { ALL_RECIPES } from "../../miniapp/src/data/recipes";

const prisma = new PrismaClient();

function toPlainJson<T>(value: T) {
  return JSON.parse(JSON.stringify(value));
}

function buildRecipePayload(recipe: (typeof ALL_RECIPES)[number]) {
  return {
    legacyId: recipe.id,
    slug: recipe.id,
    title: recipe.name,
    summary: recipe.shortDesc,
    cuisine: recipe.cuisine,
    tastes: recipe.taste,
    tags: recipe.tags ?? [],
    ingredients: toPlainJson(recipe.ingredients),
    seasonings: toPlainJson(recipe.seasonings),
    steps: toPlainJson(recipe.steps),
    status: "PUBLISHED",
    cookMinutes: recipe.cookTime,
    metadata: toPlainJson({
      difficulty: recipe.difficulty,
      source: "miniapp-mock",
    }),
  };
}

async function main() {
  for (const recipe of ALL_RECIPES) {
    const payload = buildRecipePayload(recipe) as any;

    await prisma.recipe.upsert({
      where: { legacyId: recipe.id },
      update: payload,
      create: payload,
    });
  }

  console.log(`Seeded ${ALL_RECIPES.length} recipes.`);
}

main()
  .catch((error) => {
    console.error("Prisma seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
