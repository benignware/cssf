const { stripCalc } = require('../utils');
/**
 * Wraps expression into calc and strips nested redundant calls.
 * @param {string} expression A css expression
 * @returns {string} expression wrapped into calc
 */
function calc(expression) {
  return `calc(${stripCalc(expression)})`;
}

module.exports = calc;
