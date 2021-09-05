// module.exports = function ifelse(condition, ...values) {
//   return `(((${values[0]}) * (${condition})) + ((${values[1]}) * (1 - (${condition}))))`;
// };

const { stripCalc } = require('../utils');

function ifelse(condition, a, b) {
  condition = stripCalc(condition);
  a = stripCalc(a);
  b = stripCalc(b);

  return `(((${a}) * (${condition})) + ((${b}) * (1 - (${condition}))))`;
}

module.exports = ifelse;
