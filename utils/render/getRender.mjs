import * as csstree from 'css-tree';
import { camelCase } from 'change-case';
import { CSS } from '../ast/CSS.mjs';
import { getArgs } from '../ast/getArgs.mjs';

import { ENV_2022, ENV_2023, ENV_2024, ENV_NEXT } from './env.mjs';

import { Env } from '../env/Env.mjs';

export const getRender = (customEnv = {}, baseEnv = ENV_NEXT) => {
  const renderEnv ={ ...baseEnv, ...customEnv };

  return function render(input, options = {}) {
    const ast = CSS.parse(input);
    const beforeEnv = Env.getEnv();
    const {
      transformers = [],
      callback = (target, args) => {
        const result = target(...args);

        return result;
      }
    } = options;
  
    Env.setEnv(renderEnv);

    csstree.walk(ast, {
      leave(node) {
        if (node.type === 'Function') {
          const fn = renderEnv[camelCase(node.name)];
  
          if (fn) {
            const args = getArgs(node);
            const result = fn(...args);
  
            node.type = 'Raw';
            node.value = result;
          }
        }
      },
    });
  
    const s = CSS.stringify(ast, {
      transformers,
    });

    Env.setEnv(beforeEnv);
  
    return s;
  }
}

export { ENV_2022, ENV_2023, ENV_2024, ENV_NEXT };