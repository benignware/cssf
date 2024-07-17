import { parseFn } from '../utils.mjs';
import calc from '../calc.mjs';
import ifelse from '../ifelse.mjs';
import gt from '../gt.mjs';
import hsla from '../hsla.mjs';
import rgba from '../rgba.mjs';
import contrastRatio from '../contrastRatio.mjs';

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

export default contrastColor;
