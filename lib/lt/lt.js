const { stripCalc } = require('../utils');

/**
 * Determines if a is lesser than b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
function lt(a, b) {
  const l = 0.00000000000001;

  a = stripCalc(a);
  b = stripCalc(b);

  const v = `(${b} - ${a})`;
  const s = `clamp(0, ${v} / ${l}, 1)`;

  return s;
}

module.exports = lt;
