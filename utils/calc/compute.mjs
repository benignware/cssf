import { isNumber, number, unit } from './number.mjs';
import { stripCalc } from './stripCalc.mjs';
import { unwrap } from './unwrap.mjs';
import { isVar } from './vars.mjs';

const isTerm = value =>
  !!String(value).match( /^\s*(\(|\(*\s*-?(\d+[\d.-e]*|var\()([a-z]{2,}|%)*\s*\)*\s*[-+*/])/);

const isFn = value =>
  !!String(value).match(/^\s*[-\d\w]+\(/);

export const compute = operator => {
  const fn = (a, b) => {
    // console.log('COMPUTE: ', a, operator, b);
    let as = stripCalc(a);
    let bs = stripCalc(b);
    // let as = a;
    // let bs = b;

    //  as = unwrap(a);
    //  bs = unwrap(b);

    const an = number(as);
    const bn = number(bs);

    if (!isNaN(an) && !isNaN(bn)) {
      const av = number(as);
      const bv = number(bs);
      const au = unit(a);
      const bu = unit(b);

      if (au === bu || !au || !bu) {
        let result = new Function('a', 'b', `return (a) ${operator} (b);`)(av, bv);

        if (result === Number.POSITIVE_INFINITY) {
          result = 1e-14;
        }

        if (result === Number.NEGATIVE_INFINITY) {
          result = -1e-14;
        }

        let u = au || bu;

        if ((operator === '*' && au === bu && (av === 0 || bv === 0)) || 
            (operator === '/' && bu === '%' && au === '%')) {
          u = '';
        }

        const ret = u ? `${result}${u}` : result;

        return ret;
      }
    }

    // console.log('AS', a, 'BS', b);

    // if (operator === '+' && ((!isTerm(a) && !isNumber(as)) || (!isTerm(b) && !isNumber(bs)))) {
    //   return `${a}${b}`;
    // }

    const af = !isNaN(an) ? an : isFn(as) ? as : `(${as})`;
    const bf = !isNaN(bn) ? bn : isFn(bs) ? bs : `(${bs})`;

    // if (operator === '+' || operator === '-') {
    //   return `((${as} ${operator} ${bs}))`;
    // }

    return `${a} ${operator} ${b}`;

    // const aw = wrap(as);
    // const bw = wrap(bs);
    return `${as} ${operator} ${bs}`;

    return `calc(${as} ${operator} ${bs})`;
    return `(${as} ${operator} ${bs})`;

    return `calc(${(isTerm(as) ? `(${as})` : as)} ${operator} ${(isTerm(bs) ? `(${bs})` : bs)})`;
  };

  return (...values) => {
    const hasCalc = values.some(v => String(v).includes('calc('));
    
    // values = values.map(v => {
    //   return typeof v === 'string' ? unwrap(v) : v;
    // });
    
    // values = values.filter(v => v !== undefined);

    let result = values.length ? values.reduce(fn) : '';

    if (typeof result === 'number') {
      return result;
    }

    const r = unwrap(result);
    const n = number(r);
    
    if (!isNaN(n)) {
      const u = unit(r);
      
      return u ? `${n}${u}` : n;
    }

    // if (hasCalc) {
    //   result = `calc(${result})`;
    // } else {
      if (operator === '+' || operator === '-') {
        result = `(${result})`;
      }
    // }

    return result;
  };
};


export const add = compute('+');
export const subtract = compute('-');
export const multiply = compute('*');
export const divide = compute('/');