const csstree = require('css-tree');

const { parse, stringify } = require('../utils');
const functions = require('..');

/**
 * Utility function that renders css containing cssf functions.
 * @param {string} input Some css that may contain cssf functions
 * @returns {string} The resulting css
 */
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
