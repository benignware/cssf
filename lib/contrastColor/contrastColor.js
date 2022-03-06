const { parseFn } = require('../utils');
const calc = require('../calc');
const ifelse = require('../ifelse');
const gt = require('../gt');
const hsla = require('../hsla');
const rgba = require('../rgba');
const contrastRatio = require('../contrastRatio');

// var rgb = [255, 0, 0];

// function setForegroundColor() {
//   var sum = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
//   return (sum > 128) ? 'black' : 'white';
// }

/**
 * Returns a contrast color
 * @param {string} background A css color value;
 * @param {string} [color=#ffffff] light Light color
 * @param {string} [color=#000000] dark Dark color
 * @returns {string} The resulting contrast color
 */
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
