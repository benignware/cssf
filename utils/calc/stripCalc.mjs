export const stripCalc = input => typeof input === 'string'
  ? String(input).replace(/^\s*(?:calc)?\s*\(\s*(.*)\s*\)$/g, '$1')
  : input;
