import { stripCalc } from './stripCalc.mjs';

export const isNumber = value => typeof value === 'number' || (typeof value === 'string' 
  ? !isNaN(value = parseFloat(stripCalc(value).replace(/^\((.*)\)$/g, '$1')))
  : false);

export const unit = value => typeof value !== 'number'
  ? (String(stripCalc(value)).match(/^\s*-?\d+[\d.-e]*([a-z%]{2,})?\s*$/) || [])[1] || ''
  : '';

export const number = value => typeof value === 'number'
  ? value
  : typeof value === 'string'
  ? unit(value) === 'deg' ? parseFloat(value) * Math.PI / 180
    : unit(value) === 'turn' ? parseFloat(value) * 2 * Math.PI
    : parseFloat(value)
  : NaN;
