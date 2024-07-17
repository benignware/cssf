import { computer, memoize } from '../utils.mjs';

const _subtract = memoize(computer('-'));

/**
 * Computes the difference of numbers.
 * @param {(string|number)} a A numerical expression
 * @param {...(string|number)} b Another numerical expression
 * @returns {(string|number)} The difference of the given numbers or equivalent css expression
 */
function subtract(a, ...b) {
  return _subtract(a, ...b);
}

export default subtract;
