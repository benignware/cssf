// xyz.mjs
import { matrixMultiply } from './utils.mjs';
import { rgbLinearToRgb, rgbToRgbLinear } from './rgb.mjs';

// White Point Conversion
const XyzD65ToXyzD50Matrix = [
  [1.047809, 0.022919, -0.050077],
  [0.029482, 0.990715, -0.017068],
  [-0.009242, 0.015360, 0.751724]
];

const XyzD50ToXyzD65Matrix = [
  [0.9555766, -0.0230393, 0.0631636],
  [-0.0282895, 1.0099416, 0.0210077],
  [0.0122982, -0.0204830, 1.3299098]
];

// Matrix for converting from XYZ to linear RGB
const XyzToRgbLinearMatrix = [
  [3.2404542, -1.5371385, -0.4985314],
  [-0.9692660, 1.8760108, 0.0415560],
  [0.0556434, -0.2040259, 1.0572252]
];

// Matrix for converting from linear RGB to XYZ
const RgbToXyzMatrix = [
  [0.4124564, 0.3575761, 0.1804375],
  [0.2126729, 0.7151522, 0.0721750],
  [0.0193339, 0.1191920, 0.9503041]
];

// // Convert XYZ to linear XYZ (essentially an identity operation for linear space)
// export const xyzToXyzLinear = (x, y, z) => {
//   return [x, y, z];
// };

// // Convert linear XYZ to XYZ (essentially an identity operation for linear space)
// export const xyzLinearToXyz = (x, y, z) => {
//   return [x, y, z];
// };

// Convert RGB to XYZ
export const rgbToXyz = (r, g, b) => {
  const [rLinear, gLinear, bLinear] = rgbToRgbLinear(r, g, b);
  return matrixMultiply(RgbToXyzMatrix, [rLinear, gLinear, bLinear]);
};
export const xyzToRgb = (x, y, z) => {
  const [rLinear, gLinear, bLinear] = matrixMultiply(XyzToRgbLinearMatrix, [x, y, z]);
  const [r, g, b] = rgbLinearToRgb(rLinear, gLinear, bLinear);

  return [Math.round(r), Math.round(g), Math.round(b)];
};


// Convert XYZ to RGB
// export const xyzToRgb = (x, y, z) => {
//   const [rLinear, gLinear, bLinear] = matrixMultiply(XyzToRgbLinearMatrix, [x, y, z]);

//   // Apply gamma correction and clamp the values to [0, 255]

//   const r = clamp(gammaCorrect(rLinear), 0, 1) * 255;
//   const g = clamp(gammaCorrect(gLinear), 0, 1) * 255;
//   const b = clamp(gammaCorrect(bLinear), 0, 1) * 255;

//   return [
//     r, g, b
//   ];

//   return [
//     Math.round(r),
//     Math.round(g),
//     Math.round(b)
//   ];
// };

// Convert from D65 to D50 and vice versa
export const xyzD65ToXyzD50 = (x, y, z) => matrixMultiply(XyzD65ToXyzD50Matrix, [x, y, z]);
export const xyzD50ToXyzD65 = (x, y, z) => matrixMultiply(XyzD50ToXyzD65Matrix, [x, y, z]);

// Identity functions for XYZ to XYZ and linear XYZ conversions
export const xyzToXyzD65 = (x, y, z) => [x, y, z];
export const xyzD65ToXyz = (x, y, z) => [x, y, z];


