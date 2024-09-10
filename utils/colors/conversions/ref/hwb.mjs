import { clamp } from './utils.mjs';
import { hslToRgb, rgbToHsl } from './hsl.mjs';


// HWB to RGB
export const hwbToRgb = (h, W, B) => {
  // h = clamp(h, 0, 360) / 360;
  W = clamp(W, 0, 1);
  B = clamp(B, 0, 1);

  // Convert HWB to HSL
  const hsl = hslToRgb(h, 1, 0.5);
  const w = W * 255;

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


// HWB to HSL
export const hwbToHsl = (h, W, B) => {
  W = clamp(W, 0, 1);
  B = clamp(B, 0, 1);

  // Calculate Lightness (L)
  const L = (1 - W - B) / 2;

  // Calculate Saturation (S)
  const maxComponent = Math.max(W, B);
  const denominator = 1 - maxComponent;
  const S = denominator > 0 ? (1 - L) / denominator : 0;

  return [h, S, L];
};

// HSL to HWB
export const hslToHwb = (h, S, L) => {
  S = clamp(S, 0, 1);
  L = clamp(L, 0, 1);

  // Calculate White (W) and Black (B)
  const W = Math.max(0, L + S - 1);
  const B = Math.max(0, 1 - L - S + W);

  return [h, W, B];
};


