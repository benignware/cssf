import * as functions from '../index.mjs';
import render from './render/render.mjs';

export const cssfTag = (options = {}) => {
  const functions = new Map();

  function use(...fn) {
    const obj = Object.assign(
      {},
      ...fn.filter(o => typeof o === 'object'),
      fn.length === 2 && typeof fn[0] === 'string' && typeof fn[1] === 'function' && { [fn[0]]: fn[1] },
      ...(typeof fn[0] !== 'string' ? fn.filter((f) => typeof f === 'function') : [])
    );

    Object.entries(obj).forEach(([key, value]) => {
      functions.set(key, value);
    });

    const keys = [...functions.keys()];

    keys.sort();
  }

  function cssf(strings, ...values) {
    let newStr = '';
  
    for (let i = 0; i < strings.length; i++) {
      if (i > 0) {
        newStr += values[i-1];
      }
      newStr += strings[i];
    }
  
    newStr = render(newStr);
  
    return newStr;
  }
  

  cssf.use = (...fn) => {
    use(...fn);

    return cssf;
  }

  return cssf;
}


const cssf = cssfTag();

const {
  // System
  'cssf': cssfFn,
  // evaluate,
  // calc,
  // Functions
  mod, // Baseline 2024
  pow, // Baseline 2023
  colorMix, // Baseline 2023x
  ...fn
} = functions;

cssf.use(fn);

export default cssf;