import { stripCalc } from '../utils.mjs';

/*
 * Returns the sign of a number, indicating whether the number is positive or negative.
 * @param {(number|string)} value A numerical value
 * @returns {number} The sign of the given number
 */
function sign(value) {
  value = stripCalc(value);

  const lim = 0.0000000000000001;

  return `clamp(-1, (${value}) / ${lim}, 1)`;
}

export default sign;
