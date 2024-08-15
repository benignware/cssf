import { not } from '../not/not.mjs';
import { and } from '../and/and.mjs';
import { gt } from '../gt/gt.mjs';
import { lt } from '../lt/lt.mjs';

import { stripCalc } from '../../utils/calc/stripCalc.mjs';

/**
 * Applies arithmetic equality operation.
 * @param {number} a Some numerical input
 * @param  {...number} b Some other numerical input
 * @returns {number} A css expression representing either 0 or 1
 */
export function eq(a, b) {
  a = stripCalc(a);
  b = stripCalc(b);

  return `(${and(not(gt(a, b)), not(lt(a, b)))})`;
}
