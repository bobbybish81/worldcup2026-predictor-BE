-- CreateTable
CREATE TABLE "KnockoutPrediction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "round" TEXT NOT NULL,
    "matchKey" TEXT NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "awayTeamId" INTEGER NOT NULL,
    "winnerTeamId" INTEGER,

    CONSTRAINT "KnockoutPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KnockoutPrediction_userId_matchKey_key" ON "KnockoutPrediction"("userId", "matchKey");

-- AddForeignKey
ALTER TABLE "KnockoutPrediction" ADD CONSTRAINT "KnockoutPrediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnockoutPrediction" ADD CONSTRAINT "KnockoutPrediction_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnockoutPrediction" ADD CONSTRAINT "KnockoutPrediction_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KnockoutPrediction" ADD CONSTRAINT "KnockoutPrediction_winnerTeamId_fkey" FOREIGN KEY ("winnerTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
