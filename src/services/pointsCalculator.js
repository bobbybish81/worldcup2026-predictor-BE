// GROUP STAGE
export function calculateGroupPoints(pred, actual) {

  if (
    pred.homeScore === actual.homeScore &&
    pred.awayScore === actual.awayScore
  ) {
    return 4;
  }

  const predResult = Math.sign(pred.homeScore - pred.awayScore);
  const actualResult = Math.sign(actual.homeScore - actual.awayScore);

  if (predResult === actualResult) {
    return 3;
  }

  return 0;
}

// KNOCKOUT
export function calculateKnockoutPoints(round) {

  const POINTS_MAP = {
    R32: 2,
    R16: 4,
    QF: 6,
    SF: 8,
    F: 10
  };

  return POINTS_MAP[round] || 0;
}