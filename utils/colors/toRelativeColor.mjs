// Utility functions for color conversions
const toRelativeRgb = (r, g, b) => [r / 255, g / 255, b / 255];
const toRelativeHsl = (h, s, l) => [h % 360 / 360, s / 100, l / 100];
const toRelativeHsv = (h, s, v) => [h % 360 / 360, s / 100, v / 100];
const toRelativeXYZ = (x, y, z) => [x / 95.047, y / 100, z / 108.883];
const toRelativeLab = (L, a, b) => [L / 100, (a + 100) / 200, (b + 100) / 200];
const toRelativeLms = (l, m, s) => [l / 100, m / 100, s / 100];
const toRelativeLch = (l, c, h) => [l / 100, c / 100, ((h % 360) + 360) % 360 / 360];
const toRelativeOklab = (L, a, b) => [L / 100, (a + 0.5) / 1, (b + 0.5) / 1];
const toRelativeOklch = (L, C, H) => [L / 100, C / 100, ((H % 360) + 360) % 360 / 360];
const toRelativeCmyk = (c, m, y, k) => [c / 100, m / 100, y / 100, k / 100];
const toRelativeHwb = (h, w, b) => [h % 360 / 360, w / 100, b / 100];
const toRelativeYuv = (y, u, v) => [y, (u + 0.5) / 1, (v + 0.5) / 1];

// Update converters
const relativeConverters = {
  rgb: toRelativeRgb,
  hsl: toRelativeHsl,
  hsv: toRelativeHsv,
  xyz: toRelativeXYZ,
  lab: toRelativeLab,
  lms: toRelativeLms,
  lch: toRelativeLch,
  oklab: toRelativeOklab,
  oklch: toRelativeOklch,
  cmyk: toRelativeCmyk,
  hwb: toRelativeHwb,
  yuv: toRelativeYuv,
};

// Functions to convert colors
export const toRelativeColor = (colorSpace, ...values) => {
  const converter = relativeConverters[colorSpace];
  if (!converter) throw new Error(`Unknown color space: ${colorSpace}`);
  return converter(...values);
};
