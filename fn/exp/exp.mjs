/**
 * returns the mathematical constant e raised to the power of the given number.
 */
import { pow } from '../pow/pow.mjs';

export function exp(a) {
  return pow(Math.E, a);
}