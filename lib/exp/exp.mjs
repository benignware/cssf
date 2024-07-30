/**
 * returns the mathematical constant e raised to the power of the given number.
 */
import pow from '../pow/pow.mjs';

function exp(a) {
  return pow(Math.E, a);
}

export default exp;