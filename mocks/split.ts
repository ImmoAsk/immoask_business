// Shared by the mocks that keep a figure per management contract.

/**
 * Splits a whole number by weights, keeping the total exact (largest remainders get the leftover units).
 * Used to break an agency-wide history down per contract.
 */
export function splitByWeights(total: number, weights: number[], unit = 1) {
  const sum = weights.reduce((a, b) => a + b, 0);
  if (sum === 0) return weights.map(() => 0);
  const units = Math.round(total / unit);
  const raw = weights.map((weight) => (units * weight) / sum);
  const parts = raw.map(Math.floor);
  raw
    .map((value, index) => ({ index, rest: value - Math.floor(value) }))
    .sort((a, b) => b.rest - a.rest)
    .slice(0, units - parts.reduce((a, b) => a + b, 0))
    .forEach(({ index }) => (parts[index] += 1));
  return parts.map((part) => part * unit);
}
