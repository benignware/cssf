// lab.mjs

// Import necessary utility functions
import { matrixMultiply } from './utils.mjs';
import { rgbToRgbLinear, rgbLinearToRgb } from './rgb.mjs';
// import { xyzToRgb, rgbToXyz } from './xyz.mjs';

// Constants for D65 white point
const D65_X = 0.95047;
const D65_Y = 1.00000;
const D65_Z = 1.08883;

// Function to apply gamma correction for RGB values
const gammaCorrect = (value) => {
  return value <= 0.0031308
    ? 12.92 * value
    : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
};

// Function to clamp values between 0 and 1
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// LAB to XYZ Conversion
const labToXyz = (L, a, b) => {
  const fInv = (t) => {
    const t3 = t ** 3;
    return t3 > 0.008856 ? t3 : (t - 16 / 116) / 7.787;
  };

  const Y = fInv((L + 16) / 116);
  const X = fInv((L + 16) / 116 + a / 500);
  const Z = fInv((L + 16) / 116 - b / 200);

  return [
    X * D65_X, // D65 Reference White X
    Y * D65_Y, // D65 Reference White Y
    Z * D65_Z  // D65 Reference White Z
  ];
};

// XYZ to LAB Conversion
const xyzToLab = (X, Y, Z) => {
  X /= D65_X;
  Y /= D65_Y;
  Z /= D65_Z;

  const f = (t) => t > 0.008856 ? Math.cbrt(t) : (t * 7.787) + (16 / 116);

  return [
    116 * f(Y) - 16,
    500 * (f(X) - f(Y)),
    200 * (f(Y) - f(Z))
  ];
};

// // Matrix for converting from XYZ to linear RGB
// const XyzToRgbLinearMatrix = [
//   [3.2404542, -1.5371385, -0.4985314],
//   [-0.9692660, 1.8760108, 0.0415560],
//   [0.0556434, -0.2040259, 1.0572252]
// ];

// // Matrix for converting from linear RGB to XYZ
// const RgbToXyzMatrix = [
//   [0.4124564, 0.3575761, 0.1804375],
//   [0.2126729, 0.7151522, 0.0721750],
//   [0.0193339, 0.1191920, 0.9503041]
// ];

// // Convert RGB to XYZ
// const rgbToXyz = (r, g, b) => {
//   const [rLinear, gLinear, bLinear] = rgbToRgbLinear(r, g, b);
//   return matrixMultiply(RgbToXyzMatrix, [rLinear, gLinear, bLinear]);
// };

// // Convert XYZ to RGB
// const xyzToRgb = (x, y, z) => {
//   const [rLinear, gLinear, bLinear] = matrixMultiply(XyzToRgbLinearMatrix, [x, y, z]);

//   // Apply gamma correction and clamp the values to [0, 255]
//   return [
//     Math.round(clamp(gammaCorrect(rLinear), 0, 1) * 255),
//     Math.round(clamp(gammaCorrect(gLinear), 0, 1) * 255),
//     Math.round(clamp(gammaCorrect(bLinear), 0, 1) * 255)
//   ];
// };

// Exported conversion functions
// export const labToRgb = (L, a, b) => {
//   const [X, Y, Z] = labToXyz(L, a, b);
//   return xyzToRgb(X, Y, Z);
// };

// export const rgbToLab = (r, g, b) => {
//   const [X, Y, Z] = rgbToXyz(r, g, b);
//   return xyzToLab(X, Y, Z);
// };
