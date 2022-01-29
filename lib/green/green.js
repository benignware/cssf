const rgba = require('../rgba');
const { parseFn } = require('../utils');

/**
 * Returns green channel of a color.
 * @param {string} color A css color value
 * @returns {(string|number)} A css expression representing the green channel ranging from 0 to 255
 */
function green(color) {
  const [, , g] = parseFn(rgba(color));

  return g;
}

module.exports = green;
