/**
 * Computes the square root of a number.
 * 
 * @param {number} value - The number to be evaluated.
 * @returns {number} The result of the square root.
 */

import pow from "../pow/pow.mjs";

function sqrt(value) {
  return pow(value, 0.5);
}

export default sqrt;
