const hsla = require('../hsla');
const { parseFn, toDecimal } = require('../utils');

/**
 * Returns saturation of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the saturation of the given color as a decimal
 */
function saturation(color) {
  const [, , saturation] = parseFn(hsla(color));

  return toDecimal(saturation);
}

module.exports = saturation;
