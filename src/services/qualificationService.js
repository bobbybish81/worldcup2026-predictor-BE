export function getQualifiedTeams(groupTables) {
  const winners = [];
  const runnersUp = [];
  const thirdPlace = [];

  for (const group in groupTables) {
    const table = groupTables[group];

    if (!table || table.length < 3) continue;

    winners.push({ ...table[0], group });
    runnersUp.push({ ...table[1], group });
    thirdPlace.push({ ...table[2], group });
  }

  // rank third-place teams globally
  thirdPlace.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return b.goalDiff - a.goalDiff;
  });

  const bestThird = thirdPlace.slice(0, 8);

  return {
    winners,
    runnersUp,
    bestThird,
  };
}
