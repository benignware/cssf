import rgba from '../rgba/rgba.mjs';
import { parseFn } from '../utils.mjs';

/**
 * Returns green channel of a color.
 * @param {string} color A css color value
 * @returns {(string|number)} A css expression representing the green channel ranging from 0 to 255
 */
function green(color) {
  const [, , g] = parseFn(rgba(color));

  return g;
}

export default green;
