import { parseFn } from '../utils.mjs';
import rgba from '../rgba/rgba.mjs';
import add from '../add/add.mjs';
import multiply from '../multiply/multiply.mjs';
import divide from '../divide/divide.mjs';

/**
 * Returns brightness of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the brightness of the given color as a decimal
 */
function colorBrightness(color) {
  color = rgba(color);

  const [, r, g, b] = parseFn(color);

  const x = divide(add(multiply(r, 299), multiply(g, 587), multiply(b, 114)), 1000);

  return `calc(${x} / 255)`;

  return divide(
    x,
    255
  );
}

export default colorBrightness;
