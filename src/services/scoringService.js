import prisma from "../config/prisma.js";
import {
  calculateGroupPoints,
  calculateKnockoutPoints
} from "./pointsCalculator.js";


// GROUP STAGE
export const scoreMatch = async (matchId) => {

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  const predictions = await prisma.prediction.findMany({
    where: { matchId }
  });

  for (const p of predictions) {

    const points = calculateGroupPoints(
      { homeScore: p.homeScore, awayScore: p.awayScore },
      { homeScore: match.homeScore, awayScore: match.awayScore }
    );

    if (points === 0) continue;

    await prisma.points.upsert({
      where: { userId: p.userId },
      update: {
        groupStage: { increment: points },
        total: { increment: points }
      },
      create: {
        userId: p.userId,
        groupStage: points,
        knockoutStage: 0,
        total: points
      }
    });

  }

};



// KNOCKOUT
export const scoreKnockoutMatch = async (
  round,
  matchKey,
  actualWinnerTeamId
) => {

  const predictions = await prisma.knockoutPrediction.findMany({
    where: { round, matchKey }
  });

  const pointsValue = calculateKnockoutPoints(round);

  for (const p of predictions) {

    if (p.winnerTeamId !== actualWinnerTeamId) continue;

    await prisma.points.upsert({
      where: { userId: p.userId },
      update: {
        knockoutStage: { increment: pointsValue },
        total: { increment: pointsValue }
      },
      create: {
        userId: p.userId,
        groupStage: 0,
        knockoutStage: pointsValue,
        total: pointsValue
      }
    });

  }
  
};
