// Utility functions for color conversions
const toAbsoluteRgb = (r, g, b) => [r * 255, g * 255, b * 255];
const toAbsoluteHsl = (h, s, l) => [h * 360, s * 100, l * 100];
const toAbsoluteHsv = (h, s, v) => [h * 360, s * 100, v * 100];
const toAbsoluteXYZ = (x, y, z) => [x * 95.047, y * 100, z * 108.883];
const toAbsoluteLab = (L, a, b) => [L * 100, a * 200 - 100, b * 200 - 100];
const toAbsoluteLms = (l, m, s) => [l * 100, m * 100, s * 100];
const toAbsoluteLch = (l, c, h) => [l * 100, c * 100, Math.round(((h % 1) + 1) % 1 * 360)];
const toAbsoluteOklab = (L, a, b) => [L * 100, a - 0.5, b - 0.5];
const toAbsoluteOklch = (L, C, H) => [L * 100, C * 100, Math.round(((H % 1) + 1) % 1 * 360)];
const toAbsoluteCmyk = (c, m, y, k) => [c * 100, m * 100, y * 100, k * 100];
const toAbsoluteHwb = (h, w, b) => [h * 360, w * 100, b * 100];
const toAbsoluteYuv = (y, u, v) => [y, u - 0.5, v - 0.5];

const absoluteConverters = {
  rgb: toAbsoluteRgb,
  hsl: toAbsoluteHsl,
  hsv: toAbsoluteHsv,
  xyz: toAbsoluteXYZ,
  lab: toAbsoluteLab,
  lms: toAbsoluteLms,
  lch: toAbsoluteLch,
  oklab: toAbsoluteOklab,
  oklch: toAbsoluteOklch,
  cmyk: toAbsoluteCmyk,
  hwb: toAbsoluteHwb,
  yuv: toAbsoluteYuv,
};

export const toAbsoluteColor = (colorSpace, ...values) => {
  const converter = absoluteConverters[colorSpace];
  if (!converter) throw new Error(`Unknown color space: ${colorSpace}`);
  return converter(...values);
};