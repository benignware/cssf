import { ifelse } from "../../../../fn/ifelse/ifelse.mjs";
import { lte } from "../../../../fn/lte/lte.mjs";

// Gamma correction constants
const GAMMA = 2.4;
const GAMMA_CORRECT_THRESHOLD = 0.04045;

// Utility Functions
export const clamp = (value, min = 0, max = 1) => `clamp(${value}, ${min}, ${max})`;


// Matrix Multiplication Helper
export const matrixMultiply = (matrix, vector) => {
  if (!Array.isArray(matrix) || !Array.isArray(vector) || matrix.length !== 3 || vector.length !== 3) {
    throw new TypeError('Both matrix and vector must be arrays of appropriate size');
  }

  return matrix.map(row => row.reduce((sum, value, i) => `(${sum} + ${value} * ${vector[i]})`, 0));
};

// Helper function to apply gamma correction
// export const applyGammaCorrection = (c, toLinear) =>
//   toLinear
//     ? (c <= GAMMA_CORRECT_THRESHOLD ? c / 12.92 : Math.pow((c + 0.055) / 1.055, GAMMA))
//     : (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / GAMMA) - 0.055);

export const applyGammaCorrection = (c, toLinear) => {
  // console.log('applyGammaCorrection', c, toLinear);
  c = `abs(${c})`;
  // const linear = `(${c} <= ${GAMMA_CORRECT_THRESHOLD} ? ${c} / 12.92 : pow((${c} + 0.055) / 1.055, ${GAMMA}))`;

  const linear =  ifelse(lte(c, GAMMA_CORRECT_THRESHOLD), `${c} / 12.92`, `pow((${c} + 0.055) / 1.055, ${GAMMA})`);

  // const srgb = `(${c} <= 0.0031308 ? 12.92 * ${c} : 1.055 * pow(${c}, 1 / ${GAMMA}) - 0.055)`;
  const srgb =  ifelse(lte(c, 0.0031308), `12.92 * ${c}`, `1.055 * pow(${c}, 1 / ${GAMMA}) - 0.055`);

  return toLinear ? linear : srgb;
}

