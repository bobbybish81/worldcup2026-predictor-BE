import prisma from "../config/prisma.js";
import { TOURNAMENT_START } from "../config/tournament.js";

export const submitKnockoutPrediction = async (req, res) => {
  try {
    // GLOBAL TOURNAMENT LOCK
    if (new Date() >= TOURNAMENT_START) {
      return res.status(403).json({
        error: "Predictions are locked. The tournament has started.",
      });
    }

    const { matchKey, round, homeTeamId, awayTeamId, winnerTeamId } = req.body;

    // 🛡️ Validation: winner must be one of the teams
    if (![homeTeamId, awayTeamId].includes(winnerTeamId)) {
      return res.status(400).json({
        error: "Winner must be one of the teams in the match",
      });
    }

    const prediction = await prisma.knockoutPrediction.upsert({
      where: {
        userId_matchKey: {
          userId: req.user.id,
          matchKey,
        },
      },
      update: {
        winnerTeamId,
      },
      create: {
        userId: req.user.id,
        round,
        matchKey,
        homeTeamId,
        awayTeamId,
        winnerTeamId,
      },
    });

    res.json(prediction);
  } catch (err) {
    console.error("KNOCKOUT PREDICTION ERROR:", err);
    res.status(500).json({ error: "Failed to save knockout prediction" });
  }
};

export const getMyKnockoutPredictions = async (req, res) => {
  const { round } = req.params;

  const predictions = await prisma.knockoutPrediction.findMany({
    where: {
      userId: req.user.id,
      round,
    },
  });

  res.json(predictions);
};