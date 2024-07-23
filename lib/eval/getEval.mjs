import { parseFn } from '../utils.mjs';
import * as coreEnv from './coreEnv.mjs';
import toJS from './toJs.mjs';

const getEval = env => {
  let e;

  const fn = Object.keys(env).reduce((acc, key) => {
    acc[key] = (...args) => {
      let result = env[key](...args);

      const [name] = parseFn(result) || [];

      if (typeof result !== 'string' || name === key) {
        return result;
      }

      return e(result, context);
    }
    return acc;
  }, {});
  
  const evalEnv = {
    ...coreEnv,
    ...fn,
    _var: null,
    _undef: (name, ...args) => `${name}(${args.join(', ')})`,
  };

  e = (input, context = {}) => {
    const js = toJS(input, {
      validIdentifiers: Object.keys(evalEnv),
    });
    const f = new Function('__context', ...Object.keys(evalEnv), `{
      const _var = (name) => {
        // console.log('GET VAR: ', name, __context);
        return __context[name];
      }
      
      return ${js};
    }`);
    
    let r = f(context, ...Object.values(evalEnv));

    if (typeof r === 'string') {
      r = r.replace(/^\((.*)\)$/g, '$1');
    }

    

    if (!isNaN(Number(r))) {
      r = Number(r);
    }

    return r;
  }
  
  return e;
}

export default getEval;