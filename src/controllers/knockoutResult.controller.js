import prisma from "../config/prisma.js";
import { scoreKnockoutMatch } from "../services/scoringService.js";

export const enterKnockoutResult = async (req, res) => {

  try {

    const { round, matchKey, actualWinnerTeamId } = req.body;

    if (!round || !matchKey || !actualWinnerTeamId) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const existing = await prisma.knockoutPrediction.findFirst({
      where: { round, matchKey }
    });

    if (!existing) {
      return res.status(404).json({
        error: "No predictions found for this match"
      });
    }

    if (existing.actualWinnerTeamId !== null) {
      return res.status(400).json({
        error: "Result already entered"
      });
    }

    await prisma.knockoutPrediction.updateMany({
      where: { round, matchKey },
      data: { actualWinnerTeamId }
    });

    await scoreKnockoutMatch(
      round,
      matchKey,
      actualWinnerTeamId
    );

    res.json({
      message: "Knockout result scored successfully"
    });

  } catch (err) {

    console.error("KNOCKOUT RESULT ERROR:", err);

    res.status(500).json({
      error: "Failed to score knockout result"
    });

  }

};