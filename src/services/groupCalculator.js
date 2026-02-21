export function calculateGroupTable(matches) {
  const table = {};

  for (const m of matches) {
    const home = m.homeTeam;
    const away = m.awayTeam;

    if (!table[home.id]) {
      table[home.id] = {
        teamId: home.id,
        teamName: home.name,
        played: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
      };
    }

    if (!table[away.id]) {
      table[away.id] = {
        teamId: away.id,
        teamName: away.name,
        played: 0,
        points: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
      };
    }

    const h = table[home.id];
    const a = table[away.id];

    h.played += 1;
    a.played += 1;

    h.goalsFor += m.homeScore;
    h.goalsAgainst += m.awayScore;

    a.goalsFor += m.awayScore;
    a.goalsAgainst += m.homeScore;

    h.goalDiff = h.goalsFor - h.goalsAgainst;
    a.goalDiff = a.goalsFor - a.goalsAgainst;

    if (m.homeScore > m.awayScore) {
      h.points += 3;
    } else if (m.homeScore < m.awayScore) {
      a.points += 3;
    } else {
      h.points += 1;
      a.points += 1;
    }
  }

  return Object.values(table).sort(
    (a, b) =>
      b.points - a.points ||
      b.goalDiff - a.goalDiff ||
      b.goalsFor - a.goalsFor
  );
}
