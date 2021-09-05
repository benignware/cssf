const { stripCalc } = require('../utils');
/**
 * Wraps expression into calc and strips nested redundant calls
 *
 * @param {String} expression
 * @returns expression wrapped into calc
 */
 module.exports = function calc(expression) {
   return `calc(${stripCalc(expression)})`;
};
