const csstree = require('css-tree');
const functions = require('..');
const { parse, stringify } = require('../utils');

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
            .map((node) => {
              if (node.value) {
                const unit = node.unit || '';
                return `${node.value}${unit}`;
              }

              return csstree.generate(node);
            });

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
