import { CSS } from '../ast/CSS.mjs';
import { stripCalc } from './stripCalc.mjs';

const NUM_REGEX = /^([-+]?[\d.]+(?:e[-+]?\d+)?)\s*([a-z%]+)\s*$/i;
const CALC_REGEX = /^\s*(?:calc)?\s*\(\s*(.*)\s*\)$/g;

export const isNumber = value => typeof value === 'number' || (typeof value === 'string' 
  ? !isNaN(value = parseFloat(stripCalc(value).replace(/^\((.*)\)$/g, '$1')))
  : false);

// export const unit = value => typeof value !== 'number'
//   ? (String(stripCalc(value)).match(/^\s*-?\d+[\d.-e]*([a-z%]{2,})?\s*$/) || [])[1] || ''
//   : '';

export const unit = value => {
  if (typeof value !== 'number') {
    // Strip out any 'calc()' functions and whitespace
    const cleanedValue = String(value).replace(/calc\s*\(\s*|\s*\)\s*/gi, '');
    
    // Match number followed by unit
    const match = cleanedValue.match(NUM_REGEX);
    
    // Return the unit part if found, otherwise return an empty string
    return match ? match[2] : '';
  }
  return '';
};


export const rad = value => typeof value === 'number'
  ? value
  : typeof value === 'string'
  ? unit(value) === 'deg' ? parseFloat(value) * Math.PI / 180
    : unit(value) === 'turn' ? parseFloat(value) * 2 * Math.PI
    : parseFloat(value)
  : NaN;


// export const number = value => typeof value === 'number'
//   ? value
//   : typeof value === 'string'
//     ? parseFloat(value)
//     : NaN;

// export const stripCalc = input => typeof input === 'string'
//   ? String(input).replace(/^\s*(?:calc)?\s*\(\s*(.*)\s*\)$/g, '$1')
//   : input;


export const number = value => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    value = value.replace(CALC_REGEX, '$1');

    if (!isNaN(Number(value))) {
      return Number(value);
    }

    [value] = value.match(NUM_REGEX)?.slice(1) || [];

    if (!isNaN(value)) {
      return parseFloat(value);
    }

    return NaN;
    
    // return match ? parseFloat(match[1]) : NaN;
  }

  return NaN;
}

/**
 * Wraps or unwraps an expression in calc()
 * @param {*} value 
 * @returns 
 */
export const unwrap = input => {
  if (typeof input === 'number') {
    return input;
  }

  let value = input;

  if (CALC_REGEX.test(value)) {
    value = value.replace(CALC_REGEX, '$1');
  }

  if (!isNaN(Number(value))) {
    return Number(value);
  }
  
  const n = number(value);

  if (!isNaN(n)) {
    const u = unit(value);

    if (u) {
      return `${n}${u}`;
    }

    return n;
  }

  const ast = CSS.parse(value);
  
  if (ast) {
    if (ast.children.toArray().length < 2) {
      return value;
    }
  }

  return input;
}