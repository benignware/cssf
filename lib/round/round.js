const { stripCalc } = require('../utils');

const shf = (digits = 0) => `4.9406564584124654e-${324 - digits}`;

module.exports = function round(value, digits = 0) {
  // console.log('round value...', value, digits);
  value = stripCalc(value);

  return `(((${value}) / ${10 * (digits + 1)} * ${shf(digits + 1)} / ${shf(
    digits + 1
  )}) * ${10 * (digits + 1)})`;
};
