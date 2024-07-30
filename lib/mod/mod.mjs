import round from '../round/round.mjs';

/**
 * Determines modulus of a and b.
 * @param {(string|number)} a A numerical expression
 * @param {(string|number)} b Another numerical expression
 * @returns {string} A css expression representing modulus of given numbers
 */
function mod(a, b) {
  const c = `(${a}) / (${b})`;
  const f = `round('down', ${c})`;
  const r = `calc( ${a} - ${b} * ${f} )`;

  return r;
}

export default mod;