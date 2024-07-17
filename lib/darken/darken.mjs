import lighten from '../lighten/lighten.mjs';
import { toDecimal } from '../utils.mjs';

/**
 * Darkens a color by a given amount.
 * @param {string} color A CSS color value.
 * @param {(number|string)} [weight=0.25] The decimal amount by which the color is darkened.
 * @returns {string} The resulting CSS color value.
 */
function darken(color, weight = 0.25) {
  weight = `(${toDecimal(weight)} * -1)`;

  return lighten(color, weight);
}

export default darken;
