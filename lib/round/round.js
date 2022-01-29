const { stripCalc } = require('../utils');

const shf = (digits = 0) => `4.9406564584124654e-${324 - digits}`;

/**
 * Returns a number that is the nearest integer to the given number.
 * @param {(string|number)} value A numerical expression
 * @returns {string} A css expression representing the nearest number to the given input
 */
function round(value) {
  let digits = 0;

  value = stripCalc(value);

  return `(((${value}) / ${10 * (digits + 1)} * ${shf(digits + 1)} / ${shf(
    digits + 1
  )}) * ${10 * (digits + 1)})`;
}

module.exports = round;
