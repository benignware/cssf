// rec2020.mjs
import { matrixMultiply, clamp } from './utils.mjs';
import { srgbLinearToSrgb, srgbToSrgbLinear } from './rgb.mjs';

const XyzToRec2020Matrix = [
  [1.716651, -0.355670, -0.253366],
  [-0.666684, 1.616481, 0.015768],
  [0.017642, -0.042779, 0.941965]
];

const Rec2020ToXyzMatrix = [
  [0.636958, 0.144617, 0.168881],
  [0.262700, 0.677993, 0.059307],
  [0.000000, 0.028897, 1.060987]
];

// Convert from Rec.2020 to linear XYZ
const rec2020ToXyzLinear = (r, g, b) => {
  const [x, y, z] = matrixMultiply(Rec2020ToXyzMatrix, [r, g, b]);
  return [clamp(x, 0, 1), clamp(y, 0, 1), clamp(z, 0, 1)];
};

// Convert from linear XYZ to Rec.2020
const xyzToRec2020Linear = (x, y, z) => {
  [x, y, z] = [x, y, z].map(value => clamp(value, 0, 1));
  return matrixMultiply(XyzToRec2020Matrix, [x, y, z]);
};

// Convert Rec.2020 to linear RGB (sRGB)
export const rec2020ToXyz = (r, g, b) => {
  return rec2020ToXyzLinear(...srgbToSrgbLinear(r, g, b));
};

// Convert linear RGB (sRGB) to Rec.2020
export const xyzToRec2020 = (x, y, z) => {
  return srgbLinearToSrgb(...xyzToRec2020Linear(x, y, z));
};
