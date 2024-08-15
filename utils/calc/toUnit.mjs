import { number, unit } from './number.mjs';

export const toUnit = (value, toUnit) => {
  // Check for calc expressions
  if (typeof value === 'string' && value.startsWith('calc')) {
    return value; // Simply return calc expression as is for now
  }

  const n = number(value);
  const u = unit(value);

  if (u === toUnit) {
    return value;
  }

  if (isNaN(n) || toUnit === null) {
    return value;
  }

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
};
