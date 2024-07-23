import { stripCalc } from "../utils.mjs";
import pow from "../pow/pow.mjs";
import sqrt from "../sqrt/sqrt.mjs";

/**
 * The hypot() CSS function is an exponential function that returns the square root of the sum of squares of its parameters.
 * 
 * While pow() and sqrt() only work on unitless numbers, hypot() accepts values with units, but they all must have the same type.
 * 
 * @param  {...string} values - The values to be evaluated.
 * @returns {string} The result of the hypot function.
 */
function hypot(...values) {
  const result = values.reduce((acc, value) => {
    return `(${acc} + ${pow(stripCalc(value), 2)})`;
  }, 0);

  return sqrt(result);
}

export default hypot;