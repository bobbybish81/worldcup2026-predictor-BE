export function generateRoundOf16(r32Predictions) {
  const winners = r32Predictions.map((p) => p.winnerTeam);

  if (winners.length < 16) return [];

  const fixtures = [];

  for (let i = 0; i < 16; i += 2) {
    fixtures.push({
      homeTeam: winners[i],
      awayTeam: winners[i + 1],
    });
  }
  return fixtures;
}

export function generateQuarterFinals(r16Predictions) {
  const qfFixtures = [];

  for (let i = 0; i < r16Predictions.length; i += 2) {
    const home = r16Predictions[i].winnerTeam;
    const away = r16Predictions[i + 1].winnerTeam;

    if (!home || !away) return [];

    qfFixtures.push({
      round: "QF",
      matchKey: `QF-${qfFixtures.length + 1}`,
      homeTeam: home,
      awayTeam: away,
    });
  }

  return qfFixtures;
}

export function generateSemiFinals(qfPredictions) {
  if (qfPredictions.length < 4) return [];

  const fixtures = [];

  for (let i = 0; i < 4; i += 2) {
    const home = qfPredictions[i].winnerTeam;
    const away = qfPredictions[i + 1].winnerTeam;

    if (!home || !away) return [];

    fixtures.push({
      round: "SF",
      matchKey: `SF-${fixtures.length + 1}`,
      homeTeam: home,
      awayTeam: away,
    });
  }

  return fixtures;
}

export function generateFinal(sfPredictions) {
  if (sfPredictions.length < 2) return [];

  const home = sfPredictions[0].winnerTeam;
  const away = sfPredictions[1].winnerTeam;

  if (!home || !away) return [];

  return [
    {
      round: "FINAL",
      matchKey: "FINAL-1",
      homeTeam: home,
      awayTeam: away,
    },
  ];
}

