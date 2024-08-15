import { stripCalc } from '../../utils/calc/stripCalc.mjs';
import { mod } from '../mod/mod.mjs';

// export const rem = (x, y) => {
//   if (isNumber(x) && isNumber(y)) {
//     const divisor = max(0, number(y)); // Prevent division by zero
//     if (divisor === 0) return 'NaN'; // Gracefully handle division by zero
//     return `${number(x) % divisor}${unit(y)}`;
//   }
//   return `rem(${x}, ${y})`;
// };

/**
 * Determines modulus of a and b.
 * @param {(string|number)} a A numerical expression
 * @param {(string|number)} b Another numerical expression
 * @returns {string} A css expression representing modulus of given numbers
 */
// export function rem(a, b) {
//   const c = `(${a}) / (${b})`;
//   // const i = round('down', c);
//   const i = round('down', c);
//   const result = `((${a}) - (${b}) * (${i}))`;

//   return result;
// }


export const rem = (x, y) => {
  x = stripCalc(x);
  y = stripCalc(y);

  // const d = `max(0, ${y})`;
  const r = mod(x, y);

  return r;
}