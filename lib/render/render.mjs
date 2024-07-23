import * as csstree from 'css-tree';
import * as functions from '../index.mjs';
import { parse, getArgs, stringify, getValue, camelize } from '../utils.mjs';

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
        const fn = functions[camelize(node.name)];

        if (fn) {
          const args = getArgs(node);
          const result = fn(...args);

          node.type = 'Raw';
          node.value = getValue(result);
        }
      }
    },
  });

  let s = stringify(ast);

  s = getValue(s);

  return s;
}

export default render;
