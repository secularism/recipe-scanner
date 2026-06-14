-- CreateEnum
CREATE TYPE "RecipeStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "RecognitionJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED');

-- CreateEnum
CREATE TYPE "UserAuthProvider" AS ENUM ('LOCAL', 'WECHAT', 'GUEST');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "authProvider" "UserAuthProvider" NOT NULL DEFAULT 'GUEST',
    "externalId" TEXT,
    "deviceKey" TEXT,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" UUID NOT NULL,
    "legacyId" TEXT,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "coverImageUrl" TEXT,
    "cuisine" TEXT,
    "tastes" TEXT[],
    "tags" TEXT[],
    "ingredients" JSONB NOT NULL,
    "seasonings" JSONB NOT NULL,
    "steps" JSONB NOT NULL,
    "status" "RecipeStatus" NOT NULL DEFAULT 'DRAFT',
    "prepMinutes" INTEGER,
    "cookMinutes" INTEGER,
    "servings" INTEGER,
    "nutrition" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "clientKey" TEXT,
    "recipeId" UUID NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenerationHistory" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "clientKey" TEXT,
    "inputIngredients" TEXT[],
    "inputSeasonings" TEXT[],
    "cuisine" TEXT,
    "tastes" TEXT[],
    "matchedRecipeIds" TEXT[],
    "resultSnapshot" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GenerationHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecognitionJob" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "sourceImageUrl" TEXT NOT NULL,
    "sourceImageHash" TEXT,
    "status" "RecognitionJobStatus" NOT NULL DEFAULT 'PENDING',
    "recognizedText" TEXT,
    "recognizedIngredients" TEXT[],
    "rawPayload" JSONB,
    "errorMessage" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecognitionJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_externalId_key" ON "User"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "User_deviceKey_key" ON "User"("deviceKey");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_legacyId_key" ON "Recipe"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_slug_key" ON "Recipe"("slug");

-- CreateIndex
CREATE INDEX "Recipe_legacyId_idx" ON "Recipe"("legacyId");

-- CreateIndex
CREATE INDEX "Recipe_slug_idx" ON "Recipe"("slug");

-- CreateIndex
CREATE INDEX "Recipe_cuisine_idx" ON "Recipe"("cuisine");

-- CreateIndex
CREATE INDEX "Favorite_userId_idx" ON "Favorite"("userId");

-- CreateIndex
CREATE INDEX "Favorite_clientKey_idx" ON "Favorite"("clientKey");

-- CreateIndex
CREATE INDEX "Favorite_recipeId_idx" ON "Favorite"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_recipeId_key" ON "Favorite"("userId", "recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_clientKey_recipeId_key" ON "Favorite"("clientKey", "recipeId");

-- CreateIndex
CREATE INDEX "GenerationHistory_userId_idx" ON "GenerationHistory"("userId");

-- CreateIndex
CREATE INDEX "GenerationHistory_clientKey_idx" ON "GenerationHistory"("clientKey");

-- CreateIndex
CREATE INDEX "GenerationHistory_createdAt_idx" ON "GenerationHistory"("createdAt");

-- CreateIndex
CREATE INDEX "RecognitionJob_userId_idx" ON "RecognitionJob"("userId");

-- CreateIndex
CREATE INDEX "RecognitionJob_status_idx" ON "RecognitionJob"("status");

-- CreateIndex
CREATE INDEX "RecognitionJob_createdAt_idx" ON "RecognitionJob"("createdAt");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GenerationHistory" ADD CONSTRAINT "GenerationHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecognitionJob" ADD CONSTRAINT "RecognitionJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
