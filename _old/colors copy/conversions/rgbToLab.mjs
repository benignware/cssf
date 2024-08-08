import { rgbToXyz } from "./rgbToXyz.mjs";

export const rgbToLab = (r, g, b) => {
  const [x, y, z] = rgbToXyz(r, g, b);

  // Normalize XYZ values
  const xNorm = x / 95.047;
  const yNorm = y / 100;
  const zNorm = z / 108.883;

  // Convert XYZ to Lab
  const f = (c) => c > 0.008856 ? Math.cbrt(c) : 7.787 * c + 16 / 116;
  const l = 116 * f(yNorm) - 16;
  const a = 500 * (f(xNorm) - f(yNorm));
  const bVal = 200 * (f(yNorm) - f(zNorm));

  return [l, a, bVal];
}