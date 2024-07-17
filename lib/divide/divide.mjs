import { computer, memoize } from '../utils.mjs';

const _divide = memoize(computer('/'));

/**
 * Divides a numerical value by another.
 * @param {number} a A number
 * @param  {...number} b Any other numbers
 * @returns {(number|string)} The quotient of the given numbers
 */
function divide(a, ...b) {
  return _divide(a, ...b);
}

export default divide;
