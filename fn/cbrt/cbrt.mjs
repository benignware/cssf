/**
 * Computes the cube root of a number.
 * 
 * @param {number} value - The number to be evaluated.
 * @returns {number} The result of the square root.
 */

import { pow } from "../pow/pow.mjs";
import { ifelse } from "../ifelse/ifelse.mjs";
import { eq } from "../eq/eq.mjs";

export function cbrt(x) {
  return ifelse(eq(x, 0), 0, `pow(${x}, 1 / 3)`);
}

