import hsla from '../hsla/index.mjs';
import { parseFn, toDecimal } from '../utils.mjs';

/**
 * Returns lightness of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the lightness of the given color as a decimal
 */
function lightness(color) {
  const [, , , lightness] = parseFn(hsla(color));

  return toDecimal(lightness);
}

export default lightness;
