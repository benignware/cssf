"use strict";

var gt = require('../gt');

var ifelse = require('../ifelse');

var lhf = function lhf() {
  return 9007199254740992;
};

module.exports = function floor(value) {
  var result = "((".concat(value, ") + ").concat(lhf(), " - ").concat(lhf(), ")");
  return ifelse(gt("".concat(value, " - ").concat(result), 0), result, "(".concat(result, " - 1)"));
};