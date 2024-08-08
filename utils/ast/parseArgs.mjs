import { parseFn } from './parseFn.mjs';

export const parseArgs = (input, options = {}) => {
  return parseFn(`fn(${input})`, options).slice(1);
};