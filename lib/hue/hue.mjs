import hsla from '../hsla/index.mjs';
import { parseFn } from '../utils.mjs';

/**
 * Returns hue channel of a color.
 * @param {string} color A css color value
 * @returns {(string|number)} A css expression representing the hue channel ranging from 0 to 360
 */
function hue(color) {
  const [, h] = parseFn(hsla(color));

  return h;
}

export default hue;
