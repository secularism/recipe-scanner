import * as assert from "node:assert/strict";
import { BadRequestException } from "@nestjs/common";
import type { RecipeFullDto } from "../src/recipes/recipes.dto";
import { RecipesService } from "../src/recipes/recipes.service";

type PrismaCall = {
  method: "findMany" | "findFirst";
  args: any;
};

function createService(recipe = buildRecipe()) {
  const calls: PrismaCall[] = [];
  const prisma = {
    recipe: {
      findMany: async (args: any) => {
        calls.push({ method: "findMany", args });
        return [recipe];
      },
      findFirst: async (args: any) => {
        calls.push({ method: "findFirst", args });
        return recipe;
      },
    },
  };

  return {
    calls,
    service: new RecipesService(prisma as any),
  };
}

function buildRecipe(overrides: Record<string, unknown> = {}) {
  return {
    legacyId: "mapo-tofu",
    slug: "mapo-tofu",
    title: "Mapo Tofu",
    summary: "Classic tofu dish",
    cuisine: "sichuan",
    tastes: ["spicy"],
    tags: ["quick"],
    cookMinutes: 20,
    ingredients: ["tofu", "pork"],
    seasonings: ["doubanjiang"],
    steps: [{ order: 1, text: "Cook tofu" }],
    metadata: { difficulty: 3 },
    ...overrides,
  };
}

async function testPlainListContract() {
  const { service, calls } = createService();
  const result = await service.getRecipes({ take: 500 });
  const call = calls[0];

  assert.equal(call.method, "findMany");
  assert.equal(call.args.take, 100);
  assert.equal(call.args.where.status, "PUBLISHED");
  assert.equal(call.args.select.ingredients, undefined);
  assert.equal(call.args.select.seasonings, undefined);
  assert.equal(call.args.select.steps, undefined);
  assert.equal(call.args.select.metadata, undefined);
  assert.equal("id" in result[0], false);
  assert.equal("status" in result[0], false);
  assert.equal("metadata" in result[0], false);
}

async function testMatchFieldsContract() {
  const { service, calls } = createService(
    buildRecipe({
      summary: null,
      cookMinutes: null,
      ingredients: null,
      seasonings: null,
      steps: null,
      metadata: null,
    }),
  );
  const result = (await service.getRecipes({
    include: "matchFields",
  })) as RecipeFullDto[];
  const call = calls[0];

  assert.equal(call.method, "findMany");
  assert.equal("take" in call.args, false);
  assert.equal(call.args.where.status, "PUBLISHED");
  assert.equal(call.args.select.ingredients, true);
  assert.equal(call.args.select.seasonings, true);
  assert.equal(call.args.select.steps, true);
  assert.equal(call.args.select.metadata, true);
  assert.equal(result[0].summary, "");
  assert.equal(result[0].cookMinutes, 0);
  assert.equal(result[0].difficulty, 2);
  assert.deepEqual(result[0].ingredients, []);
  assert.deepEqual(result[0].seasonings, []);
  assert.deepEqual(result[0].steps, []);
  assert.equal("id" in result[0], false);
  assert.equal("status" in result[0], false);
  assert.equal("metadata" in result[0], false);
}

async function testDetailLookupContract() {
  const { service, calls } = createService();
  const result = await service.getRecipeById("mapo-tofu");
  const call = calls[0];

  assert.equal(call.method, "findFirst");
  assert.equal(call.args.where.status, "PUBLISHED");
  assert.deepEqual(call.args.where.OR, [
    { legacyId: "mapo-tofu" },
    { slug: "mapo-tofu" },
  ]);
  assert.equal(result?.slug, "mapo-tofu");
  assert.equal(result?.difficulty, 3);
}

async function testUnsupportedIncludeRejected() {
  const { service } = createService();

  await assert.rejects(
    () => service.getRecipes({ include: "unknown" }),
    BadRequestException,
  );
}

async function run() {
  await testPlainListContract();
  await testMatchFieldsContract();
  await testDetailLookupContract();
  await testUnsupportedIncludeRejected();
  console.log("recipes contract tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
