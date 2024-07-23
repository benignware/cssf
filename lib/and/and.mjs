import { stripCalc } from '../utils.mjs';

/**
 * Applies arithmetic "and" operation.
 * @param {(number|string)} a A css expression that resolves to either 0 or 1
 * @param {(number|string)} b Another css expression that resolves to either 0 or 1
 * @returns {string} A css expression that resolves to either 0 or 1
 */
export default function and(a, b) {
  a = stripCalc(a);
  b = stripCalc(b);

  return `calc(
    min((${a}) * (${b}), 1)
  )`;
}
