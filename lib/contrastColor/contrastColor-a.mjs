import { parseFn } from '../utils.mjs';
import ifelse from '../ifelse/ifelse.mjs';
import lte from '../lte/index.mjs';
import hsla from '../hsla/hsla.mjs';
import rgba from '../rgba/rgba.mjs';
import colorBrightness from '../colorBrightness/index.mjs';

/**
 * Returns a contrast color
 * @param {string} background A css color value;
 * @param {string} [light=#ffffff] light Light color
 * @param {string} [dark=#000000] dark Dark color
 * @returns {string} The resulting contrast color
 */
function contrastColor(background, light = '#ffffff', dark = '#000000') {
  const br = colorBrightness(background);
  const colorFn =
    light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;

  light = colorFn(light);
  dark = colorFn(dark);

  const [, ...lightArgs] = parseFn(light);
  const [, ...darkArgs] = parseFn(dark);

  const args = Array.from(Array(3).keys())
    .map((index) => ifelse(lte(br, 0.55), lightArgs[index], darkArgs[index]));

  return colorFn(...args);
}

export default contrastColor;
