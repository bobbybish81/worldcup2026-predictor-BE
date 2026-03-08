import prisma from "../config/prisma.js";
import { calculateGroupTable } from "../services/groupCalculator.js";
import { getQualifiedTeams } from "../services/qualificationService.js";
import { generateRoundOf32 } from "../services/roundOf32Service.js";
import {
  generateRoundOf16,
  generateQuarterFinals,
  generateSemiFinals,
  generateFinal
} from "../services/knockoutProgressionService.js";


const ROUND_CONFIG = {
  R32: {
    predictionRound: null,
    minPredictions: null
  },
  R16: {
    predictionRound: "R32",
    minPredictions: 16
  },
  QF: {
    predictionRound: "R16",
    minPredictions: 8
  },
  SF: {
    predictionRound: "QF",
    minPredictions: 4
  },
  F: {
    predictionRound: "SF",
    minPredictions: 2
  }
};


export const getKnockoutRound = async (req, res) => {

  try {

    const { round } = req.params;
    const config = ROUND_CONFIG[round];

    if (!config) {
      return res.status(400).json({
        error: "Invalid round"
      });
    }

    // ============================
    // ROUND OF 32 (GROUP STAGE)
    // ============================

    if (round === "R32") {

      const predictions = await prisma.prediction.findMany({
        where: { userId: req.user.id },
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true
            }
          }
        }
      });

      if (predictions.length === 0) {
        return res.json({
          status: "INCOMPLETE",
          message: "Complete group predictions",
          fixtures: []
        });
      }

      const groups = {};

      for (const p of predictions) {

        const group = p.match.homeTeam.group;

        if (!groups[group]) {
          groups[group] = [];
        }

        groups[group].push({
          homeTeam: p.match.homeTeam,
          awayTeam: p.match.awayTeam,
          homeScore: p.homeScore,
          awayScore: p.awayScore
        });
      }

      const groupTables = {};

      for (const g in groups) {
        groupTables[g] = calculateGroupTable(groups[g]);
      }

      const qualified = getQualifiedTeams(groupTables);

      const result = generateRoundOf32(qualified);

      return res.json(result);
    }

    // ============================
    // ALL OTHER ROUNDS
    // ============================

    const predictions = await prisma.knockoutPrediction.findMany({
      where: {
        userId: req.user.id,
        round: config.predictionRound
      },
      include: {
        winnerTeam: true
      },
      orderBy: {
        matchKey: "asc"
      }
    });


    if (predictions.length < config.minPredictions) {

      return res.json({
        status: "INCOMPLETE",
        message: `Complete ${config.predictionRound} predictions`,
        fixtures: []
      });

    }

    let result;

    if (round === "R16") {
      result = generateRoundOf16(predictions);
    }

    if (round === "QF") {
      result = generateQuarterFinals(predictions);
    }

    if (round === "SF") {
      result = generateSemiFinals(predictions);
    }

    if (round === "F") {
      result = generateFinal(predictions);
    }


    return res.json(result);


  } catch (err) {

    console.error("KNOCKOUT ROUND ERROR:", err);

    res.status(500).json({
      error: "Failed to generate round"
    });

  }

};

// ============================
// QUALIFIED TEAMS ENDPOINT
// ============================

export const getMyQualifiedTeams = async (req, res) => {

  const predictions = await prisma.prediction.findMany({
    where: { userId: req.user.id },
    include: {
      match: {
        include: {
          homeTeam: true,
          awayTeam: true
        }
      }
    }
  });

  if (predictions.length === 0) {

    return res.json({
      status: "INCOMPLETE",
      message:
        "Complete all group-stage predictions to unlock the knockout stage.",
      qualifiedTeams: []
    });

  }

  const groups = {};

  for (const p of predictions) {

    const group = p.match.homeTeam.group;

    if (!groups[group]) {
      groups[group] = [];
    }

    groups[group].push({
      homeTeam: p.match.homeTeam,
      awayTeam: p.match.awayTeam,
      homeScore: p.homeScore,
      awayScore: p.awayScore
    });

  }


  const groupTables = {};

  for (const group in groups) {
    groupTables[group] = calculateGroupTable(groups[group]);
  }


  const qualified = getQualifiedTeams(groupTables);


  res.json({
    status: "READY",
    qualifiedTeams: qualified
  });

};
