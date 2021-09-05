"use strict";

var round = require('../round');

var _require = require('../utils'),
    stripCalc = _require.stripCalc;

module.exports = function gt(a, b) {
  var x = 0.00000000000001;
  a = stripCalc(a);
  b = stripCalc(b);
  return round("((".concat(a, ") - min(").concat(a, ", ").concat(b, ")) / max(max(").concat(a, ", ").concat(b, ") - min(").concat(a, ", ").concat(b, "), ").concat(x, ")"));
};