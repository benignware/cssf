const csstree = require('css-tree');
const memoize_ = require('lodash.memoize');

const parse = (input) =>
  typeof input === 'number'
    ? String(input)
    : csstree.parse(input, {
        context: 'value',
      });

const stringify = (ast) => csstree.generate(ast);

const parseFn = (input) => {
  const ast = parse(input);
  const fn = csstree.find(ast, (node) => node.type === 'Function');

  if (fn) {
    const args = fn.children
      .toArray()
      .filter(({ type }) => type !== 'Operator')
      .map((node) => csstree.generate(node));

    return [fn.name, ...args];
  }

  return null;
};

const stripCalc = (expression) => {
  if (typeof expression === 'number') {
    return expression;
  }

  expression = String(expression).trim();

  return expression.replace(/^calc\(\s*(.*)\s*\)$/, '$1');
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

  expression = String(expression)
    .trim()
    .replace(/^\(?(.*)\)\s*[*]\s*100%\s*\)?$/, '$1');

  return expression;
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

const unit = (value) => {
  if (!isNumber(value)) {
    return null;
  }

  value = stripCalc(value);

  return (
    (String(value).match(/^\s*-?\d+[\d.-e]*([a-z]{2,}|%)?\s*$/) || [])[1] || ''
  );
};

const isVar = (value) => !!String(value).match(/^\s*var\(.*\)\s*$/);

const hasVar = (value) => !!String(value).match(/var\(/);

const isTerm = (value) => {
  return !!String(value).match(
    /^\s*(calc\(|\(*\s*-?(\d+[\d.-e]*|var\()([a-z]{2,}|%)*\s*\)*\s*[-+*/])/
  );
};

const isNumber = (value) => {
  value = stripCalc(value);

  return (
    typeof value === 'number' ||
    !!String(value).match(/^\s*\(*-?\d+[-.e\d]*([a-z]{2,}|%)?\s*$/)
  );
};

const computer = (operator) => {
  const fn = (a, b) => {
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
      // Concatenate strings
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
  memoize_(fn, (...args) => {
    const identifier = Object.values(args).join('_$_');

    return identifier;
  });

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
};
