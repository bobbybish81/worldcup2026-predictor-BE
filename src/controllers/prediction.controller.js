import prisma from "../config/prisma.js";
import { TOURNAMENT_START } from "../config/tournament.js";

export const getMyPredictions = async (req, res) => {
  const predictions = await prisma.prediction.findMany({
    where: { userId: req.user.id },
  });

  res.json(predictions);
};

export const submitPrediction = async (req, res) => {
  try {
    // 🔒 GLOBAL LOCK CHECK
    if (new Date() >= TOURNAMENT_START) {
      return res.status(403).json({
        error: "Predictions are locked. The tournament has started.",
      });
    }

    const { matchId, homeScore, awayScore } = req.body;

    const prediction = await prisma.prediction.upsert({
      where: {
        userId_matchId: {
          userId: req.user.id,
          matchId,
        },
      },
      update: { homeScore, awayScore },
      create: {
        userId: req.user.id,
        matchId,
        homeScore,
        awayScore,
      },
    });

    res.json(prediction);
  } catch (err) {
    console.error("SUBMIT PREDICTION ERROR:", err);
    res.status(500).json({ error: "Failed to submit prediction" });
  }
};