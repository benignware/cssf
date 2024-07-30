import { stripCalc } from '../utils.mjs';

/**
 * Resolves arithmetic expression based on a condition.
 * @param {(string|number)} condition A numerical expression that resolves to 0 or 1
 * @param {(string|number)} a A numerical expression
 * @param {(string|number)} b Another numerical expression
 * @returns {string} Resolves to either a or b whether the given condition is met
 */
function ifelse(condition, a, b) {
  // condition = stripCalc(condition);
  // a = stripCalc(a);
  // b = stripCalc(b);

  // // return `( ( (${a}) * (${condition}) ) + ( (${b}) * ( 1 - (${condition}) ) ) )`;

  return `(
    ( 
      (${a}) * (${condition})
    ) + (
      (${b}) * ( 1 - (${condition}) )
    )
  )`;
  condition = stripCalc(condition);
  a = stripCalc(a);
  b = stripCalc(b);

  return `(((${a}) * (${condition})) + ((${b}) * (1 - (${condition}))))`;
}

export default ifelse;
