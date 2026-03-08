export function calculatePoints(pred, actual) {
  // Exact score
  if (
    pred.homeScore === actual.homeScore &&
    pred.awayScore === actual.awayScore
  ) {
    return 4;
  }

  const predResult = Math.sign(pred.homeScore - pred.awayScore);
  const actualResult = Math.sign(actual.homeScore - actual.awayScore);

  // Correct outcome
  if (predResult === actualResult) {
    return 3;
  }

  return 0;
}