import { number, unit } from './number.mjs';
import { unwrap } from './unwrap.mjs';
import { stripCalc } from './stripCalc.mjs';

export const toUnit = (value, toUnit) => {
  // Check for calc expressions
  // if (typeof value === 'string' && value.startsWith('calc')) {
  //   switch (toUnit) {
  //     case '%':
  //       return `calc(${stripCalc(value)}) * 100%)`;
  //     case 'deg':
  //       return `${n}deg`;
  // }

  const n = number(value);
  const u = unit(value);

  if (u === toUnit) {
    return value;
  }

  // if (isNaN(n) || toUnit === null) {
  //   return value;
  // }

  if (!isNaN(n)) {
    switch (toUnit) {
      case '%':
        return `${n * 100}%`;
      case 'deg':
        return `${n}deg`;
      case 'turn':
        return `${n / 360}turn`;
      default:
        return value; // Default case if unit is unknown
    }
  }

  const unwrapped = unwrap(value);

  switch (toUnit) {
    case '%':
      return `calc(${unwrapped} * 100%)`;
    case 'deg':
      return `calc(${unwrapped} * 1deg)`;
    case 'turn':
      return `calc(${unwrapped} / 360 * 1turn)`; 
  }

  // switch (toUnit) {
  //   case '%':
  //     return !unwrapped.endsWith(' * 100%') ? `calc(${unwrapped} * 100%)` : value;
  //   case 'deg':
  //     return!unwrapped.endsWith(' * 1deg') ? `calc(${unwrapped} / 1deg)` : value;
  //   case 'turn':
  //     return !unwrapped.endsWith(' / 360 * 1turn') ? `calc(${unwrapped} / 360 * 1turn)` : value;
  // }

  return value;
};
