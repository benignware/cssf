import { isNumber, parseFn, sanitizeInput } from '../utils.mjs';
import * as coreEnv from './coreEnv.mjs';
import toJS from './toJs.mjs';

const getEval = env => {
  let e;

  e = (input, context = {}) => {
    if (!isNaN(Number(input))) {
      return Number(input);
    }

    if (isNumber(input)) {
      return input;
    }

    const fn = Object.keys(env)
      .filter((key) => typeof env[key] === 'function')
      .filter((key) => !['add', 'subtract', 'multiply', 'divide'].includes(key))
      .reduce((acc, key) => {
        acc[key] = (...args) => {
          // args = args.map(arg => e(arg, context));

          let result = env[key](...args);

          const [name] = parseFn(result) || [];

          if (typeof result !== 'string' || name === key) {
            return result;
          }

          result = e(result, context);
          
          return result;
        }
        return acc;
      }, {});
    
    const evalEnv = {
      ...coreEnv,
      ...fn,
      _var: null,
      _undef: (name, ...args) => `${name}(${args.join(', ')})`,
    };

    const js = toJS(input, {
      validIdentifiers: Object.keys(evalEnv),
    });

    // console.log('JS: ', js);

    const f = new Function('__context', ...Object.keys(evalEnv), `{
      const _var = (name) => {
        // console.log('GET VAR: ', name, __context);
        return __context[name];
      }
      
      return ${js};
    }`);
    
    let result = f(context, ...Object.values(evalEnv));

    if (!isNaN(Number(result))) {
      return Number(result);
    }

    if (isNumber(result)) {
      return result;
    }

    return result;
  }
  
  return e;
}

export default getEval;