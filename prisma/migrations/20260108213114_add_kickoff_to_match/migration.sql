/*
  Warnings:

  - Added the required column `kickoff` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "KnockoutPrediction" ADD COLUMN     "actualWinnerTeamId" INTEGER;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "kickoff" TIMESTAMP(3) NOT NULL;
