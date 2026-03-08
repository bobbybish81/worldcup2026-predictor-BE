import prisma from "../config/prisma.js";

export const getLeaderboard = async (req, res) => {
  const leaderboard = await prisma.points.findMany({
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: [
      { total: "desc" },
      { groupStage: "desc" },
    ],
  });

  const response = leaderboard.map((entry, index) => ({
    rank: index + 1,
    username: entry.user.username,
    groupStage: entry.groupStage,
    knockoutStage: entry.knockoutStage,
    total: entry.total,
  }));

  res.json(response);
};

