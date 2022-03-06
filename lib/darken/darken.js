const lighten = require('../lighten/lighten');
const { toDecimal } = require('../utils');

/**
 * Darkens a color by given amount.
 * @param {string} color A css color value;
 * @param {(number|string)} [weight=0.25] weight Decimal amount by which the color is darkened
 * @returns {string} The resulting css color value
 */
function darken(color, weight = 0.25) {
  weight = `(${toDecimal(weight)} * -1)`;

  return lighten(color, weight);
}

module.exports = darken;
