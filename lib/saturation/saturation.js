const hsla = require('../hsla');
const { parseFn, toDecimal } = require('../utils');

function saturation(color) {
  const [, , saturation] = parseFn(hsla(color));

  return toDecimal(saturation);
}

module.exports = saturation;
