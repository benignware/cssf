// prophoto-rgb.mjs
import { matrixMultiply, clamp } from './utils.mjs';

// Updated Prophoto RGB Color Space Matrices
const ProphotoRgbToXyzMatrix = [
  [0.400284, 0.707504, -0.080810],
  [-0.226365, 1.165313, 0.045853],
  [0.000000, 0.000000, 0.918226]
];

const XyzToProphotoRgbMatrix = [
  [1.345943, -0.255607, -0.051093],
  [-0.544598, 1.508169, 0.020486],
  [0.000000, 0.000000, 1.211812]
];

// Convert from Prophoto RGB to XYZ
export const prophotoRgbToXyz = (r, g, b) => {
  return matrixMultiply(ProphotoRgbToXyzMatrix, [r, g, b]);
};

// Convert from linear XYZ to Prophoto RGB
export const xyzToProphotoRgb = (x, y, z) => {
  return matrixMultiply(XyzToProphotoRgbMatrix, [x, y, z]);
};
