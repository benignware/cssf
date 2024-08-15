import { stripCalc } from '../../utils/calc/stripCalc.mjs';

/**
 * Applies arithmetic "and" operation.
 * @param {(number|string)} a A css expression that resolves to either 0 or 1
 * @param {(number|string)} b Another css expression that resolves to either 0 or 1
 * @returns {string} A css expression that resolves to either 0 or 1
 */
export function and(a, b) {
  a = stripCalc(a);
  b = stripCalc(b);

  // return `min((${a}) * (${b}), 1))`;

  return `calc((${a}) * (${b}))`;
}
