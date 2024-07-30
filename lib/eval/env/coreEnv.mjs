import { parseArgs, unit, computer, memoize, isNumber, number } from '../../utils.mjs';

export const add = memoize(computer('+'));
export const subtract = memoize(computer('-'));
export const multiply = memoize(computer('*'));
export const divide = memoize(computer('/'));

export const calc = (expression) => expression;

export const _join = (delimiter, ...items) => items.join(delimiter);

export const min = (...values) => {
  const u = values.map((value) => unit(value)).filter((u) => u && u !== '%')[0] || '';
  const v = String(Math.min(...values.map((value) => parseFloat(value))));

  return v + u;
};

export const max = (...values) => {
  const u = values.map((value) => unit(value)).filter((u) => u && u !== '%')[0] || '';
  const v = String(Math.max(...values.map((value) => parseFloat(value))));

  return v + u;
};

export const clamp = (() => {
  const _min = min;
  const _max = max;

  return (min, value, max) => _max(min, _min(value, max));
})();

export const pi = Math.PI;

export const NaN = Number.NaN;

export const infinity = Infinity;

export const e = Math.E;

// const getMathFn = (fn) => {
//   console.log('fn name: ', fn.name);
//   // degrees * (pi/180);
//   return (...args) => {
//     return `${fn(...args.map((arg) => number(arg)))}${unit(args[0])}`;
//   };
// }


export const exp = (x) => Math.exp(number(x));

export const sqrt = (x) => Math.sqrt(number(x));

export const pow = (x, y) => Math.pow(x, y);

export const sin = (x) => Math.sin(number(x));

export const cos = (x) => Math.cos(number(x));

export const tan = (x) => Math.tan(number(x));

export const asin = (x) => Math.asin(number(x));

export const acos = (x) => Math.acos(number(x));

export const atan = (x) => Math.atan(number(x));

export const atan2 = (y, x) => Math.atan2(y, x);

// export const mod = (x, y) => Math.mod(x, y);

// TODO: Account for relative units: margin: rem(1000px, 29rem); /* 72px - if root font-size is 16px */
export const rem = (x, y) => isNumber(x) && isNumber(y) ? `${number(x) % number(y)}${unit(y)}` : `rem(${x}, ${y})`;

export const mod = (x, y) => isNumber(x) && isNumber(y) ? `${number(x) % number(y)}${unit(y)}` : `mod(${x}, ${y})`;

export const abs = (x) => Math.abs(number(x));

export const sign = (x) => Math.sign(number(x));

export const log = (x, base = e) => Math.log(x) / Math.log(base);

export const hypot = (...values) => Math.hypot(...values);

const ROUNDIND_STRATEGIES = ['up', 'down', 'nearest'];

export function round(roundingStrategy, valueToRound, roundingInterval = 1) {
  const args = parseArgs(`${[...arguments].join(', ')}`);

  roundingStrategy = args.find((arg) => ROUNDIND_STRATEGIES.includes(arg));
  [valueToRound, roundingInterval] = roundingStrategy ? args.slice(1) : args;

  roundingStrategy = roundingStrategy || 'nearest';
  roundingInterval = roundingInterval || 1;

  if (roundingInterval <= 0) {
      throw new Error("roundingInterval must be greater than 0");
  }

  const roundingFn = {
    nearest: Math.round,
    down: Math.floor,
    up: Math.ceil,
  }[roundingStrategy];

  const x = divide(valueToRound, roundingInterval);
  const y = roundingFn(x);
  
  const result = multiply(y, roundingInterval);

  return result;
}


