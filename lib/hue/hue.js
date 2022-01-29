const hsla = require('../hsla');
const { parseFn } = require('../utils');

/**
 * Returns hue channel of a color.
 * @param {string} color A css color value
 * @returns {(string|number)} A css expression representing the hue channel ranging from 0 to 360
 */
function hue(color) {
  const [, h] = parseFn(hsla(color));

  return h;
}

module.exports = hue;
