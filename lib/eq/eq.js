const not = require('../not');
const and = require('../and');
const gt = require('../gt');
const lt = require('../lt');

/**
 * Applies arithmetic equality operation.
 * @param {number} a Some numerical input
 * @param  {...number} b Some other numerical input
 * @returns {number} A css expression representing either 0 or 1
 */
function eq(a, b) {
  return `${and(not(gt(a, b)), not(lt(a, b)))}`;
}

module.exports = eq;
