import { stripCalc } from '../utils.mjs';

/**
 * Determines if a is greater than b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
function gt(a, b) {
  const l = 0.00000000000001;

  a = stripCalc(a);
  b = stripCalc(b);

  const v = `(${a} - ${b})`;
  const s = `clamp(0, ${v} / ${l}, 1)`;

  return s;
}

export default gt;
