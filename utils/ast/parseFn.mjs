import * as csstree from 'css-tree';
import { CSS } from './CSS.mjs';
import { getArgs } from './getArgs.mjs';

export const parseFn = (input, options = {}) => {
  const ast = CSS.parse(input, {
    context: 'value',
  });
  const fn = csstree.find(ast, (node) => node.type === 'Function');

  if (fn) {
    const args = getArgs(fn, options);

    return [fn.name, ...args];
  }

  return null;
};
