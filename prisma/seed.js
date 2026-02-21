import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedTeams() {

  const teams = [
    // Group A
    { name: "Mexico", group: "A" },
    { name: "South Africa", group: "A" },
    { name: "Korea Republic", group: "A" },
    { name: "DEN/MKD/CZE/IRL", group: "A" },

    // Group B
    { name: "Canada", group: "B" },
    { name: "ITA/NIR/WAL/BIH", group: "B" },
    { name: "Qatar", group: "B" },
    { name: "Switzerland", group: "B" },

    // Group C
    { name: "Brazil", group: "C" },
    { name: "Morocco", group: "C" },
    { name: "Haiti", group: "C" },
    { name: "Scotland", group: "C" },

    // Group D
    { name: "USA", group: "D" },
    { name: "Paraguay", group: "D" },
    { name: "Australia", group: "D" },
    { name: "TUR/ROU/SVK/KOS", group: "D" },

    // Group E
    { name: "Germany", group: "E" },
    { name: "Curaçao", group: "E" },
    { name: "Côte d'Ivoire", group: "E" },
    { name: "Ecuador", group: "E" },

    // Group F
    { name: "Netherlands", group: "F" },
    { name: "Japan", group: "F" },
    { name: "UKR/SWE/POL/ALB", group: "F" },
    { name: "Tunisia", group: "F" },

    // Group G
    { name: "Belgium", group: "G" },
    { name: "Egypt", group: "G" },
    { name: "Iran", group: "G" },
    { name: "New Zealand", group: "G" },

    // Group H
    { name: "Spain", group: "H" },
    { name: "Cabo Verde", group: "H" },
    { name: "Saudi Arabia", group: "H" },
    { name: "Uruguay", group: "H" },

    // Group I
    { name: "France", group: "I" },
    { name: "Senegal", group: "I" },
    { name: "BOL/SUR/IRQ", group: "I" },
    { name: "Norway", group: "I" },

    // Group J
    { name: "Argentina", group: "J" },
    { name: "Algeria", group: "J" },
    { name: "Austria", group: "J" },
    { name: "Jordan", group: "J" },

    // Group K
    { name: "Portugal", group: "K" },
    { name: "NCL/JAM/COD", group: "K" },
    { name: "Uzbekistan", group: "K" },
    { name: "Colombia", group: "K" },

    // Group L
    { name: "England", group: "L" },
    { name: "Croatia", group: "L" },
    { name: "Ghana", group: "L" },
    { name: "Panama", group: "L" },
  ];

   for (const team of teams) {
    await prisma.team.create({ data: team });
  }
}

async function seedMatches() {
  const baseKickoff = new Date("2026-06-11T18:00:00Z");

  // Find all unique groups
  const groups = await prisma.team.findMany({
    distinct: ["group"],
    select: { group: true },
    orderBy: { group: "asc" },
  });

  let globalDayOffset = 0;

  for (const g of groups) {
    const teams = await prisma.team.findMany({
      where: { group: g.group },
      orderBy: { id: "asc" },
    });

    if (teams.length !== 4) {
      throw new Error(`Group ${g.group} must have exactly 4 teams`);
    }

    const [t1, t2, t3, t4] = teams;

    const matches = [
      { homeTeamId: t1.id, awayTeamId: t2.id, dayOffset: 0 },
      { homeTeamId: t3.id, awayTeamId: t4.id, dayOffset: 0 },

      { homeTeamId: t1.id, awayTeamId: t3.id, dayOffset: 4 },
      { homeTeamId: t2.id, awayTeamId: t4.id, dayOffset: 4 },

      { homeTeamId: t1.id, awayTeamId: t4.id, dayOffset: 8 },
      { homeTeamId: t2.id, awayTeamId: t3.id, dayOffset: 8 },
    ];

    for (const match of matches) {
      await prisma.match.create({
        data: {
          homeTeamId: match.homeTeamId,
          awayTeamId: match.awayTeamId,
          stage: "GROUP",
          kickoff: new Date(
            baseKickoff.getTime() +
              (globalDayOffset + match.dayOffset) *
                24 *
                60 *
                60 *
                1000
          ),
        },
      });
    }

    // Move next group a little later in calendar
    globalDayOffset += 1;
  }
}


async function main() {
  await seedTeams();
  await seedMatches();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });