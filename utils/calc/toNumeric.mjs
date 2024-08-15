import { number, unit } from './number.mjs';

export const toNumeric = (value) => {
  // Ensure value is a string
  if (typeof value !== 'string') {
    return value; // Or handle this case based on your requirements
  }

  // Check for calc expressions
  if (value.startsWith('calc')) {
    return value;
  }

  const n = number(value);
  const u = unit(value);

  // Return the original value if parsing fails
  if (isNaN(n) || u === null) {
    return value;
  }

  // Convert based on unit
  switch (u) {
    case '%':
      return n / 100;
    case 'deg':
      return n;
    case 'turn':
      return n * 360;
    default:
      return n;
  }
};
