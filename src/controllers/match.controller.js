import prisma from "../config/prisma.js";
import { scoreMatch } from "../services/scoringService.js";

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

    const match = await prisma.match.update({
      where: { id: matchId },
      data: {
        homeScore,
        awayScore
      }
    });

    await scoreMatch(matchId);

    res.json({
      message: "Match result saved and scored"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to enter result"
    });

  }

};