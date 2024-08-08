import { unwrap } from '../calc/unwrap.mjs';
import { hasVars } from '../calc/vars.mjs';
import { parseFn } from '../ast/parseFn.mjs';
import { compute } from '../calc/compute.mjs';

import * as baseEnv from './env.mjs';
import toJS from './toJs.mjs';

const OPERATORS = {
  '+': '_add',
  '-': '_subtract',
  '*': '_multiply',
  '/': '_divide',
};

const coreEnv = {
  _undef: (name, ...args) => `${name}(${args.join(', ')})`,
  _join: (delimiter, ...items) => items.join(delimiter),
  ...Object.fromEntries(
    Object.entries(OPERATORS).map(([op, fn]) => [fn, compute(op)])
  )
}

export const getEval = (env = {}, options = {}) => {
  let e;

  e = (input, context = {}, options = {}) => {
    const { evalResult = true } = options;

    const fn = Object.keys(env)
      .filter((key) => typeof env[key] === 'function')
      .filter((key) => !['add', 'subtract', 'multiply', 'divide'].includes(key))
      .reduce((acc, key) => {
        acc[key] = (...args) => {
          let result = env[key](...args);

          const [name] = parseFn(result) || [];

          if (typeof result !== 'string' || name === key) {
            return result;
          }

          result = e(result, context, options);
          
          return result;
        }
        return acc;
      }, {});
    
    const evalEnv = {
      ...coreEnv,
      ...baseEnv,
      ...fn,
      _var: null,
    };

    const js = toJS(input, {
      operators: OPERATORS,
      validIdentifiers: Object.keys(evalEnv),
    });

    const f = new Function('__context', ...Object.keys(evalEnv), `{
      const _var = (name) => {
        return typeof __context[name] !== 'undefined' ? __context[name] : 'var(' + name + ')';
      }
      try {
        return ${js}
      } catch (e) {
        console.error(e);
      }
    }`);
    
    let result = f(context, ...Object.values(evalEnv));

    result = unwrap(result);

    if (result === NaN || typeof result === 'undefined') {
      return input;
    }

    if (!evalResult) {
      return result;
    }

    const contextKeys = Object.keys(context);

    // If the result is has no context vars anymore but still has calc calls then we need to evaluate it again
    const evalAgain = typeof result == 'string' && contextKeys.length && result.includes('calc(') && !hasVars(result, contextKeys);

    if (evalAgain) {
      result = e(result, context, { evalResult: false });
    }

    result = unwrap(result);

    return result;
  }
  
  return e;
}
