const round = require('../round');
const abs = require('../abs');

/**
 * Applies arithmetic equality operation.
 * @param {number} a Some numerical input
 * @param  {...number} b Some other numerical input
 * @returns {number} A css expression representing either 0 or 1
 */
function eq(a, b) {
  const x = 0.00000000000001;
  const c = `max(0, min(${abs(`(${a}) - (${b})`)}, 1))`;
  const d = `(${c} + 0.5 - ${x})`;
  const e = round(d);
  const f = `(1 - ${e})`;

  return f;
}

module.exports = eq;
