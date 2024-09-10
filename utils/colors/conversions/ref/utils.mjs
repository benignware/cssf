// Gamma correction constants
const GAMMA = 2.4;
const GAMMA_CORRECT_THRESHOLD = 0.04045;

// Utility Functions
export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

// Matrix Multiplication Helper
export const matrixMultiply = (matrix, vector) => {
  if (!Array.isArray(matrix) || !Array.isArray(vector) || matrix.length !== 3 || vector.length !== 3) {
    throw new TypeError('Both matrix and vector must be arrays of appropriate size');
  }

  return matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
};


// Helper function to apply gamma correction
export const applyGammaCorrection = (c, toLinear) =>
  toLinear
    ? (c <= GAMMA_CORRECT_THRESHOLD ? c / 12.92 : Math.pow((c + 0.055) / 1.055, GAMMA))
    : (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / GAMMA) - 0.055);