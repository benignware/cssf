import { clamp } from './utils.mjs';
import { hslToRgb, rgbToHsl } from './hsl.mjs';

// HSV to HSL
export const hsvToHsl = (h, s, v) => {
  const l = (2 - s) * v / 2;
  const sHsl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

  return [h, sHsl, l];
}

// HSL to HSV
export const hslToHsv = (h, s, l) => {
  const v = l + s * (1 - Math.abs(2 * l - 1)) / 2;
  const sHsv = v === 0 ? 0 : 2 * (1 - l / v);

  return [h, sHsv, v];
}

// // HSV to RGB using HSL to RGB
// export const hsvToRgb = (h, s, v) => {
//   // Convert HSV to HSL
//   const [hHsl, sHsl, lHsl] = hsvToHsl(h, s, v);

//   // Convert HSL to RGB
//   return hslToRgb(hHsl, sHsl, lHsl);
// };

// // RGB to HSV using RGB to HSL
// export const rgbToHsv = (r, g, b) => {
//   // Convert RGB to HSL
//   const [hHsl, sHsl, lHsl] = rgbToHsl(r, g, b);

//   // Convert HSL to HSV
//   return hslToHsv(hHsl, sHsl, lHsl);
// };
