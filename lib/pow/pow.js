const add = require('../add');
const multiply = require('../multiply');
const divide = require('../divide');
const { stripCalc } = require('../utils');

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

const fr = (fraction, denominator = 100) => {
  const numerator = fraction * denominator;
  const n = gcd(numerator, denominator);

  return [numerator / n, denominator / n];
};

function nthRoot(num, n = 2, prec = 4) {
  let x = 1;

  for (var i = 0; i < prec; i++) {
    x = multiply(1 / n, add(multiply(n - 1, x), divide(num, pow(x, n - 1))));
  }

  return x;
}

/**
 * Returns a number raised to the power of an exponent.
 * Rather expensive, so try to avoid.
 * @param {*} base A numerical expression
 * @param {number} exponent A static number that may be a decimal
 * @param {number} precision The precision at which fractional exponent is applied
 * @returns {string} A numerical expression that resolves to the power of given base and exponent
 */
function pow(base, exponent, precision = 5) {
  base = stripCalc(base);
  const int = Math.floor(exponent);
  const remainder = Number((exponent - int).toFixed(2));

  let product = 1;

  for (let i = 0; i < int; i++) {
    product = multiply(product, base);
  }

  if (remainder > 0) {
    const [m, n] = fr(remainder);
    const root = nthRoot(base, n, precision);
    const p = pow(root, m);

    product = multiply(product, p);
  }

  return product;
}

module.exports = pow;
