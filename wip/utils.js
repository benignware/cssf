const csstree = require("css-tree");
const math = require('./math');
const colors = require('./colors');
const functions = { ...math, ...colors };

const parse = (string) => csstree
  .parse(
    !input.match(/\{/)
      ? `.____root { prop: \n${input}\n}`
      : input
  );

const stringify = (ast) => csstree
    .generate(ast)
    .replace(/^\.____root\s*\{\s*prop\:\s*(.*)\}$/, '$1');

function css(strings, ...values) {
  const input = strings.reduce((string, i) => `${string}${values[i] || ''}`);
  const ast = parse(input);

  // traverse AST and modify it
  csstree.walk(ast, {
    leave(node, item, list) {
      if (node.type === "Function") {
        const fn = functions[node.name];

        if (fn) {
          const args = node.children
            .toArray()
            .filter(({ type }) => type !== "Operator")
            .map(({ value, unit = '' }) => `${value}${unit}`);

          const result = fn(...args);

          node.type = 'String';
          node.value = result;
        }
      }
    },
  });

  return stringify(ast);
};

const _evaluate = new Function(
  'expression',
  `
// console.log('eval', expression);
const min = (...args) => Math.min(...args.map(v => parseFloat(v)));
const max = (...args) => Math.max(...args.map(v => parseFloat(v)));
const clamp = (min, value, max) => Math.max(min, Math.min(value, max));
const factory = (name) => (...args) => name + '(' + args.map(arg => eval(arg)).join(', ') + ')';
const calc = (expression) => eval(expression);
const hsla = factory('hsla');
const rgba = factory('rgba');

return eval(expression);
`
);

const js = (input) => {
  const fn = {
    var(name, value) {
      return `typeof ${name} `
    }
  }
  const ast = parse(input);

  // traverse AST and modify it
  csstree.walk(ast, {
    leave(node, item, list) {
      if (node.type === "Function") {
        const fn = functions[node.name];

        if (fn) {
          const args = node.children;
          
          console.log('*** ARGS: ', fn.name, args.toArray());

          args.toArray()
            .filter(({ type }) => type !== "Operator")
            .forEach((node) => {
              console.log('->ARG: ', node.value, node.type, node.unit);
              const unit = node.type === 'PERCENTAGE' ? '%' : node.unit;
              console.log('unit: ', unit);
              node.value = unit ? `\'${node.value}${unit || ''}\'` : node.value;
              node.type = 'String';
            });
        }
      }
    }
  });

  const js = stringify(ast);

  return _evaluate(js);
}

module.exports = {
  css,
  evaluate: _evaluate
};
