import not from '../not/not.mjs';
import and from '../and/and.mjs';
import gt from '../gt/gt.mjs';
import lt from '../lt/lt.mjs';

/**
 * Applies arithmetic equality operation.
 * @param {number} a Some numerical input
 * @param  {...number} b Some other numerical input
 * @returns {number} A css expression representing either 0 or 1
 */
export default function eq(a, b) {
  return `${and(not(gt(a, b)), not(lt(a, b)))}`;
}
