/**
 * Returns the absolute value of a number.
 * @param {number} value A numerical expression
 * @returns {string} A CSS expression representing the absolute value of the given number
 */
export default function abs(value) {
  return `max(${value}, -1 * (${value}))`;
}
