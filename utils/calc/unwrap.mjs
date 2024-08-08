import { isNumber } from './number.mjs';
import { stripCalc } from './stripCalc.mjs';

export const unwrap = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  const unwrapped = stripCalc(input);

  if (!isNaN(Number(unwrapped))) {
    return Number(unwrapped);
  }

  if (isNumber(unwrapped)) {
    return unwrapped;
  }

  input = input.replace(/^\((.*)\)$/, '$1');

  return input;
}