const rgba = require('../rgba');
const hsla = require('../hsla');
const { parseFn } = require('../utils');

/**
 * Returns alpha channel of a color.
 * @param {string} color A css color value
 * @returns {(string|number)} A css expression representing the alpha channel of the given color as a decimal
 */
function alpha(color) {
  color = (color.match(/^\s*hsl/) ? hsla : rgba)(color);

  const [, , , , a] = parseFn(color);

  return a;
}

module.exports = alpha;
