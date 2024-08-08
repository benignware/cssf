import { compute } from '../calc/compute.mjs';
import { parseArgs } from '../ast/parseArgs.mjs';
import { isNumber, number, unit } from '../calc/number.mjs';

const add = compute('+');
const subtract = compute('-');
const multiply = compute('*');
const divide = compute('/');

export const min = (...values) => {
  const u = values
    .map(value => unit(value))
    .filter(u => u && u !== '%')[0] || '';
  const v = String(Math.min(...values.map(value => parseFloat(value))));

  return v + u;
};

export const max = (...values) => {
  const u = values
    .map(value => unit(value))
    .filter(u => u && u !== '%')[0] || '';
  const v = String(Math.max(...values.map(value => parseFloat(value))));

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

export const exp = x => Math.exp(number(x));

export const sqrt = x => {
  const num = number(x);
  return num >= 0 ? Math.sqrt(num) : NaN;
};

export const pow = (x, y) => Math.pow(number(x), number(y));

export const sin = x => Math.sin(number(x));

export const cos = x => Math.cos(number(x));

export const tan = x => Math.tan(number(x));

export const asin = x => Math.asin(number(x));

export const acos = x => Math.acos(number(x));

export const atan = x => Math.atan(number(x));

export const atan2 = (y, x) => Math.atan2(number(y), number(x));

export const rem = (x, y) => {
  if (isNumber(x) && isNumber(y)) {
    const divisor = max(0, number(y)); // Prevent division by zero
    if (divisor === 0) return 'NaN'; // Gracefully handle division by zero
    return `${number(x) % divisor}${unit(y)}`;
  }
  return `rem(${x}, ${y})`;
};

export const mod = (x, y) => {
  if (isNumber(x) && isNumber(y)) {
    const divisor = max(0, number(y)); // Prevent division by zero
    if (divisor === 0) return 'NaN'; // Gracefully handle division by zero
    return `${number(x) % divisor}${unit(y)}`;
  }
  return `mod(${x}, ${y})`;
};

export const abs = x => Math.abs(number(x));

export const sign = x => {
  const num = number(x);
  return isNaN(num) ? 'NaN' : Math.sign(num);
};

export const log = (x, base = e) => {
  const num = number(x);
  const b = number(base);
  if (num <= 0 || b <= 0 || b === 1) return 'NaN'; // Gracefully handle invalid log inputs
  return Math.log(num) / Math.log(b);
};

const ROUNDING_STRATEGIES = ['up', 'down', 'nearest'];

export function round(roundingStrategy, valueToRound, roundingInterval = 1) {
  const args = parseArgs(`${[...arguments].join(', ')}`);
  
  roundingStrategy = args.find(arg => ROUNDING_STRATEGIES.includes(arg));
  [valueToRound, roundingInterval] = roundingStrategy ? args.slice(1) : args;

  roundingStrategy = roundingStrategy || 'nearest';
  roundingInterval = roundingInterval || 1;

  const interval = Math.max(Math.abs(number(roundingInterval)), 0.0001); // Use a small positive value if roundingInterval is zero

  const roundingFn = {
    nearest: Math.round,
    down: Math.floor,
    up: Math.ceil,
  }[roundingStrategy];

  const x = divide(valueToRound, interval);
  const y = roundingFn(x);
  const result = multiply(y, interval);

  return result;
}
