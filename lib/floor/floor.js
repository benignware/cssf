const gt = require('../gt');
const ifelse = require('../ifelse');
const { stripCalc } = require('../utils');

const lhf = () => 9007199254740992;

/**
 * Returns the largest integer less than or equal to a given number.
 * @param {(number|string)} value A numerical value
 * @returns {string} A computable css expression
 */
function floor(value) {
  value = stripCalc(value);

  const result = `((${value}) + ${lhf()} - ${lhf()})`;

  return ifelse(gt(`${value} - ${result}`, 0), result, `(${result} - 1)`);
}

module.exports = floor;
