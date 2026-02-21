import prisma from "../config/prisma.js";
import { calculatePoints } from "../services/pointsCalculator.js";

export const getGroupMatches = async (req, res) => {
  const matches = await prisma.match.findMany({
    where: { stage: "GROUP" },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
  });

  res.json(matches);
};

export const enterMatchResult = async (req, res) => {
  try {
    const { matchId, homeScore, awayScore } = req.body;

    // 1️⃣ FETCH the match first
    const match = await prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // 🔒 GUARD: prevent double entry & double scoring
    if (match.homeScore !== null || match.awayScore !== null) {
      return res.status(400).json({
        error: "Result already entered for this match",
      });
    }

    // 2️⃣ SAVE the real result
    await prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore,
        awayScore,
      },
    });

    // 3️⃣ FETCH predictions
    const predictions = await prisma.prediction.findMany({
      where: { matchId },
    });

    // 4️⃣ SCORE predictions
    for (const p of predictions) {
      const points = calculatePoints(
        { homeScore: p.homeScore, awayScore: p.awayScore },
        { homeScore, awayScore }
      );

      await prisma.points.update({
        where: { userId: p.userId },
        data: {
          groupStage: { increment: points },
          total: { increment: points },
        },
      });
    }

    res.json({ message: "Result saved and points calculated" });
  } catch (err) {
    console.error("ENTER RESULT ERROR:", err);
    res.status(500).json({ error: "Failed to enter result" });
  }
};

