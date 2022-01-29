const rgba = require('../rgba');
const { parseFn } = require('../utils');

/**
 * Returns blue channel of a color.
 * @param {string} color A css color value
 * @returns {(string|number)} A css expression representing the blue channel ranging from 0 to 255
 */
function blue(color) {
  const [, , , b] = parseFn(rgba(color));

  return b;
}

module.exports = blue;
