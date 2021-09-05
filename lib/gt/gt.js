const round = require('../round');
const { stripCalc } = require('../utils');

module.exports = function gt(a, b) {
  const x = 0.00000000000001;

  a = stripCalc(a);
  b = stripCalc(b);

  return round(
    `((${a}) - min(${a}, ${b})) / max(max(${a}, ${b}) - min(${a}, ${b}), ${x})`
  );
};
