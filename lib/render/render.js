const csstree = require('css-tree');
const functions = require('..');
const { parse, stringify, getValue } = require('../utils');

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
                const value = getValue(node.value);
                const unit = node.unit || '';
                return `${value}${unit}`;
              }

              return csstree.generate(node);
            })
            .map(arg => getValue(arg));

          const result = fn(...args);

          node.type = 'String';
          node.value = result;
        }
      }
    },
  });

  let s = stringify(ast);

  s = getValue(s);

  return s;
}

module.exports = render;
