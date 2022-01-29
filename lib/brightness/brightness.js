const { parseFn } = require('../utils');
const rgba = require('../rgba');
const add = require('../add');
const multiply = require('../multiply');
const divide = require('../divide');

/**
 * Returns brightness of a color.
 * @param {string} color A css color value
 * @returns {string} A css expression representing the brightness of the given color as a decimal
 */
function brightness(color) {
  // http://www.w3.org/TR/AERT#color-contrast
  color = rgba(color);

  const [, r, g, b] = parseFn(color);

  return divide(
    divide(add(multiply(r, 299), multiply(g, 587), multiply(b, 114)), 1000),
    255
  );
}

module.exports = brightness;
