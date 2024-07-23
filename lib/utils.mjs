import * as csstree from 'css-tree';
import memoize_ from 'lodash.memoize';

export const camelize = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const stripCalc = (expression) =>
  ['number', 'undefined'].includes(typeof expression)
     ? expression
     : String(expression).trim().replace(/^calc\(\s*(.*)\s*\)$/, '$1').trim();

const parse = (input, options = {}) => {
  if (typeof input === 'number') {
    return String(input);
  }

  let result = null;

  try {
    result = csstree.parse(input, {
      parseCustomProperty: true,
      context: options.context || !input.match(/\{/) ? 'value' : undefined,
      ...options
    });
  } catch (e) {
    console.error(`Could not parse '${input}'`, e);
  }

  return result;
};

export const stringify = (ast) => {
  try {
    return csstree.generate(ast);
  } catch (e) {
    console.error(`Could not stringify`, e);

    return '';
  }
};

export const getArgs = (fn, options = {}) => {
  let {
    separator = ' ',
    tokens = false,
    subTokens = false,
    stripCalc: _stripCalc = false,
  } = options;

  const subTokenSeparator = '####|####';

  if (!tokens && subTokens) {
    // separator = ' ####|#### ';
  }

  const nodes = fn.children.toArray();
  
  let args = nodes.reduce((acc, node, index, array) => {
    if (node.type !== 'Operator') {
      let str = getValue(csstree.generate(node));

      if (_stripCalc) {
        str = stripCalc(str);
      }

      if (!acc.length || tokens) {
        acc.push(subTokens ? [str] : str);
      } else {
        const current = acc[acc.length - 1];

        if (subTokens) {
          const prevNode = array[index - 1];
          const stringTypes = ['String', 'Identifier', 'Number'];
          const isString = stringTypes.includes(node.type);
          const isPrevString = stringTypes.includes(prevNode && prevNode.type);

          if (prevNode && isString && isPrevString) {
            current[current.length - 1] += separator + str;
          } else {
            current.push(str);
          }
        } else {
          acc[acc.length - 1] += (acc[acc.length - 1].length && separator ? separator : '') + str;
        }
      }
    }

    if (node.type === 'Operator' && index < array.length - 1) {
      acc.push(subTokens ? [] : '');
    }

    return acc;
  }, []);

  if (!tokens && subTokens) {
    // return args.map((arg) => arg.split(subTokenSeparator));
  }

  // args = args.filter((arg) => arg.trim().length);

  // args = args.map((arg) => getValue(arg));

  return args;
};

const parseNumber = (string) => {
  const u = unit(string);
  const v = parseFloat(string);

  if (isNaN(v)) {
    return string;
  }

  return [v, u];
}

const parseFn = (input, options = {}) => {
  const ast = parse(input, {
    context: 'value',
  });
  const fn = csstree.find(ast, (node) => node.type === 'Function');

  if (fn) {
    // console.log('fn: ', fn.children.toArray());
    // const args = fn.children
    //   .toArray()
    //   .filter(({ type }) => type !== 'Operator')
    //   .map((node) => csstree.generate(node))
    //   .map((arg) => getValue(arg));

    const args = getArgs(fn, options);

    return [fn.name, ...args];
  }

  return null;
};

export const parseArgs = (input, options = {}) => {
  return parseFn(`fn(${input})`, options).slice(1);
};

export const stringifyArgs = (node) => {
  const args = getArgs(node);

  return args.length ? args.join(', ') : '';
};


const toDecimal = (expression) => {
  expression = stripCalc(expression);

  if (isNumber(expression)) {
    if (unit(expression) === '%') {
      expression = parseFloat(expression) / 100;
    } else {
      expression = parseFloat(expression);
    }

    return expression;
  }

  return String(expression)
    .trim()
    .replace(/^\(?(.*)\)\s*[*]\s*100%\s*\)?$/, '$1');
};

const toPercent = (expression) => {
  expression = stripCalc(expression);

  if (!isNaN(parseFloat(expression))) {
    if (unit(expression) === '%') {
      return expression;
    }

    if (!isNaN(Number(expression))) {
      return `${Math.round(parseFloat(expression) * 100)}%`;
    }
  }

  return `calc((${expression.trim()}) * 100%)`;
};

const toPrecision = (n, precision = 2) => {
  if (!isNumber(n)) {
    console.error(`toPrecision: ${n} is not a number`);
    return 0;
  }

  const [v, u] = parseNumber(n);

  const p = Number(v.toFixed(precision));

  return u ? `${p}${u}` : p;
};

const unit = value =>
  !isNumber(value)
    ? null
    : (String(stripCalc(value)).match(/^\s*-?\d+[\d.-e]*([a-z]{2,}|%)?\s*$/) || [])[1] || '';

const isVar = value =>
  !!String(value).match(/^\s*var\(.*\)\s*$/);

const hasVar = value =>
  !!String(value).match(/var\(/);

const isTerm = value =>
  !!String(value).match( /^\s*(calc\(|\(*\s*-?(\d+[\d.-e]*|var\()([a-z]{2,}|%)*\s*\)*\s*[-+*/])/);

export const isNumber = value => {
  value = stripCalc(value);

  return typeof value === 'number'
    || !!String(value).match(/^\s*\(*-?\d+[-.e\d]*([a-z]{2,}|%)?\s*$/)
};

// const getValue = value => typeof(value) === 'string' ? value.replace(/^['"]|['"]$/g, '') : value;
const getValue = value => value;

const computer = operator => {
  const fn = (a, b) => {
    a = getValue(a);
    b = getValue(b);

    let as = stripCalc(a);
    let bs = stripCalc(b);

    if (isNumber(a) && isNumber(b)) {
      const av = parseFloat(as);
      const bv = parseFloat(bs);
      const au = unit(a);
      const bu = unit(b);

      if (au === bu || !au || !bu) {
        const result = new Function('a', 'b', `return (a) ${operator} (b);`)(
          av,
          bv
        );

        let u = au || bu;

        if (operator === '*') {
          if (au === bu && (av === 0 || bv === 0)) {
            u = '';
          }
        }

        if (!u) {
          return result;
        }

        if (operator === '/' && bu === '%' && au === bu && u === '%') {
          u = '';
        }

        const res = `${result}${u}`;

        return res;
      }
    }

    if (
      operator === '+' &&
      ((!isTerm(a) && !isNumber(as)) || (!isTerm(b) && !isNumber(bs)))
    ) {
      return `${a}${b}`;
    }

    as = isTerm(as) ? `(${as})` : as;
    bs = isTerm(bs) ? `(${bs})` : bs;

    return `calc(${as} ${operator} ${bs})`;
  };

  return function compute(...values) {
    values = values.filter((value) => typeof value !== 'undefined');

    if (values.length === 0) {
      return '';
    }
    
    return values.reduce((a, b) => fn(a, b));
  };
};

const memoize = (fn) =>
  memoize_(fn, (...args) =>
    Object.values(args).join('_$_'));

export {
  parse,
  // stringify,
  parseFn,
  unit,
  computer,
  toDecimal,
  toPercent,
  stripCalc,
  isVar,
  hasVar,
  toPrecision,
  isTerm,
  memoize,
  getValue,
};
