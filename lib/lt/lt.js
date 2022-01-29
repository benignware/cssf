const round = require('../round');
const { stripCalc } = require('../utils');

/**
 * Determines if a is lesser than b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
function lt(a, b) {
  const x = 0.00000000000001;

  a = stripCalc(a);
  b = stripCalc(b);

  return round(
    `((${b}) - min(${b}, ${a})) / max(max(${b}, ${a}) - min(${b}, ${a}), ${x})`
  );
}

module.exports = lt;
