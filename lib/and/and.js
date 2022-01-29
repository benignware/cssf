/**
 * Applies arithmetic "and" operation.
 * @param {(number|string)} a A css expression that resolves to either 0 or 1
 * @param {(number|string)} b Another css expression that resolves to either 0 or 1
 * @returns {string} A css expression that resolves to either 0 or 1
 */
function and(a, b) {
  return `((${a}) * (${b}))`;
}

module.exports = and;
