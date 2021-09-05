const gt = require('../gt');
const ifelse = require('../ifelse');
const { stripCalc } = require('../utils');

const lhf = () => 9007199254740992;

module.exports = function floor(value) {
  value = stripCalc(value);

  const result = `((${value}) + ${lhf()} - ${lhf()})`;

  return ifelse(gt(`${value} - ${result}`, 0), result, `(${result} - 1)`);
};
