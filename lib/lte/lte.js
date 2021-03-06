const not = require('../not');
const gt = require('../gt');

/**
 * Determines if a is lesser than or equal to b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
function lte(a, b) {
  return not(gt(a, b));
}

module.exports = lte;
