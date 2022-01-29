const hsla = require('../hsla');
const { parseFn, toDecimal } = require('../utils');

/**
 * Returns lightness of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the lightness of the given color as a decimal
 */
function lightness(color) {
  const [, , , lightness] = parseFn(hsla(color));

  return toDecimal(lightness);
}

module.exports = lightness;
