// const ROUND_OF_16 = [
//   ["A1", "B2"],
//   ["C1", "D2"],
//   ["E1", "F2"],
//   ["G1", "H2"],

//   ["B1", "A2"],
//   ["D1", "C2"],
//   ["F1", "E2"],
//   ["H1", "G2"],
// ];

// export function generateRoundOf16(groupTables) {
//   const fixtures = [];

//   for (const [slotA, slotB] of ROUND_OF_16) {
//     const groupA = slotA[0];
//     const posA = Number(slotA[1]) - 1;

//     const groupB = slotB[0];
//     const posB = Number(slotB[1]) - 1;

//     const homeTeam = groupTables[groupA]?.[posA];
//     const awayTeam = groupTables[groupB]?.[posB];

//     // safety guard
//     if (!homeTeam || !awayTeam) continue;

//     fixtures.push({
//       homeTeam,
//       awayTeam,
//     });
//   }

//   return fixtures;
// }
