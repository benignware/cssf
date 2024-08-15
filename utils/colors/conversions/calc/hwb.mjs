import ifelse from '../../../../lib/ifelse/ifelse.mjs';
import eq from '../../../../lib/eq/eq.mjs';
import round from '../../../../lib/round/round.mjs';

import { hslToRgb, rgbToHsl } from './hsl.mjs';

export const hwbToRgb = (h, W, B) => {
  const hn = `(clamp(${h}, 0, 360) / 360)`;
  // Calculate the saturation and lightness based on HWB
  const s = `(1 - (${W} + ${B}))`; // Saturation
  const l = 0.5;          // Lightness

  // Convert HSL to RGB
  let [r, g, b] = hslToRgb(h, 1, 0.5);

  // Calculate the RGB values with Whiteness and Blackness
  const w = `(${W} * 255)`;     // White component

  // Adjust RGB values by Whiteness and Blackness
  r = `(${r} * (1 - ${W} - ${B}) + ${w})`;
  g = `(${g} * (1 - ${W} - ${B}) + ${w})`;
  b = `(${b} * (1 - ${W} - ${B}) + ${w})`;

  r = `clamp(${r}, 0, 255)`;
  g = `clamp(${g}, 0, 255)`;
  b = `clamp(${b}, 0, 255)`;

  r = round(r);
  g = round(g);
  b = round(b);

  return [r, g, b];
};

export const rgbToHwb = (r, g, b) => {
  r = `clamp(${r}, 0, 255)`;
  g = `clamp(${g}, 0, 255)`;
  b = `clamp(${b}, 0, 255)`;

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r, g, b);

  const rn = `(${r} / 255)`;
  const gn = `(${g} / 255)`;
  const bn = `(${b} / 255)`;

  // Calculate white and black components
  let W = `min(${rn}, ${gn}, ${bn})`;
  let B = `(1 - max(${rn}, ${gn}, ${bn}))`;

  W = `clamp(${W}, 0, 1)`;
  B = `clamp(${B}, 0, 1)`;

  return [h, W, B];
};
