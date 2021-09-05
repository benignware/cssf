const { parseFn } = require('../utils');
const rgba = require('../rgba');
const add = require('../add');
const multiply = require('../multiply');
const divide = require('../divide');

// http://www.w3.org/TR/AERT#color-contrast
function brightness(color) {
  color = rgba(color);

  const [, r, g, b] = parseFn(color);

  return divide(
    divide(add(multiply(r, 299), multiply(g, 587), multiply(b, 114)), 1000),
    255
  );
}

module.exports = brightness;
