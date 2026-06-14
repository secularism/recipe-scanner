import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { RecipesModule } from "./recipes/recipes.module";

@Module({
  imports: [PrismaModule, HealthModule, RecipesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
