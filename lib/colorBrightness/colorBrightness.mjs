import { parseFn } from '../utils.mjs';
import rgba from '../rgba/rgba.mjs';

/**
 * Returns brightness of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the brightness of the given color as a decimal
 */
function colorBrightness(color) {
  color = rgba(color);

  const [, r, g, b] = parseFn(color);

  return `((${r} * 299 + ${g} * 587 + ${b} * 114) / 1000) / 255`;
}

export default colorBrightness;
