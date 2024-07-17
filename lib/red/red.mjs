import rgba from '../rgba/rgba.mjs';
import { parseFn } from '../utils.mjs';

/**
 * Returns red channel of a color.
 * @param {string} color A css color value
 * @returns {(string|number)} A css expression representing the red channel ranging from 0 to 255
 */
function red(color) {
  const [, red] = parseFn(rgba(color));

  return red;
}

export default red;
