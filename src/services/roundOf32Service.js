const ROUND_OF_32_MAP = [
  ["A2", "B2"],
  ["E1", "T1"],
  ["F1", "C2"],
  ["C1", "F2"],
  ["I1", "T2"],
  ["E2", "I2"],
  ["A1", "T3"],
  ["L1", "T4"],
  ["D1", "T5"],
  ["G1", "T6"],
  ["K2", "L2"],
  ["H1", "J2"],
  ["B1", "T7"],
  ["J1", "H2"],
  ["K1", "T8"],
  ["D2", "G2"],
];

function formatTeam(team) {
  return {
    teamId: team.id ?? team.teamId,
    teamName: team.name ?? team.teamName,
    group: team.group
  };
}

export function generateRoundOf32(qualified) {

  const lookup = {};

  // group winners
  qualified.winners.forEach((t) => {
    lookup[`${t.group}1`] = formatTeam(t);
  });

  // runners up
  qualified.runnersUp.forEach((t) => {
    lookup[`${t.group}2`] = formatTeam(t);
  });

  // best third place
  qualified.bestThird.forEach((t, i) => {
    lookup[`T${i + 1}`] = formatTeam(t);
  });

  const fixtures = [];

  ROUND_OF_32_MAP.forEach(([homeKey, awayKey], index) => {

    const homeTeam = lookup[homeKey];
    const awayTeam = lookup[awayKey];

    if (!homeTeam || !awayTeam) return;

    fixtures.push({
      round: "R32",
      matchKey: `R32_${index + 1}`,
      homeTeam,
      awayTeam
    });

  });

  return {
    status: "READY",
    fixtures
  };
  
}
