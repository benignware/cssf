import colorBrightness from '../colorBrightness/index.mjs';
import ifelse from '../ifelse/index.mjs';
import gt from '../gt/index.mjs';

function contrastRatio(rgb1, rgb2) {
  const lum1 = colorBrightness(rgb1);
  const lum2 = colorBrightness(rgb2);
  const ratio = ifelse(
    gt(lum1, lum2),
    `(${lum1} + 0.05) / (${lum2} + 0.05)`,
    `(${lum2} + 0.05) / (${lum1} + 0.05)`
  );

  return ratio;
}

export default contrastRatio;
