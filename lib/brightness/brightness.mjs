import { parseFn } from '../utils.mjs';
import rgba from '../rgba/index.mjs';
import add from '../add/index.mjs';
import multiply from '../multiply/index.mjs';
import divide from '../divide/index.mjs';

/**
 * Returns brightness of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the brightness of the given color as a decimal
 */
function brightness(color) {
  color = rgba(color);

  const [, r, g, b] = parseFn(color);

  return divide(
    divide(add(multiply(r, 299), multiply(g, 587), multiply(b, 114)), 1000),
    255
  );
}

export default brightness;
