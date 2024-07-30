import { hasVars, isNumber, parseFn, sanitizeInput, stripCalc, unwrap } from '../utils.mjs';
import * as coreEnv from './env/coreEnv.mjs';
import toJS from './toJs.mjs';

const getEval = (env = {}) => {
  let e;

  e = (input, context = {}, options = {}) => {
    const { evalResult = true } = options;
    // console.log('EVAL: ', input);
    let unwrapped = stripCalc(input);

    if (!isNaN(Number(unwrapped))) {
      return Number(unwrapped);
    }

    if (typeof unwrapped !== 'string') {
      return unwrapped;
    }

    if (isNumber(unwrapped)) {
      return unwrapped;
    }

    const fn = Object.keys(env)
      .filter((key) => typeof env[key] === 'function')
      .filter((key) => !['add', 'subtract', 'multiply', 'divide'].includes(key))
      .reduce((acc, key) => {
        acc[key] = (...args) => {
          let result = env[key](...args);

          const [name] = parseFn(result) || [];
          
          // if (isNaN(result) || typeof result === 'undefined') {
          //   return `${name}(${args.join(', ')})`;
          // }

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
      ...fn,
      _var: null,
      _undef: (name, ...args) => `${name}(${args.join(', ')})`,
    };

    const js = toJS(input, {
      validIdentifiers: Object.keys(evalEnv),
    });
    // console.log('JS: ', js);
    // console.log('CONTEXT: ', context);

    const f = new Function('__context', ...Object.keys(evalEnv), `{
      const _var = (name) => {
        // console.log('GET VAR: ', name, __context);
        return typeof __context[name] !== 'undefined' ? __context[name] : 'var(' + name + ')';
      }
      try {
        return ${js}
      } catch (e) {
        console.error(e);
      }
    }`);
    
    let result = f(context, ...Object.values(evalEnv));

    // console.log('RESULT: ', result);

    result = unwrap(result);

    if (result === NaN || typeof result === 'undefined') {
      return input;
    }

    if (!evalResult) {
      // console.log('DO NOT EVAL AGAIN: ', result);
      return result;
    }

    const contextKeys = Object.keys(context);

    // If the result is has no context vars anymore but still has calc calls then we need to evaluate it again
    const evalAgain = typeof result == 'string' && contextKeys.length && result.includes('calc(') && !hasVars(result, contextKeys);
    // const evalAgain = true;

    if (evalAgain) {
      // console.log('EVAL AGAIN: ', result);

      result = e(result, context, { evalResult: false });
    }

    result = unwrap(result);

    return result;
  }
  
  return e;
}

export default getEval;