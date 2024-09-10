// lch.mjs
// import { pow } from "../../../../fn/pow/pow.mjs";
// import { sqrt } from "../../../../fn/sqrt/sqrt.mjs";

// Convert LAB to LCH
export const labToLch = (L, a, b) => {
  const a2 = `pow(${a}, 2)`;
  const b2 = `pow(${b}, 2)`;
  const C = `sqrt(${a2} + ${b2})`;
  let H = `atan2(${b}, ${a}) * (180 / pi)`;
  H = `mod((${H} + 360), 360)`; // Ensure H is within [0, 360)

  return [L, C, H];
};

// Convert LCH to LAB
export const lchToLab = (L, C, H) => {
  const hRad = `(${H} * pi) / 180`;
  const a = `(${C} * cos(${hRad}))`;
  const b = `(${C} * sin(${hRad}))`;
  return [L, a, b];
};
