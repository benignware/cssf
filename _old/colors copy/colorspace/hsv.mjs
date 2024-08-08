import { hslToRgb, rgbToHsl } from './hsl.mjs';

export function hsvToRgb(h, s, v) {
  // Convert HSV to HSL
  const l = v * (1 - s / 2);
  const newS = (v - l) / Math.max(l, 1 - l);

  // Use the HSL to RGB conversion function
  return hslToRgb(h, newS, l);
}

export function rgbToHsv(r, g, b) {
  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r, g, b);

  // Calculate HSV from HSL
  const v = l + s * Math.min(l, 1 - l);
  const newS = v === 0 ? 0 : (2 * (1 - l / v));

  return [h, newS, v];
}
