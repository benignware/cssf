import not from '../not/not.mjs';
import lt from '../lt/lt.mjs';

/**
 * Determines if a is greater than or equal to b.
 * @param {*} a A numerical expression
 * @param {*} b Another numerical expression
 * @returns {string} A css expression that resolves either to 0 or 1
 */
function gte(a, b) {
  return not(lt(a, b));
}

export default gte;
