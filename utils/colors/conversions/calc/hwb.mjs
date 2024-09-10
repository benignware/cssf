import { clamp } from './utils.mjs';
import { hslToRgb, rgbToHsl } from './hsl.mjs';

import ifelse from '../../../../lib/ifelse/ifelse.mjs';
import eq from '../../../../lib/eq/eq.mjs';
import round from '../../../../lib/round/round.mjs';


export const hwbToRgb = (h, W, B) => {
  // Convert HSL to RGB
  let [r, g, b] = hslToRgb(h, 1, 0.5);

  // Calculate the RGB values with Whiteness and Blackness
  const w = `(${W} * 255)`;     // White component

  // Adjust RGB values by Whiteness and Blackness
  r = `(${r} * (1 - ${W} - ${B}) + ${w})`;
  g = `(${g} * (1 - ${W} - ${B}) + ${w})`;
  b = `(${b} * (1 - ${W} - ${B}) + ${w})`;

  // r = `clamp(${r}, 0, 255)`;
  // g = `clamp(${g}, 0, 255)`;
  // b = `clamp(${b}, 0, 255)`;

  // r = `round(${r})`;
  // g = `round(${g})`;
  // b = `round(${b})`;

  return [r, g, b];
};

export const rgbToHwb = (r, g, b) => {
  // r = `clamp(${r}, 0, 255)`;
  // g = `clamp(${g}, 0, 255)`;
  // b = `clamp(${b}, 0, 255)`;

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r, g, b);

  const rn = `(${r} / 255)`;
  const gn = `(${g} / 255)`;
  const bn = `(${b} / 255)`;

  // Calculate white and black components
  let W = `min(${rn}, ${gn}, ${bn})`;
  let B = `(1 - max(${rn}, ${gn}, ${bn}))`;

  // W = `clamp(${W}, 0, 1)`;
  // B = `clamp(${B}, 0, 1)`;

  return [h, W, B];
};

// HSL to HWB
export const hslToHwb = (h, s, l) => {
  // Convert HSL to RGB
  const [r, g, b] = hslToRgb(h, s, l);

  // Calculate white and black components
  const W = `min(${r}, ${g}, ${b})`;
  const B = `255 - max(${r}, ${g}, ${b})`;

  return [h, W, B];
};

// HWB to HSL
export const hwbToHsl = (h, W, B) => {
  W = clamp(W, 0, 1);
  B = clamp(B, 0, 1);

  const L = `(1 - ${W} - ${B}) / 2`;
  const maxComponent = `max(${W}, ${B})`;
  const denominator = `1 - ${maxComponent}`;

  // const S = denominator > 0 ? (1 - W - B) / denominator : 0;
  const S = ifelse(eq(denominator, 0), 0, `(1 - ${W} - ${B}) / ${denominator}`);

  return [h, S, L];
};

