const hsla = require('../hsla');
const { parseFn, toDecimal } = require('../utils');

function lightness(color) {
  const [, , , lightness] = parseFn(hsla(color));

  return toDecimal(lightness);
}

module.exports = lightness;
