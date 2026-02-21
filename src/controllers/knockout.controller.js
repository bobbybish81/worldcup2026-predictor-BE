import prisma from "../config/prisma.js";
import { calculateGroupTable } from "../services/groupCalculator.js";
import { getQualifiedTeams } from "../services/qualificationService.js";
import { generateRoundOf32 } from "../services/roundOf32Service.js";

import { generateRoundOf16, generateQuarterFinals, generateSemiFinals,
  generateFinal,
} from "../services/knockoutProgressionService.js";

export const getMyQualifiedTeams = async (req, res) => {
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

  // Group stage not completed yet
  if (predictions.length === 0) {
    return res.json({
      status: "INCOMPLETE",
      message:
        "Complete all group-stage predictions to unlock the knockout stage.",
      qualifiedTeams: [],
    });
  }

  // Group predictions by group
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

  // Calculate group tables
  const groupTables = {};

  for (const group in groups) {
    groupTables[group] = calculateGroupTable(groups[group]);
  }

  // Determine qualified teams
  const qualified = getQualifiedTeams(groupTables);

  res.json({
    status: "READY",
    qualifiedTeams: qualified,
  });
};

export const getMyRoundOf32 = async (req, res) => {
  try {
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

    if (predictions.length === 0) {
      return res.json({
        status: "INCOMPLETE",
        message: "Complete all group predictions",
        fixtures: [],
      });
    }

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

    const groupTables = {};
    for (const g in groups) {
      groupTables[g] = calculateGroupTable(groups[g]);
    }

    const qualified = getQualifiedTeams(groupTables);

    // must have all 12 winners/runners + 8 thirds
    if (
      qualified.winners.length < 12 ||
      qualified.runnersUp.length < 12 ||
      qualified.bestThird.length < 8
    ) {
      return res.json({
        status: "INCOMPLETE",
        message: "Complete all group predictions to unlock Round of 32",
        fixtures: [],
      });
    }

    const fixtures = generateRoundOf32(groupTables, qualified);

    res.json({
      status: "READY",
      fixtures,
    });
  } catch (err) {
    console.error("ROUND OF 32 ERROR:", err);

    res.status(500).json({
      error: "Failed to generate Round of 32",
    });
  }
};

// Round of 16
export const getMyRoundOf16 = async (req, res) => {
  const r32Predictions = await prisma.knockoutPrediction.findMany({
    where: {
      userId: req.user.id,
      round: "R32",
    },
    include: {
      winnerTeam: true,
    },
    orderBy: {
      matchKey: "asc",
    },
  });

  if (r32Predictions.length < 16) {
    return res.json({
      status: "INCOMPLETE",
      message: "Complete all Round of 32 predictions",
      fixtures: [],
    });
  }

  const fixtures = generateRoundOf16(r32Predictions);

  if (!fixtures.length) {
    return res.json({
      status: "INCOMPLETE",
      message: "Missing winners in Round of 32",
      fixtures: [],
    });
  }

  res.json({
    status: "READY",
    fixtures,
  });
};


// Quarter Finals
export const getMyQuarterFinals = async (req, res) => {
  const r16Predictions = await prisma.knockoutPrediction.findMany({
    where: {
      userId: req.user.id,
      round: "R16",
    },
    include: {
      winnerTeam: true,
    },
    orderBy: {
      matchKey: "asc",
    },
  });

  if (r16Predictions.length < 8) {
    return res.json({
      status: "INCOMPLETE",
      message: "Complete all Round of 16 predictions",
      fixtures: [],
    });
  }

  const fixtures = generateQuarterFinals(r16Predictions);

  if (!fixtures.length) {
    return res.json({
      status: "INCOMPLETE",
      message: "Missing winners in Round of 16",
      fixtures: [],
    });
  }

  res.json({
    status: "READY",
    fixtures,
  });
};

// Semi Finals
export const getMySemiFinals = async (req, res) => {
  const qfPredictions = await prisma.knockoutPrediction.findMany({
    where: {
      userId: req.user.id,
      round: "QF",
    },
    include: { winnerTeam: true },
    orderBy: { matchKey: "asc" },
  });

  if (qfPredictions.length < 4) {
    return res.json({
      status: "INCOMPLETE",
      message: "Complete Quarter Finals to unlock Semi Finals",
      fixtures: [],
    });
  }

  const fixtures = generateSemiFinals(qfPredictions);

  if (!fixtures.length) {
    return res.json({
      status: "INCOMPLETE",
      message: "Missing Quarter Final winners",
      fixtures: [],
    });
  }

  res.json({ status: "READY", fixtures });
};

// Final
export const getMyFinal = async (req, res) => {
  const sfPredictions = await prisma.knockoutPrediction.findMany({
    where: {
      userId: req.user.id,
      round: "SF",
    },
    include: { winnerTeam: true },
    orderBy: { matchKey: "asc" },
  });

  if (sfPredictions.length < 2) {
    return res.json({
      status: "INCOMPLETE",
      message: "Complete Semi Finals to unlock Final",
      fixtures: [],
    });
  }

  const fixtures = generateFinal(sfPredictions);

  if (!fixtures.length) {
    return res.json({
      status: "INCOMPLETE",
      message: "Missing Semi Final winners",
      fixtures: [],
    });
  }

  res.json({ status: "READY", fixtures });
};