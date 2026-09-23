-- CreateTable
CREATE TABLE "ApiCache" (
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiCache_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "CardCache" (
    "tcgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "setId" TEXT,
    "setName" TEXT,
    "number" TEXT,
    "rarity" TEXT,
    "imageSmall" TEXT,
    "imageLarge" TEXT,
    "payload" JSONB NOT NULL,
    "tcgMarketUsdCents" INTEGER,
    "cmTrendEurCents" INTEGER,
    "priceUpdatedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardCache_pkey" PRIMARY KEY ("tcgId")
);

-- CreateTable
CREATE TABLE "FxRate" (
    "id" TEXT NOT NULL,
    "base" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "asOfDate" DATE NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FxRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiCache_expiresAt_idx" ON "ApiCache"("expiresAt");

-- CreateIndex
CREATE INDEX "CardCache_setId_idx" ON "CardCache"("setId");

-- CreateIndex
CREATE INDEX "CardCache_expiresAt_idx" ON "CardCache"("expiresAt");

-- CreateIndex
CREATE INDEX "FxRate_base_quote_idx" ON "FxRate"("base", "quote");

-- CreateIndex
CREATE UNIQUE INDEX "FxRate_base_quote_asOfDate_key" ON "FxRate"("base", "quote", "asOfDate");

-- CreateIndex
CREATE INDEX "VaultCard_userId_tcgId_idx" ON "VaultCard"("userId", "tcgId");
