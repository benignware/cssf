import { getValue, unit, stripCalc, computer, memoize } from '../utils.mjs';

// System
export const add = memoize(computer('+'));
export const subtract = memoize(computer('-'));
export const multiply = memoize(computer('*'));
export const divide = memoize(computer('/'));
// import { default as _add } from '../add/add.mjs';
// import { default as _subtract } from '../subtract/subtract.mjs';
// import { default as _multiply } from '../multiply/multiply.mjs';
// import { default as _divide } from '../divide/divide.mjs';

// export const add = _add;
// export const subtract = _subtract;
// export const multiply = _multiply;
// export const divide = _divide;

export const _join = (...items) => items.join(' ');

// export const calc = (expression) => {
//   console.log('CALC:', expression);

//   // return `calc(${stripCalc(expression)})`;
//   return expression;
// };

export const min = (...values) => {
  const u = values.map((value) => unit(value)).filter((u) => u && u !== '%')[0] || '';
  const v = String(Math.min(...values.map((value) => parseFloat(value))));

  return v + u;
};

export const max = (...values) => {
  const u = values.map((value) => unit(value)).filter((u) => u && u !== '%')[0] || '';
  const v = String(Math.max(...values.map((value) => parseFloat(value))));

  return v + u;
};

export const clamp = (() => {
  const _min = min;
  const _max = max;

  return (min, value, max) => _max(min, _min(value, max));
})();

// export const round = (value) => {
//   value = getValue(value);
//   const digits = 0;

//   const u = unit(value);
//   const f = parseFloat(value);
//   const r = Number(f.toFixed(digits));

//   const result = u ? `${r}${u}` : r;

//   return result;
// };

export const atan2 = (y, x) => Math.atan2(y, x);

export const pi = Math.PI;

export const Nan = NaN;

export const infinity = Infinity;

export const e = Math.E;
