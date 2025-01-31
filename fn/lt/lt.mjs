import { stripCalc } from '../../utils/calc/stripCalc.mjs';

/**
 * Determines if a is lesser than b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
export function lt(a, b) {
  const l = 0.00000000000001;
  const epsilon = 1e-20;

  a = stripCalc(a);
  b = stripCalc(b);

  const v = `((${b}) - (${a}))`;
  const s = `clamp(0, ${v} / ${epsilon}, 1)`;
  // const s = `${v} / ${l}`;
  // return 1;

  return s;
}
