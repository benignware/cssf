const { parseFn } = require('../utils');
const calc = require('../calc');
const ifelse = require('../ifelse');
const gt = require('../gt');
const hsla = require('../hsla');
const rgba = require('../rgba');
const contrastRatio = require('../contrastRatio');

function contrastColor(background, light = '#ffffff', dark = '#000000') {
  const ratio1 = contrastRatio(background, light);
  const ratio2 = contrastRatio(background, dark);
  const colorFn =
    light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;

  light = colorFn(light);
  dark = colorFn(dark);

  const [, ...lightArgs] = parseFn(light);
  const [, ...darkArgs] = parseFn(dark);

  const args = Array.from(Array(3).keys())
    .map((index) =>
      ifelse(gt(ratio1, ratio2), lightArgs[index], darkArgs[index])
    )
    .map((arg) => calc(arg));

  return colorFn(...args);
}

module.exports = contrastColor;
