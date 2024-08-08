import * as csstree from 'css-tree';
import memoize_ from 'lodash.memoize';

export const camelize = (str) =>
  str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const stripCalc = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  input = String(input)
    // .trim();
  input = input.replace(/^\(\s*(.*)\s*\)$/g, '$1');
  input = input.replace(/^\s*(?:calc)?\s*\(\s*(.*)\s*\)$/, '$1');

  // return input.trim();
  return input;
}

const parse = (input, options = {}) => {
  if (isNumber(input)) {
    return input;
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
  // console.log('AST: ', ast);
  
  if (!ast) {
    return '';
  }

  let result = '';

  try {
    result = csstree.generate(ast, {
      // mode: 'safe'
      mode: 'spec'
    });
  } catch (e) {
    console.error(`Could not stringify`, e);
  }

  // console.log('STRINGIFIED: ', result);

  return result;
};

export const getArgs = (fn, options = {}) => {
  let {
    separator = ' ',
    tokens = false,
    subTokens = false,
    stripCalc: _stripCalc = false,
  } = options;

  const nodes = fn.children.toArray();
  
  let args = nodes.reduce((acc, node, index, array) => {
    const isArgumentSeparator = node.type === 'Operator';
  
    if (!isArgumentSeparator) {
      let str = stringify(node);

      if (_stripCalc) {
        str = stripCalc(str);
      }

      if (!acc.length || tokens) {
        acc.push(subTokens ? [str] : str);
      } else {
        const current = acc[acc.length - 1];

        if (subTokens) {
          const prevNode = array[index - 1];
          const stringTypes = ['String', 'Identifier', 'Number', 'WhiteSpace' , 'Raw'];
          const isString = stringTypes.includes(node.type);
          const isPrevString = stringTypes.includes(prevNode && prevNode.type);

          if (prevNode && isString && isPrevString) {
            current[current.length - 1] += separator + str;
          } else {
            current.push(str);
          }
        } else {
          acc[acc.length - 1] += (acc[acc.length - 1].length && separator ? separator : ' ') + str;
        }
      }
    }

    if (isArgumentSeparator && index < array.length - 1) {
      acc.push(subTokens ? [] : '');
    }

    return acc;
  }, []);

  args = args.filter((arg) => arg);

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

const unit = value => {
  if (typeof value === 'number') {
    return '';
  }

  if (typeof value !== 'string') {
    return null;
  }

  const u = (String(stripCalc(value)).match(/^\s*-?\d+[\d.-e]*([a-z]{2,}|%)?\s*$/) || [])[1] || '';

  return u;
}

export const number = (value) => {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value !== 'string') {
    return NaN;
  }

  const u = unit(value);
  const v = parseFloat(value);

  if (isNaN(v)) {
    return NaN;
  }

  if (u === 'deg') {
    return v * Math.PI / 180;
  }

  if (u === 'turn') {
    return v * 2 * Math.PI;
  }

  return v;
};


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
    // .trim()
    .replace(/^\(?(.*)\)\s*[*]\s*100%\s*\)?$/, '$1')
    // .trim();
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
  return `calc((${stripCalc(expression)}) * 100)`;
};

const toPrecision = (n, precision = 2) => {
  if (typeof n === 'object') {
    return Object.assign({}, ...Object.keys(n).map(key => ({ [key]: toPrecision(n[key], precision) })));
  }

  if (!isNumber(n)) {
    console.error(`toPrecision: ${n} is not a number`);
    return 0;
  }

  const [v, u] = parseNumber(n);

  const p = Number(v.toFixed(precision));

  return u ? `${p}${u}` : p;
};

const isVar = value =>
  !!String(value).match(/^\s*var\(.*\)\s*$/);

const hasVar = (value, name = null) => {
  if (isVar(value)) {
    return true;
  }

  if (!name) {
    return !!String(value).match(/\bvar\(/);
  }

  return !!String(value).match(new RegExp(`\\bvar\\(${name}\\)`));
}

export const hasVars = (value, names = []) => {
  if (!names.length) {
    return hasVar(value);
  }
  return names.reduce((acc, name) => acc || hasVar(value, name), false);
}

const isTerm = value =>
  !!String(value).match( /^\s*(calc\(|\(*\s*-?(\d+[\d.-e]*|var\()([a-z]{2,}|%)*\s*\)*\s*[-+*/])/);

export const isNumber = (value = '') => {
  if (typeof value === 'number') {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  value = stripCalc(value);
  value = value.replace(/^\((.*)\)$/g, '$1');

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
      const av = number(as);
      const bv = number(bs);
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

        if (operator === '/' && bu === '%' && au === bu && au === '%') {
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

export const sanitizeInput = (input) => {
  if (typeof input === 'number') {
    return input;
  }

  if (!input) {
    return null;
  }

  input = stripCalc(input);
  input = input.replace(/^\((.*)\)$/g, '$1');

  if (isNumber(input)) {
    return input;
  }

  if (!isNaN(Number(input))) {
    input = Number(input);
  }

  return input;
}

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

export const replaceIdentifiers = (input, identifiers) => {
  console.log('replaceIdentifiers: ', input, identifiers);
  if (isNumber(input)) {
    return input;
  }

  const ast = input.node ? input : parse(input);
  const visitor = {
    visit: 'Identifier',
    enter: (node) => {
      console.log('node: ', node);
      if (typeof identifiers[node.name] !== 'undefined') {
        console.log('replacing: ', node.name, identifiers[node.name]);
        const value = identifiers[node.name];

        if (isNumber(value)) {
          node.type = 'Number';
          node.value = String(value);
        }

        if (typeof value === 'string') {
          node.type = 'Raw';
          node.value = value;
        }

        console.log('replaced node: ', node);
      }
    }
  };

  csstree.walk(ast, visitor);

  try {
    return stringify(ast);
  } catch (e) {
    console.error('Could not replace identifiers', e);
  }

  return input;
}

export const isFunction = (input) => {
  if (typeof input !== 'string') {
    return false;
  }

  return !!input.match(/^\s*[\w-_]*\(/);
}

export const isChar = (input) => {
  if (typeof input !== 'string' || isNumber(input)) {
    return false;
  }

  return !!input.match(/^\s*[\w-_]\s*$/);
}

export const isDelimiter= (input) => {
  if (typeof input !== 'string') {
    return false;
  }

  return !!input.match(/^\s*[,/]\s*$/);
}

export const unwrap = (input) => {
  const unwrapped = stripCalc(input);

  if (!isNaN(Number(unwrapped))) {
    return Number(unwrapped);
  }

  if (isNumber(unwrapped)) {
    return unwrapped;
  }

  return input;
}

export const getFunctionName = (fn = null) => {
  let name;

  if (!fn) {
    const stackLine = (new Error()).stack.split('\n')[2].trim();
    const fncName = stackLine.match(/at Object.([^ ]+)/)?.[1];

    console.log('fncName: ', fncName);

    return fncName;
  }

  if (typeof fn === 'function') {
    if (fn.name) {
      return fn.name;
    }

    name = fn.toString();
    name = name.substr('function '.length);
    name = name.substr(0, name.indexOf('('));
  }

  if (!name && typeof fn === 'string') {
    [name] = fn.split('(');
  }

  return name;
}

export const isHex = (input) => typeof input === 'string' && !!input.match(/^#[0-9a-f]{3,6}$/i);

export const isIdentifier = (input) => typeof input === 'string' && !!input.match(/^[a-z][a-z0-9-_]*$/i);