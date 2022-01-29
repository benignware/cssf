/**
 * Returns the absolute value of a number.
 * @param {number} value A numberical expression
 * @returns {string} A css expression representing the absolute value of the given number
 */
function abs(value) {
  return `max(${value}, -1 * (${value}))`;
}

module.exports = abs;
