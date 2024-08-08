// Importing required functions from xyz.mjs
import { xyzD50ToXyzD65, xyzD65ToXyzD50 } from './xyz.mjs';

// Constants for XYZ to LAB conversion (D65 illuminant)
const XYZ_D65_REF = [0.95047, 1.00000, 1.08883];

// Constants for XYZ to LAB conversion (D50 illuminant)
const XYZ_D50_REF = [0.96422, 1.00000, 0.82521];

// Helper functions for LAB conversion
const f = (t) => t > 0.008856 ? Math.pow(t, 1/3) : (t * 7.787) + (16 / 116);
const pivotXYZ = (value) => value / 100;

// Function to convert XYZ (D65) to LAB (D65)
export const xyzToLab = (x, y, z) => {
  x = pivotXYZ(x) / XYZ_D65_REF[0];
  y = pivotXYZ(y) / XYZ_D65_REF[1];
  z = pivotXYZ(z) / XYZ_D65_REF[2];

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return [
    (116 * fy) - 16,
    500 * (fx - fy),
    200 * (fy - fz)
  ];
};

// Function to convert LAB (D65) to XYZ (D65)
export const labToXyz = (l, a, b) => {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const x = XYZ_D65_REF[0] * (Math.pow(fx, 3) > 0.008856 ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787);
  const y = XYZ_D65_REF[1] * (Math.pow(fy, 3) > 0.008856 ? Math.pow(fy, 3) : (fy - 16 / 116) / 7.787);
  const z = XYZ_D65_REF[2] * (Math.pow(fz, 3) > 0.008856 ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787);

  return [x, y, z];
};

// Function to convert LAB (D50) to XYZ (D50)
export const labD50ToXyz = (l, a, b) => {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const x = XYZ_D50_REF[0] * (Math.pow(fx, 3) > 0.008856 ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787);
  const y = XYZ_D50_REF[1] * (Math.pow(fy, 3) > 0.008856 ? Math.pow(fy, 3) : (fy - 16 / 116) / 7.787);
  const z = XYZ_D50_REF[2] * (Math.pow(fz, 3) > 0.008856 ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787);

  return [x, y, z];
};

// Function to convert XYZ (D50) to LAB (D50)
export const xyzToLabD50 = (x, y, z) => {
  x = pivotXYZ(x) / XYZ_D50_REF[0];
  y = pivotXYZ(y) / XYZ_D50_REF[1];
  z = pivotXYZ(z) / XYZ_D50_REF[2];

  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return [
    (116 * fy) - 16,
    500 * (fx - fy),
    200 * (fy - fz)
  ];
};

// Function to convert LAB (D50) to LAB (D65)
export const labD50ToLabD65 = (l, a, b) => {
  // Convert LAB (D50) to XYZ (D50)
  const [xD50, yD50, zD50] = labD50ToXyz(l, a, b);
  // Convert XYZ (D50) to XYZ (D65)
  const [xD65, yD65, zD65] = xyzD50ToXyzD65(xD50, yD50, zD50);
  // Convert XYZ (D65) to LAB (D65)
  return xyzToLab(xD65, yD65, zD65);
};

// Function to convert LAB (D65) to LAB (D50)
export const labD65ToLabD50 = (l, a, b) => {
  // Convert LAB (D65) to XYZ (D65)
  const [xD65, yD65, zD65] = labToXyz(l, a, b);
  // Convert XYZ (D65) to XYZ (D50)
  const [xD50, yD50, zD50] = xyzD65ToXyzD50(xD65, yD65, zD65);
  // Convert XYZ (D50) to LAB (D50)
  return xyzToLabD50(xD50, yD50, zD50);
};

// Aliases for D65 conversions
export const xyzToLabD65 = xyzToLab;
export const labD65ToXyz = labToXyz;

