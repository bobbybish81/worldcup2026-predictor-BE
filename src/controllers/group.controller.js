import prisma from "../config/prisma.js";
import { calculateGroupTable } from "../services/groupCalculator.js";

export const getMyGroupTables = async (req, res) => {
  const predictions = await prisma.prediction.findMany({
    where: { userId: req.user.id },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  });

  // Group matches by group letter
  const groups = {};

  for (const p of predictions) {
    const group = p.match.homeTeam.group;

    if (!groups[group]) groups[group] = [];

    groups[group].push({
      homeTeam: p.match.homeTeam,
      awayTeam: p.match.awayTeam,
      homeScore: p.homeScore,
      awayScore: p.awayScore,
    });
  }

  const tables = {};

  for (const group in groups) {
    tables[group] = calculateGroupTable(groups[group]);
  }

  res.json(tables);
};
