// display-p3.mjs
import { matrixMultiply, clamp } from './utils.mjs';
import { srgbLinearToSrgb, srgbToSrgbLinear } from './rgb.mjs';

// Updated Display P3 Color Space Matrices
const DisplayP3ToXyzMatrix = [
  [0.4865709486482162, 0.26566769316909306, 0.1982172852343625],
  [0.2289745640697488, 0.6917385218365064, 0.079286914093745],
  [0.000000, 0.04511338185890264, 1.043944368900976]
];

const XyzToDisplayP3Matrix = [
  [2.493496911941425, -0.9313836179191239, -0.40271078445071684],
  [-0.8294889695615747, 1.7626640603183463, 0.023624685841943577],
  [0.03584583024378447, -0.07617238926804182, 0.9568845240076872]
];

// Convert from Display P3 to linear XYZ
const displayP3ToXyzLinear = (r, g, b) => {
  // Convert Display P3 to XYZ
  let [x, y, z] = matrixMultiply(DisplayP3ToXyzMatrix, [r, g, b]);
  
  // Clamp values to the valid range for XYZ
  return [clamp(x, 0, 1), clamp(y, 0, 1), clamp(z, 0, 1)];
};

// Convert from linear XYZ to Display P3
const xyzToDisplayP3Linear = (x, y, z) => {
  // Clamp XYZ values to the valid range
  [x, y, z] = [clamp(x, 0, 1), clamp(y, 0, 1), clamp(z, 0, 1)];
  
  // Convert XYZ to Display P3
  return matrixMultiply(XyzToDisplayP3Matrix, [x, y, z]);
};

// Convert Display P3 to linear RGB (sRGB)
export const displayP3ToXyz = (r, g, b) => {
  return displayP3ToXyzLinear(...srgbToSrgbLinear(r, g, b));
};

// Convert linear RGB (sRGB) to Display P3
export const xyzToDisplayP3 = (x, y, z) => {
  return srgbLinearToSrgb(...xyzToDisplayP3Linear(x, y, z));
};
