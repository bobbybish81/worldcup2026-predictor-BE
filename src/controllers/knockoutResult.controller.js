import prisma from "../config/prisma.js";

export const enterKnockoutResult = async (req, res) => {
  try {
    const { round, matchKey, actualWinnerTeamId } = req.body;

    // Fetch predictions for this match
    const predictions = await prisma.knockoutPrediction.findMany({
      where: { round, matchKey },
    });

    if (!predictions.length) {
      return res.status(404).json({ error: "No predictions found" });
    }

    // Prevent double scoring
    if (predictions[0].actualWinnerTeamId !== null) {
      return res.status(400).json({
        error: "Result already entered for this match",
      });
    }

    // Update all predictions with actual result
    await prisma.knockoutPrediction.updateMany({
      where: { round, matchKey },
      data: { actualWinnerTeamId },
    });

    // Score predictions
    for (const p of predictions) {
      const points = p.winnerTeamId === actualWinnerTeamId ? 2 : 0;

      if (points > 0) {
        await prisma.points.update({
          where: { userId: p.userId },
          data: {
            knockoutStage: { increment: points },
            total: { increment: points },
          },
        });
      }
    }

    res.json({ message: "Knockout result scored successfully" });
  } catch (err) {
    console.error("KNOCKOUT RESULT ERROR:", err);
    res.status(500).json({ error: "Failed to score knockout result" });
  }
};

