// a98-rgb.mjs
import { matrixMultiply, clamp } from './utils.mjs';
import { srgbLinearToSrgb, srgbToSrgbLinear } from './rgb.mjs';

// Updated A98-RGB Color Space Matrices
const A98RgbToXyzMatrix = [
  [0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
  [0.29734497525053605, 0.6273635662554661, 0.07529145849499719],
  [0.02703136138641234, 0.07068885253582723, 0.9913375368376388]
];

const XyzToA98RgbMatrix = [
  [2.0415879038107465, -0.5650069742788596, -0.34473135077832956],
  [-0.9692436362808795, 1.8759675015077202, 0.04155505740717559],
  [0.013444280632031142, -0.11836239223101838, 1.0151749933068696]
];

// Convert from A98-RGB to linear XYZ
const a98RgbToXyzLinear = (r, g, b) => {
  // Convert A98-RGB to XYZ
  let [x, y, z] = matrixMultiply(A98RgbToXyzMatrix, [r, g, b]);
  
  // Clamp values to the valid range for XYZ
  return [clamp(x, 0, 1), clamp(y, 0, 1), clamp(z, 0, 1)];
};

// Convert from linear XYZ to A98-RGB
const xyzToA98RgbLinear = (x, y, z) => {
  // Clamp XYZ values to the valid range
  [x, y, z] = [clamp(x, 0, 1), clamp(y, 0, 1), clamp(z, 0, 1)];
  
  // Convert XYZ to A98-RGB
  return matrixMultiply(XyzToA98RgbMatrix, [x, y, z]);
};

// Convert A98-RGB to linear RGB (sRGB)
export const a98RgbToXyz = (r, g, b) => {
  return a98RgbToXyzLinear(...srgbToSrgbLinear(r, g, b));
};

// Convert linear RGB (sRGB) to A98-RGB
export const xyzToA98Rgb = (x, y, z) => {
  return srgbLinearToSrgb(...xyzToA98RgbLinear(x, y, z));
};
