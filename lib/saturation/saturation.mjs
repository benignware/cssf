import { parseFn, toDecimal } from '../utils.mjs';
import hsla from '../hsla/index.mjs';

/**
 * Returns saturation of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the saturation of the given color as a decimal
 */
function saturation(color) {
  const [, , saturation] = parseFn(hsla(color));

  return toDecimal(saturation);
}

export default saturation;
