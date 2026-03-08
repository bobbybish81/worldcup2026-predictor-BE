  function formatTeam(team) {
    return {
      teamId: team.id ?? team.teamId,
      teamName: team.name ?? team.teamName,
      group: team.group
    };
  }

export function generateRoundOf16(r32Predictions) {

  const winners = r32Predictions.map((p) => formatTeam(p.winnerTeam));

  if (winners.length < 16) {
    return { status: "INCOMPLETE", fixtures: [] };
  }

  const fixtures = [];

  for (let i = 0; i < 16; i += 2) {
    fixtures.push({
      round: "R16",
      matchKey: `R16_${fixtures.length + 1}`,
      homeTeam: winners[i],
      awayTeam: winners[i + 1],
    });
  }

  return {
    status: "READY",
    fixtures
  };
}


export function generateQuarterFinals(r16Predictions) {

  const fixtures = [];

  for (let i = 0; i < r16Predictions.length; i += 2) {

    const home = formatTeam(r16Predictions[i].winnerTeam);
    const away = formatTeam(r16Predictions[i + 1].winnerTeam);

    if (!home || !away) {
      return { status: "INCOMPLETE", fixtures: [] };
    }

    fixtures.push({
      round: "QF",
      matchKey: `QF_${fixtures.length + 1}`,
      homeTeam: home,
      awayTeam: away,
    });
  }

  return {
    status: "READY",
    fixtures
  };
}


export function generateSemiFinals(qfPredictions) {

  if (qfPredictions.length < 4) {
    return { status: "INCOMPLETE", fixtures: [] };
  }

  const fixtures = [];

  for (let i = 0; i < 4; i += 2) {

  const home = formatTeam(qfPredictions[i].winnerTeam);
  const away = formatTeam(qfPredictions[i + 1].winnerTeam);

    if (!home || !away) {
      return { status: "INCOMPLETE", fixtures: [] };
    }

    fixtures.push({
      round: "SF",
      matchKey: `SF_${fixtures.length + 1}`,
      homeTeam: home,
      awayTeam: away,
    });
  }

  return {
    status: "READY",
    fixtures
  };
}


export function generateFinal(sfPredictions) {

  if (sfPredictions.length < 2) {
    return { status: "INCOMPLETE", fixtures: [] };
  }

  const home = formatTeam(sfPredictions[0].winnerTeam);
  const away = formatTeam(sfPredictions[1].winnerTeam);

  if (!home || !away) {
    return { status: "INCOMPLETE", fixtures: [] };
  }

  return {
    status: "READY",
    fixtures: [
      {
        round: "F",
        matchKey: "F_1",
        homeTeam: home,
        awayTeam: away
      }
    ]
  };
}
