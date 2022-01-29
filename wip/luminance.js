const {
  rgba,
  add,
  multiply,
  divide,
  ifelse,
  lte,
  eval: evaluate,
} = require('..');
const { parseFn } = require('../utils');

// const E = Math.E;

// const exp = (x) => {
//   console.log('EXP: ', x);
//   return Math.pow(E, x);
// };

// const ln = (x, epsilon = 1) => {
//   let yn = x - 1; // using the first term of the taylor series as initial-value
//   let yn1 = yn;

//   do {
//     console.log('do...', yn, yn1);
//     yn = yn1;
//     yn1 = yn + (2 * (x - exp(yn))) / (x + exp(yn));
//   } while (Math.abs(yn - yn1) > epsilon);

//   return yn1;
// };

let gcd = (a, b) => {
  return b ? gcd(b, a % b) : a;
};

// function decimalToFraction(_decimal) {
//   const top = _decimal.toString().replace(/\d+[.]/, '');
//   const bottom = Math.pow(10, top.length);

//   if (_decimal > 1) {
//     top = +top + Math.floor(_decimal) * bottom;
//   }
//   var x = gcd(top, bottom);

//   return [top / x, bottom / x];
// }
const fr = (fraction, denominator = 100) => {
  const numerator = fraction * denominator;

  const n = gcd(numerator, denominator);

  return [numerator / n, denominator / n];
};

// Usage
// const [numerator, numerator] = toLowestFraction(0.123);

// https://stackoverflow.com/questions/9799041/efficient-implementation-of-natural-logarithm-ln-and-exponentiation
// const ln = (x) =>
//   -1.7417939 +
//   (2.8212026 + (-1.4699568 + (0.44717955 - 0.056570851 * x) * x) * x) * x;

// const nthRoot = (x, n) => {
//   console.log('nth root...', x, 1 / n);
//   return exp((1 / n) * ln(x));
// };

function nthRoot(num, n = 2, prec = 4) {
  let x = 1; // Initial guess.

  for (var i = 0; i < prec; i++) {
    // console.log('nhtroot--->', x);
    // x = (1 / n) * ((n - 1) * x + num / pow(x, n - 1));
    x = multiply(1 / n, add(multiply(n - 1, x), divide(num, pow(x, n - 1))));
  }

  return x;
}

// function pow(base, exponent = 2) {
//   const int = Math.floor(exponent);
//   // const remainder = Number((exponent - int).toFixed(2));
//   const remainder = exponent - int;

//   let product = 1;

//   for (let i = 0; i < int; i++) {
//     product = multiply(product, base);
//   }

//   if (remainder > 0) {
//     const [x, n] = decimalToFraction(remainder);
//     console.log('remainder: ', remainder, x, n);
//     // const root = Math.pow(base, remainder);
//     const root = nthRoot(x, n);
//     console.log('root: ', root, Math.pow(base, remainder));

//     product = multiply(product, root);
//   }

//   return product;
// }

// const _nthRoot = (x, n) => Math.pow(x, 1 / n);

function pow(base, exponent) {
  const int = Math.floor(exponent);
  // console.log('POW: ', exponent, int, exponent === int);

  if (exponent === int) {
    let product = 1;

    for (let i = 0; i < int; i++) {
      product = multiply(product, base);
    }

    return product;
  }

  const [m, n] = fr(exponent);

  // console.log('x..', m, n, base);

  const root = nthRoot(base, n);

  const result = pow(root, m);

  return result;
}

// console.log('ln: ', 0.4 / 1);

// console.log('nthRoot: ', nthRoot(2, 4), _nthRoot(2, 4));
// console.log('pow: ', pow(2, 2.4), Math.pow(2, 2.4));
// process.exit();

// const nthRoot = (x, n) => {
//   return (x > 1 || x < -1) && n == 0
//     ? Infinity
//     : (x > 0 || x < 0) && n == 0
//     ? 1
//     : x < 0 && n % 2 == 0
//     ? `${Math.pow(x < 0 ? -x : x, 1 / n)}${'i'}`
//     : n == 3 && x < 0
//     ? -Math.cbrt(-x)
//     : x < 0
//     ? -Math.pow(x < 0 ? -x : x, 1 / n)
//     : n == 3 && x > 0
//     ? Math.cbrt(x)
//     : Math.pow(x < 0 ? -x : x, 1 / n);
// };

// console.log('NTH ROOT: ', nthRoot(2, 1));
// process.exit();

// const luminances = Object.assign(
//   {},
//   ...[...Array(255).keys()]
//     .map((value) => value / 255)
//     .map((value) => ({
//       [value]: Math.pow((value + 0.055) / 1.055, 2.4),
//     }))
// );

// const luminances = Array.from(Array(255).keys()).map((value) =>
//   Math.pow((value / 255 + 0.055) / 1.055, 2.4)
// );

// function conditional(_var, ...values) {
//   let result = 'calc(';
//   let i_count = 0;

//   for (let i = 0; i < values.length; i++) {
//     console.log('values...', i);
//     let value = values[i];
//     let multiplier = '';
//     let modifier = 1;
//     let j_count = 0;

//     for (let j = 0; j < values.length - 1; j++) {
//       if (j != i) {
//         j_count = j_count + 1;
//         // We could use just the general multiplier,
//         // but for 0 and 1 we can simplify it a bit.
//         if (j == 0) {
//           modifier = modifier * i;
//           multiplier = multiplier + _var;
//         } else if (j == 1) {
//           modifier = modifier * (j - i);
//           multiplier = multiplier + '(1 - ' + _var + ')';
//         } else {
//           modifier = modifier * (i - j);
//           multiplier = multiplier + '(' + _var + ' - ' + j + ')';
//         }
//         if (j_count < values.length - 1) {
//           multiplier = multiplier + ' * ';
//         }
//       }
//       // If value is zero, just don't add it there lol
//       if (value != 0) {
//         if (modifier != 1) {
//           multiplier = multiplier + ' * ' + 1 / modifier;
//         }
//         result =
//           result + (i_count > 0 ? ' + ' : '') + value + ' * ' + multiplier;
//         i_count = i_count + 1;
//       }
//     }
//     result = result + ')';
//   }

//   console.log('END: ', result);

//   return result;
// }

// console.log('luminances', luminances);

// process.exit();

// Math.pow((colorChannel + 0.055) / 1.055, 2.4)

function sRGBtoLin(colorChannel) {
  // console.log('COLOR CHANNEL: ', colorChannel);
  const d = divide(colorChannel, 255);
  const l = lte(colorChannel, 0.04045 * 255);
  const a = divide(add(d, 0.055), 1.055);
  // console.log(
  //   'color channel...',
  //   colorChannel,
  //   d,
  //   evaluate(l),
  //   evaluate(ifelse(l, 100, 10)),
  //   evaluate(divide(d, 12.92)),
  //   evaluate(a),
  //   evaluate(pow(a, 2))
  // );
  // console.log('DO IT: ', colorChannel, d, l, a);
  const r = ifelse(l, divide(d, 12.92), pow(a, 2.4));

  // console.log('EVAL: ', evaluate(r));

  return r;
  // if (colorChannel <= 0.04045 * 255) {
  //   return divide(divide(colorChannel, 255), 12.92);
  // } else {
  //   console.log('POW..');
  //   // const r = conditional(colorChannel, ...luminances);
  //   // console.log('r: ', evaluate(r));
  //   // return luminances[colorChannel];
  //   const a = divide(add(divide(colorChannel, 255), 0.055), 1.055);

  //   console.log('A: ', a);

  //   return pow(a, 2);
  // }
}

function luminance(color) {
  const [r, g, b] = parseFn(rgba(color)).slice(1);

  // console.log('GET L: ', evaluate(r), evaluate(g), evaluate(b));

  // const Y =
  //   0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);

  // console.log('RL...');
  const rl = sRGBtoLin(r);
  // console.log('GL...');
  const gl = sRGBtoLin(g);
  // console.log('BL...');
  const bl = sRGBtoLin(b);

  // console.log('L: ', evaluate(rl), evaluate(gl), evaluate(bl));

  // const rx = `0.2126 * ${rl}`;
  // const gx = `0.7152 * ${gl}`;
  // const bx = `0.0722 * ${bl}`;
  const rx = multiply(0.2126, rl);
  const gx = multiply(0.7152, gl);
  const bx = multiply(0.0722, bl);

  // console.log('X: ', evaluate(rx), evaluate(gx), evaluate(bx));

  // const Y = `${rx} + ${gx} + ${bx}`;
  // const Y = add(add(rx, gx), bx);
  // console.log(
  //   '--------------- add ',
  //   evaluate(rx),
  //   evaluate(gx),
  //   evaluate(rx) + evaluate(gx)
  // );
  const Y = add(add(rx, gx), bx);

  // const Y = add(
  //   add(multiply(0.2126, rl), multiply(0.7152, gl)),
  //   multiply(0.0722, bl)
  // );

  // console.log('Y: ', evaluate(Y));

  return Y;
}

module.exports = luminance;
