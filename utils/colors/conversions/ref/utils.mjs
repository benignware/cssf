// Utility Functions
export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

// Matrix Multiplication Helper
export const matrixMultiply = (matrix, vector) => {
  if (!Array.isArray(matrix) || !Array.isArray(vector) || matrix.length !== 3 || vector.length !== 3) {
    throw new TypeError('Both matrix and vector must be arrays of appropriate size');
  }

  return matrix.map(row => row.reduce((sum, value, i) => sum + value * vector[i], 0));
};
