const csstree = require('css-tree');
const memoize_ = require('lodash.memoize');

const parse = (input, options = {}) => {
  if (typeof input === 'number') {
    return String(input);
  }

  let result = null;

  try {
    result = csstree.parse(input, {
      context: options.context || !input.match(/\{/) ? 'value' : undefined,
      ...options
    });
  } catch (e) {
    console.log(`Could not parse '${input}'`);
  }

  return result;
};

const stringify = (ast) => csstree.generate(ast);

const parseFn = (input) => {
  const ast = parse(input, {
    context: 'value',
  });
  const fn = csstree.find(ast, (node) => node.type === 'Function');

  if (fn) {
    const args = fn.children
      .toArray()
      .filter(({ type }) => type !== 'Operator')
      .map((node) => csstree.generate(node))
      .map((arg) => getValue(arg));

    return [fn.name, ...args];
  }

  return null;
};

const stripCalc = (expression) =>
  typeof expression === 'number'
    ? expression
    : String(expression).trim().replace(/^calc\(\s*(.*)\s*\)$/, '$1');

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

const toPrecision = (n, precision = 2) => Number(n.toFixed(precision));

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

const isNumber = value => {
  value = stripCalc(value);

  return typeof value === 'number'
    || !!String(value).match(/^\s*\(*-?\d+[-.e\d]*([a-z]{2,}|%)?\s*$/)
};

const getValue = value => typeof(value) === 'string' ? value.replace(/^['"]|['"]$/g, '') : value;

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

        // Yet untested
        if (operator === '*') {
          if (au === bu && (av === 0 || bv === 0)) {
            u = '';
          }
        }

        if (!u) {
          return result;
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
    return values
      .filter((value) => typeof value !== 'undefined')
      .reduce((a, b) => fn(a, b));
  };
};

const memoize = (fn) =>
  memoize_(fn, (...args) =>
    Object.values(args).join('_$_'));

module.exports = {
  parse,
  stringify,
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
