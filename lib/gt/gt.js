const round = require('../round');
const { stripCalc } = require('../utils');

/**
 * Determines if a is greater than b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
function gt(a, b) {
  const x = 0.00000000000001;

  a = stripCalc(a);
  b = stripCalc(b);

  return round(
    `((${a}) - min(${a}, ${b})) / max(max(${a}, ${b}) - min(${a}, ${b}), ${x})`
  );
}

module.exports = gt;
