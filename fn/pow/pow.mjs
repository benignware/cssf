import { stripCalc } from '../../utils/calc/stripCalc.mjs';
import { compute } from '../../utils/calc/compute.mjs';
import { round } from '../round/round.mjs';

const add = compute('+');
const multiply = compute('*');
const divide = compute('/');
const subtract = compute('-');

// const gcd = (a, b) => (b ? gcd(b, a % b) : a);

const gcd = (a, b) => {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
};

const fr = (fraction, denominator = 100) => {
  const numerator = multiply(fraction, denominator);
  const n = gcd(numerator, denominator);

  return [divide(numerator, n), divide(denominator, n)];
};


// function nthRoot(num, n = 2, prec = 4) {
//   let x = 1;

//   for (var i = 0; i < prec; i++) {
//     x = multiply(
//       divide(1, n),
//       add(
//         multiply(
//           subtract(n, 1),
//           x
//         ),
//         divide(num,
//           pow(x, subtract(n, 1))
//         )
//       )
//     );
//   }

//   return x;
// }

function nthRoot(num, n = 2, prec = 4) {
  let x = 1;

  for (let i = 0; i < prec; i++) {
    const xToPowerNMinus1 = pow(x, subtract(n, 1));
    x = multiply(
      divide(1, n),
      add(
        multiply(subtract(n, 1), x),
        divide(num, xToPowerNMinus1)
      )
    );
  }

  return x;
}


/**
 * Returns the value of a base raised to the power of a number.
 * 
 * Rather expensive, so try to avoid.
 * @param {*} base A numerical expression
 * @param {number} exponent A static number that may be a decimal
 * @param {number} precision The precision at which fractional exponent is applied
 * @returns {string} A numerical expression that resolves to the power of given base and exponent
 */
export function pow(base, exponent, precision = 5) {
  base = stripCalc(base);
  // const int = round('down', exponent);
  const int = Math.floor(exponent);
  const remainder = Number((exponent - int).toFixed(precision));

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

// export function pow(base, exponent, precision = 5) {
//   base = stripCalc(base);
//   const intPart = round(exponent);
//   const fracPart = Number((exponent - intPart).toFixed(precision));

//   let product = 1;

//   // Integer part
//   for (let i = 0; i < intPart; i++) {
//     product = multiply(product, base);
//   }

//   // Fractional part
//   if (fracPart > 0) {
//     const [numerator, denominator] = fr(fracPart);
//     const root = nthRoot(base, denominator, precision);
//     const fractionalPower = pow(root, numerator);

//     product = multiply(product, fractionalPower);
//   }

//   return product;
// }

