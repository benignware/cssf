const brightness = require('../brightness');
const ifelse = require('../ifelse');
const gt = require('../gt');
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

module.exports = contrastRatio;
