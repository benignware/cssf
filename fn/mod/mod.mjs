import { stripCalc } from '../../utils/calc/stripCalc.mjs';
import { eq } from '../eq/eq.mjs';
import { ifelse } from '../ifelse/ifelse.mjs';
import { round } from '../round/round.mjs';

/**
 * Determines modulus of a and b.
 * @param {(string|number)} a A numerical expression
 * @param {(string|number)} b Another numerical expression
 * @returns {string} A css expression representing modulus of given numbers
 */
export function mod(a, b) {
  a = stripCalc(a);
  b = stripCalc(b);

  const c = `(${a}) / (${b})`;
  const f = round('down', c);
  let r = `( ${a} - ${b} * ${f} )`;

  // r = ifelse(eq(b, 0), 0/0, r);

  return r;
}