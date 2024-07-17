import { computer, memoize } from '../utils.mjs';

const _multiply = memoize(computer('*'));

/**
 * Computes the product of numbers.
 * @param {(string|number)} a A numerical expression
 * @param {...(string|number)} b Another numerical expression
 * @returns {(string|number)} The product of the given numbers or equivalent css expression
 */
function multiply(a, ...b) {
  return _multiply(a, ...b);
}

export default multiply;
