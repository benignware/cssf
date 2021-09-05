"use strict";

var _require = require('../utils'),
    stripCalc = _require.stripCalc;
/**
 * Wraps expression into calc and strips nested redundant calls
 *
 * @param {String} expression
 * @returns expression wrapped into calc
 */


module.exports = function calc(expression) {
  return "calc(".concat(stripCalc(expression), ")");
};