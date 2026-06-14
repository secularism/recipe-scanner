import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { RecipesService } from "./recipes.service";

@Controller("recipes")
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getRecipes(
    @Query("cuisine") cuisine?: string,
    @Query("take") take?: string,
  ) {
    return this.recipesService.getRecipes({
      cuisine,
      take: take ? Number(take) : undefined,
    });
  }

  @Get(":id")
  async getRecipeById(@Param("id") id: string) {
    const recipe = await this.recipesService.getRecipeById(id);

    if (!recipe) {
      throw new NotFoundException(`Recipe ${id} not found`);
    }

    return recipe;
  }
}
