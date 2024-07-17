import brightness from '../brightness/index.mjs';
import ifelse from '../ifelse/index.mjs';
import gt from '../gt/index.mjs';
import divide from '../divide/index.mjs';
import add from '../add/add.mjs';

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

export default contrastRatio;
