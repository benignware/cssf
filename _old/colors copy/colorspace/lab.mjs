// Import the conversion functions from xyz.mjs
import { xyzD65ToXyzD50, xyzD50ToXyzD65 } from './xyz.mjs';

// Constants for D65 reference white
const Xn_D65 = 0.95047;
const Yn_D65 = 1.00000;
const Zn_D65 = 1.08883;

// Helper function to apply the f(t) function for LAB conversions
function f(t) {
  return t > Math.pow(6/29, 3) ? Math.cbrt(t) : (t / (3 * Math.pow(6/29, 2))) + 4/29;
}

// Helper function to apply the inverse f(t) function
function fInverse(t) {
  return t > (6/29) ? Math.pow(t, 3) : 3 * Math.pow(6/29, 2) * (t - 4/29);
}

// Conversion functions

// Convert XYZ (assumed D65) to LAB
function xyzToLab(x, y, z) {
  const X = x / Xn_D65;
  const Y = y / Yn_D65;
  const Z = z / Zn_D65;

  const L = 116 * f(Y) - 16;
  const a = 500 * (f(X) - f(Y));
  const b = 200 * (f(Y) - f(Z));

  return [L, a, b];
}

// Convert LAB to XYZ (assumed D65)
function labToXyz(L, a, b) {
  const Y = Yn_D65 * fInverse((L + 16) / 116);
  const X = Xn_D65 * fInverse((L + 16) / 116 + a / 500);
  const Z = Zn_D65 * fInverse((L + 16) / 116 - b / 200);

  return [X, Y, Z];
}

// Convert LAB (D65) to LAB (D50)
function labD65ToLabD50(L, a, b) {
  const [X, Y, Z] = labToXyz(L, a, b);
  const [X_D50, Y_D50, Z_D50] = xyzD65ToXyzD50(X, Y, Z);
  const [L_D50, a_D50, b_D50] = xyzToLab(X_D50, Y_D50, Z_D50);
  return [L_D50, a_D50, b_D50];
}

// Convert LAB (D50) to LAB (D65)
function labD50ToLabD65(L, a, b) {
  const [X, Y, Z] = labToXyz(L, a, b);
  const [X_D65, Y_D65, Z_D65] = xyzD50ToXyzD65(X, Y, Z);
  const [L_D65, a_D65, b_D65] = xyzToLab(X_D65, Y_D65, Z_D65);
  return [L_D65, a_D65, b_D65];
}

export {
  xyzToLab,
  labToXyz,
  labD65ToLabD50,
  labD50ToLabD65
};
