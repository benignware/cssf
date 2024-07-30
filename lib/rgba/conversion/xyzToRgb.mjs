// xyzToRgb.mjs
export function xyzToRgb(x, y, z) {
  // Convert XYZ to RGB
  let r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314;
  let g = x * -0.9688007 + y * 1.8759324 + z * 0.0415550;
  let b = x * 0.0557101 + y * -0.2040211 + z * 1.0572252;

  // Apply gamma correction
  r = (r > 0.0031308) ? 1.055 * (r ** (1 / 2.4)) - 0.055 : 12.92 * r;
  g = (g > 0.0031308) ? 1.055 * (g ** (1 / 2.4)) - 0.055 : 12.92 * g;
  b = (b > 0.0031308) ? 1.055 * (b ** (1 / 2.4)) - 0.055 : 12.92 * b;

  // Clamp values to [0, 1]
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  return { r, g, b };
}
