const hsla = require('../hsla');
const { parseFn } = require('../utils');

function hue(color) {
  const [, h] = parseFn(hsla(color));

  return h;
}

module.exports = hue;
