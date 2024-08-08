const PRECISION = 0.004;

export const toleranceFromRange = (array, precision = PRECISION) =>
  (array || []).map(([min, max]) => (max - min) * precision)
  .reduce((acc, t) => acc === undefined ? t : (acc === t ? acc : t), undefined);