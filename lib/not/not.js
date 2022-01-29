/**
 * Opposites a given boolean expression.
 * @param {string} a A numerical expression that resolves to either 0 or 1
 * @returns {string} A css expression that evaluates to either 0 or 1
 */
function not(a) {
  return `(1 - (${a}))`;
}

module.exports = not;
