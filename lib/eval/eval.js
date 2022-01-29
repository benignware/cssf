const csstree = require('css-tree');
const { add, subtract, divide, multiply } = require('..');
const { parse, stringify, unit } = require('../utils');

const min = (...values) => {
  const u = values.map((value) => unit(value)).filter((u) => u && u !== '%')[0];
  const f = String(Math.min(...values.map((value) => parseFloat(value))));

  return f + (u || '');
};

const max = (...values) => {
  const u =
    values.map((value) => unit(value)).filter((u) => u && u !== '%')[0] || '';
  const v = values.map((value) => parseFloat(value));
  const f = String(Math.max(...v));

  return u ? f + u : f;
};

const clamp = (min, value, max) => max(min, min(value, max));

const round = (value, digits = 0) => {
  const u = unit(value);
  const f = parseFloat(value);
  const r = Number(f.toFixed(digits));

  return u ? `${r}${u}` : r;
};

const _var = function (name, value) {
  return this.context.get(name.replace(/^--/, '')) || value;
};

const nameTransformer =
  (options = {}) =>
  (ast) => {
    csstree.walk(ast, {
      leave(node) {
        if (['Function'].includes(node.type)) {
          node.name = (options.functions || {})[node.name] || node.name;
        }
      },
    });

    return ast;
  };

const literalTransformer = () => (ast) => {
  csstree.walk(ast, {
    leave(node) {
      let value;

      if (['Identifier'].includes(node.type)) {
        value = node.name;
      }

      if (['Percentage'].includes(node.type)) {
        value = node.value + '%';
      }

      if (node.unit) {
        value = node.value + node.unit;
      }

      if (typeof value !== 'undefined') {
        node.type = 'String';
        node.value = `'${value}'`;
      }
    },
  });

  return ast;
};

const operatorTransformer =
  (options = {}) =>
  (ast) => {
    const valueTypes = [
      'Number',
      'Dimension',
      'Function',
      'Parentheses',
      'String',
      'Percentage',
    ];

    [
      ['*', '/'],
      ['+', '-'],
    ].map((operators) => {
      csstree.walk(ast, {
        enter(node, item, list) {
          if (node.type === 'Operator' && operators.includes(node.value)) {
            const operator = node.value;
            const children = list.copy();

            children.clear();

            let prev = item.prev;

            while (prev.data.type === 'WhiteSpace') {
              const p = prev;

              prev = prev.prev;

              list.remove(p);
            }

            list.prevUntil(prev, (data, item) => {
              if (!valueTypes.includes(data.type)) {
                return true;
              }

              children.prependData(data);
              list.remove(item);
            });

            children.appendData({
              type: 'Operator',
              value: ',',
            });

            children.appendData({
              type: 'WhiteSpace',
              value: ' ',
            });

            let next = item.next;

            while (next.data.type === 'WhiteSpace') {
              const n = next;

              next = next.next;

              list.remove(n);
            }

            list.nextUntil(next, (data, item) => {
              if (!valueTypes.includes(data.type)) {
                return true;
              }

              children.appendData(data);
              list.remove(item);
            });

            list.insertData(
              {
                type: 'Function',
                name: Object.assign(
                  {
                    '+': 'add',
                    '-': 'subtract',
                    '*': 'multiply',
                    '/': 'divide',
                  },
                  options.operators
                )[operator],
                children,
              },
              item.next
            );

            list.remove(item);
          }
        },
      });
    });

    return ast;
  };

const transformers = [
  literalTransformer(),
  operatorTransformer(),
  nameTransformer({
    functions: {
      var: '_var',
    },
  }),
];

const functions = Object.assign(
  {
    add,
    subtract,
    multiply,
    divide,
    min,
    max,
    clamp,
    round,
    _var,
  },
  Object.fromEntries(
    ['hsl', 'hsla', 'rgb', 'rgba'].map((name) => [
      name,
      function (...args) {
        return `${name}(${args.join(', ')})`;
      },
    ])
  ),
  {
    calc(expression) {
      return expression;
    },
  }
);

/**
 * Utility fucntion that evaluates a css expression.
 * @alias eval
 * @param {string} A css expression
 * @param {object} context An object that is transformed into css variables to be evaluated
 * @returns {(string|number)} Either a css expression or a number
 */
function evaluate(input, context = {}) {
  if (!isNaN(Number(input))) {
    return Number(input);
  }

  let ast;

  try {
    ast = parse(input);
  } catch (e) {
    console.error(e);
    console.log(input);
    return;
  }

  input = String(input);
  input = stringify(
    (transformers || []).reduce(
      (ast, transformer) => transformer.call(this, ast),
      ast
    )
  );

  const f = new Function(
    '__context__',
    ...Object.keys(functions),
    `
  this.context = new Map();

  for (x in __context__) {
    this.context.set(x, __context__[x]);
  }

  return ${input};
`
  );

  const result = f(context, ...Object.values(functions));

  if (!isNaN(Number(result))) {
    return Number(result);
  }

  return result;
}

module.exports = evaluate;
