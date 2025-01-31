import { isNumber, number, unit } from './number.mjs';
import { stripCalc } from './stripCalc.mjs';

export const unwrap = (input) => {
  if (typeof input !== 'string') {
    return input;
  }

  let unwrapped = stripCalc(input);
  unwrapped = unwrapped.replace(/^\((.*)\)$/, '$1');

  if (!isNaN(Number(unwrapped))) {
    return Number(unwrapped);
  }

  const n = number(unwrapped);

  if (!isNaN(n)) {
    return unwrapped;
  }

  unwrapped = `(${unwrapped})`;

  return unwrapped;
}

export const wrap = (input) => {
  if (typeof input === 'string') {
    return input;
  }

  return `(${input})`;
}