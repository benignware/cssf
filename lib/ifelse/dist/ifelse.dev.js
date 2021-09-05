"use strict";

// module.exports = function ifelse(condition, ...values) {
//   return `(((${values[0]}) * (${condition})) + ((${values[1]}) * (1 - (${condition}))))`;
// };
function ifelse(condition, a, b) {
  return "(((".concat(a, ") * (").concat(condition, ")) + ((").concat(b, ") * (1 - (").concat(condition, "))))");
}

module.exports = ifelse;