const floor = require('../floor');

/**
 * Determines modulus of a and b.
 * @param {(string|number)} a A numerical expression
 * @param {(string|number)} b Another numerical expression
 * @returns {string} A css expression representing modulus of given numbers
 */
function mod(a, b) {
  const c = `(${a}) / (${b})`;
  const i = floor(c);
  const result = `((${a}) - (${b}) * (${i}))`;

  return result;
}

module.exports = mod;
