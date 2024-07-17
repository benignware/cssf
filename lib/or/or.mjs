import not from '../not/not.mjs';
import and from '../and/and.mjs';

/**
 * Applies arithmetic "or" operation.
 * @param {(number|string)} a A css expression that resolves to either 0 or 1
 * @param {(number|string)} b Another css expression that resolves to either 0 or 1
 * @returns {string} A css expression that resolves to either 0 or 1
 */
function or(a, b) {
  return not(and(not(a), not(b)));
}

export default or;
