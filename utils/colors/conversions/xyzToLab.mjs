export const xyzToLab = (x, y, z) => {
  // Normalize XYZ values
  x /= 95.047;
  y /= 100;
  z /= 108.883;

  // Convert XYZ to Lab
  const f = (t) => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  const L = 116 * f(y) - 16;
  const a = 500 * (f(x) - f(y));
  const b = 200 * (f(y) - f(z));

  return [L, a, b];
}