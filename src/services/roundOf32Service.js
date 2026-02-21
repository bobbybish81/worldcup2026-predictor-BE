// deterministic mapping
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

export function generateRoundOf32(groupTables, qualified) {
  const lookup = {};

  // winners
  qualified.winners.forEach((t) => {
    lookup[`${t.group}1`] = t;
  });

  // runners up
  qualified.runnersUp.forEach((t) => {
    lookup[`${t.group}2`] = t;
  });

  // best third-place teams
  qualified.bestThird.forEach((t, i) => {
    lookup[`T${i + 1}`] = t;
  });

  const fixtures = [];

  for (const [homeKey, awayKey] of ROUND_OF_32_MAP) {
    const homeTeam = lookup[homeKey];
    const awayTeam = lookup[awayKey];

    if (!homeTeam || !awayTeam) continue;

    fixtures.push({
      homeTeam,
      awayTeam,
    });
  }

  return fixtures;
}
