"use strict";

var shf = function shf() {
  var digits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return "4.9406564584124654e-".concat(324 - digits);
};

module.exports = function round(value) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // console.log('round value...', value, digits);
  return "(((".concat(value, ") / ").concat(10 * (digits + 1), " * ").concat(shf(digits + 1), " / ").concat(shf(digits + 1), ") * ").concat(10 * (digits + 1), ")");
};