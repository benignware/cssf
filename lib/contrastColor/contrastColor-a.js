const { parseFn } = require('../utils');
const calc = require('../calc');
const ifelse = require('../ifelse');
const lte = require('../lte');
const hsla = require('../hsla');
const rgba = require('../rgba');
const brightness = require('../brightness');

function contrastColor(background, light = '#ffffff', dark = '#000000') {
  const br = brightness(background);
  const colorFn =
    light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;

  light = colorFn(light);
  dark = colorFn(dark);

  const [, ...lightArgs] = parseFn(light);
  const [, ...darkArgs] = parseFn(dark);

  const args = Array.from(Array(3).keys())
    .map((index) => ifelse(lte(br, 0.55), lightArgs[index], darkArgs[index]))
    .map((arg) => calc(arg));

  return colorFn(...args);
}

module.exports = contrastColor;
