"use strict";

// const not = require('../not');
// const and = require('../and');
// const eq = require('../eq');
// const gt = require('../gt');
var round = require('../round');

var _require = require('../utils'),
    stripCalc = _require.stripCalc; // module.exports = function lt(a, b) {
//   return and(not(eq(a, b)), not(gt(a, b)));
// };


module.exports = function lt(a, b) {
  var x = 0.00000000000001;
  a = stripCalc(a);
  b = stripCalc(b);
  return round("((".concat(b, ") - min(").concat(b, ", ").concat(a, ")) / max(max(").concat(b, ", ").concat(a, ") - min(").concat(b, ", ").concat(a, "), ").concat(x, ")"));
};