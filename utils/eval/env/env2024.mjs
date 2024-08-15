import { number, isNumber, unit } from '../../calc/number.mjs';
import { compute } from '../../calc/compute.mjs';
import { parseArgs } from '../../ast/parseArgs.mjs';
import { max } from './env2022.mjs';

export * from './env2023.mjs';

const divide = compute('/');
const multiply = compute('*');

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

const ROUNDING_STRATEGIES = ['up', 'down', 'nearest'];

export function round(roundingStrategy, valueToRound, roundingInterval = 1) {
  const args = parseArgs(`${[...arguments].join(', ')}`);
  
  roundingStrategy = args.find(arg => ROUNDING_STRATEGIES.includes(arg));
  [valueToRound, roundingInterval] = roundingStrategy ? args.slice(1) : args;

  roundingStrategy = roundingStrategy || 'nearest';
  roundingInterval = roundingInterval || 1;

  const interval = max(Math.abs(number(roundingInterval)), 0.0001); // Use a small positive value if roundingInterval is zero

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
