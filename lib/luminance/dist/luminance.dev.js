"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('..'),
    rgba = _require.rgba,
    add = _require.add,
    multiply = _require.multiply,
    divide = _require.divide,
    ifelse = _require.ifelse,
    lte = _require.lte;

var _require2 = require('../utils'),
    parseFn = _require2.parseFn; // const E = Math.E;
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


var gcd = function gcd(a, b) {
  return b ? gcd(b, a % b) : a;
}; // function decimalToFraction(_decimal) {
//   const top = _decimal.toString().replace(/\d+[.]/, '');
//   const bottom = Math.pow(10, top.length);
//   if (_decimal > 1) {
//     top = +top + Math.floor(_decimal) * bottom;
//   }
//   var x = gcd(top, bottom);
//   return [top / x, bottom / x];
// }


var fr = function fr(fraction) {
  var denominator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;
  var numerator = fraction * denominator;
  var n = gcd(numerator, denominator);
  return [numerator / n, denominator / n];
}; // Usage
// const [numerator, numerator] = toLowestFraction(0.123);
// https://stackoverflow.com/questions/9799041/efficient-implementation-of-natural-logarithm-ln-and-exponentiation
// const ln = (x) =>
//   -1.7417939 +
//   (2.8212026 + (-1.4699568 + (0.44717955 - 0.056570851 * x) * x) * x) * x;
// const nthRoot = (x, n) => {
//   console.log('nth root...', x, 1 / n);
//   return exp((1 / n) * ln(x));
// };


function nthRoot(num) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var prec = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;
  var x = 1; // Initial guess.

  for (var i = 0; i < prec; i++) {
    // console.log('nhtroot--->', x);
    // x = (1 / n) * ((n - 1) * x + num / pow(x, n - 1));
    x = multiply(1 / n, add(multiply(n - 1, x), divide(num, pow(x, n - 1))));
  }

  return x;
} // function pow(base, exponent = 2) {
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
  var _int = Math.floor(exponent); // console.log('POW: ', exponent, int, exponent === int, m, n);


  if (exponent === _int) {
    var product = 1;

    for (var i = 0; i < _int; i++) {
      product = multiply(product, base);
    }

    return product;
  }

  var _fr = fr(exponent),
      _fr2 = _slicedToArray(_fr, 2),
      m = _fr2[0],
      n = _fr2[1]; // console.log('x..', m, n, base);


  var root = nthRoot(base, n);
  var result = pow(root, m);
  return result;
} // console.log('ln: ', 0.4 / 1);
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


var luminances = Array.from(Array(255).keys()).map(function (value) {
  return Math.pow((value / 255 + 0.055) / 1.055, 2.4);
}); // function conditional(_var, ...values) {
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
  var d = divide(colorChannel, 255);
  var l = lte(colorChannel, 0.04045 * 255);
  var a = divide(add(d, 0.055), 1.055); // console.log(
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

  var r = ifelse(l, divide(d, 12.92), pow(a, 2.4)); // console.log('EVAL: ', evaluate(r));

  return r; // if (colorChannel <= 0.04045 * 255) {
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
  var _parseFn$slice = parseFn(rgba(color)).slice(1),
      _parseFn$slice2 = _slicedToArray(_parseFn$slice, 3),
      r = _parseFn$slice2[0],
      g = _parseFn$slice2[1],
      b = _parseFn$slice2[2]; // console.log('GET L: ', evaluate(r), evaluate(g), evaluate(b));
  // const Y =
  //   0.2126 * sRGBtoLin(r) + 0.7152 * sRGBtoLin(g) + 0.0722 * sRGBtoLin(b);
  // console.log('RL...');


  var rl = sRGBtoLin(r); // console.log('GL...');

  var gl = sRGBtoLin(g); // console.log('BL...');

  var bl = sRGBtoLin(b); // console.log('L: ', evaluate(rl), evaluate(gl), evaluate(bl));
  // const rx = `0.2126 * ${rl}`;
  // const gx = `0.7152 * ${gl}`;
  // const bx = `0.0722 * ${bl}`;

  var rx = multiply(0.2126, rl);
  var gx = multiply(0.7152, gl);
  var bx = multiply(0.0722, bl); // console.log('X: ', evaluate(rx), evaluate(gx), evaluate(bx));
  // const Y = `${rx} + ${gx} + ${bx}`;
  // const Y = add(add(rx, gx), bx);
  // console.log(
  //   '--------------- add ',
  //   evaluate(rx),
  //   evaluate(gx),
  //   evaluate(rx) + evaluate(gx)
  // );

  var Y = add(add(rx, gx), bx); // const Y = add(
  //   add(multiply(0.2126, rl), multiply(0.7152, gl)),
  //   multiply(0.0722, bl)
  // );
  // console.log('Y: ', evaluate(Y));

  return Y;
}

module.exports = luminance;