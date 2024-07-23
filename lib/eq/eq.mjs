import not from '../not/not.mjs';
import and from '../and/and.mjs';
import gt from '../gt/gt.mjs';
import lt from '../lt/lt.mjs';
import { stripCalc } from '../utils.mjs';

// const shf = 4.9406564584124654e-322;

/**
 * Applies arithmetic equality operation.
 * @param {number} a Some numerical input
 * @param  {...number} b Some other numerical input
 * @returns {number} A css expression representing either 0 or 1
 */
export default function eq(a, b) {
  a = stripCalc(a);
  b = stripCalc(b);

  const v = `(${b} - ${a})`;
  // const s = `1 - clamp(0, ${v} / ${shf}, 1)`;

  // return s;

  return `${and(not(gt(a, b)), not(lt(a, b)))}`;
}
