const { parseFn } = require('../utils');
const calc = require('../calc');
const ifelse = require('../ifelse');
const gt = require('../gt');
const hsla = require('../hsla');
const rgba = require('../rgba');
const brightness = require('../brightness');
const divide = require('../divide');
const add = require('../add');

function contrastRatio(rgb1, rgb2) {
  const lum1 = brightness(rgb1);
  const lum2 = brightness(rgb2);
  const ratio = ifelse(
    gt(lum1, lum2),
    divide(add(lum1, 0.05), add(lum2, 0.05)),
    divide(add(lum2, 0.05), add(lum1, 0.05))
  );

  return ratio;
}

/**
 * Returns a contrast color
 * @param {string} background A css color value;
 * @param {string} [color=#ffffff] light Light color
 * @param {string} [color=#000000] dark Dark color
 * @returns {string} The resulting contrast color
 */
function contrast(background, light = '#ffffff', dark = '#000000') {
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

module.exports = contrast;
