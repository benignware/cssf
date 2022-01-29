const not = require('../not');
const lt = require('../lt');

/**
 * Determines if a is greater than or equal to b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
function gte(a, b) {
  return not(lt(a, b));
}

module.exports = gte;
