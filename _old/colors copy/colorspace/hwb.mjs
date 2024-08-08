import { hslToRgb, rgbToHsl } from './hsl.mjs'

export function hwbToRgb(h, W, B) {
  let [r, g, b] = hslToRgb(h, 1, 0.5);

  // Calculate each RGB component separately
  r = Math.round(((r / 255) * (1 - W - B) + W) * 255);
  g = Math.round(((g / 255) * (1 - W - B) + W) * 255);
  b = Math.round(((b / 255) * (1 - W - B) + W) * 255);

  return [r, g, b];
}

export function rgbToHwb(r, g, b) {
  const [h] = rgbToHsl(r, g, b);
  const W = Math.min(r, g, b) / 255;
  const B = 1 - Math.max(r, g, b) / 255;

  return [h, W, B];
}
