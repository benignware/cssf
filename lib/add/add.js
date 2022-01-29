const { computer, memoize } = require('../utils');

const _add = memoize(computer('+'));

/**
 * Computes the sum of numbers.
 * @param {(string|number)} a A numerical expression
 * @param {...(string|number)} b Another numerical expression
 * @returns {(string|number)} The sum of the given numbers or equivalent css expression
 */
function add(a, ...b) {
  return _add(a, ...b);
}

module.exports = add;
