import { isNumber, number, unit } from './number.mjs';
import { stripCalc } from './stripCalc.mjs';

const isTerm = value =>
  !!String(value).match( /^\s*(calc\(|\(*\s*-?(\d+[\d.-e]*|var\()([a-z]{2,}|%)*\s*\)*\s*[-+*/])/);

export const compute = operator => {
  const fn = (a, b) => {
    let as = stripCalc(a);
    let bs = stripCalc(b);

    if (isNumber(a) && isNumber(b)) {
      const av = number(as);
      const bv = number(bs);
      const au = unit(a);
      const bu = unit(b);

      if (au === bu || !au || !bu) {
        let result = new Function('a', 'b', `return (a) ${operator} (b);`)(av, bv);
        let u = au || bu;

        if ((operator === '*' && au === bu && (av === 0 || bv === 0)) || 
            (operator === '/' && bu === '%' && au === '%')) {
          u = '';
        }

        return `${result}${u}`;
      }
    }

    if (operator === '+' && ((!isTerm(a) && !isNumber(as)) || (!isTerm(b) && !isNumber(bs)))) {
      return `${a}${b}`;
    }

    return `calc(${(isTerm(as) ? `(${as})` : as)} ${operator} ${(isTerm(bs) ? `(${bs})` : bs)})`;
  };

  return (...values) => {
    values = values.filter(v => v !== undefined);

    return values.length ? values.reduce(fn) : '';
  };
};


export const add = compute('+');
export const subtract = compute('-');
export const multiply = compute('*');
export const divide = compute('/');