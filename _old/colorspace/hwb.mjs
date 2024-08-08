import { clamp } from './utils.mjs';
import { hslToRgb, rgbToHsl } from './hsl.mjs';

// HWB to RGB
export const hwbToRgb = (h, W, B) => {
  h = clamp(h, 0, 360) / 360;
  W = clamp(W, 0, 1);
  B = clamp(B, 0, 1);

  // Convert HWB to HSL
  const hsl = hslToRgb(h * 360, 1, 0.5);
  const w = W * 255;
  const b = B * 255;

  // Interpolate RGB values
  return [
    Math.round(clamp(hsl[0] * (1 - W - B) + w, 0, 255)),
    Math.round(clamp(hsl[1] * (1 - W - B) + w, 0, 255)),
    Math.round(clamp(hsl[2] * (1 - W - B) + w, 0, 255))
  ];
};

// RGB to HWB
export const rgbToHwb = (r, g, b) => {
  r = clamp(r, 0, 255) / 255;
  g = clamp(g, 0, 255) / 255;
  b = clamp(b, 0, 255) / 255;

  // Convert RGB to HSL
  const [h, s, l] = rgbToHsl(r * 255, g * 255, b * 255);

  // Calculate white and black components
  const W = Math.min(r, g, b);
  const B = 1 - Math.max(r, g, b);

  return [h, W, B];
};

