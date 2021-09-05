const csstree = require('css-tree');

const { parse, stringify } = require('../utils');
const functions = require('..');

function render(input) {
  const ast = parse(input);

  csstree.walk(ast, {
    leave(node) {
      if (node.type === 'Function') {
        const fn = functions[node.name];

        if (fn) {
          const args = node.children
            .toArray()
            .filter(({ type }) => type !== 'Operator')
            .map(({ value, unit = '' }) => `${value}${unit}`);

          const result = fn(...args);

          node.type = 'String';
          node.value = result;
        }
      }
    },
  });

  return stringify(ast);
}

module.exports = render;
