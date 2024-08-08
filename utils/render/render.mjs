import * as csstree from 'css-tree';
import { camelCase } from 'change-case';

import * as functions from '../index.mjs';
import { CSS } from '../ast/CSS.mjs';
import { getArgs } from '../ast/getArgs.mjs';

function render(input, options = {}) {
  const ast = CSS.parse(input);

  csstree.walk(ast, {
    leave(node) {
      if (node.type === 'Function') {
        const fn = functions[camelCase(node.name)];

        if (fn) {
          const args = getArgs(node);
          const result = fn(...args);

          node.type = 'Raw';
          node.value = result;
        }
      }
    },
  });

  const s = CSS.stringify(ast);

  return s;
}

export default render;
