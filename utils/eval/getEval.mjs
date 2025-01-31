import { CSS } from '../ast/CSS.mjs';
import { Env } from '../env/Env.mjs';
// import { unwrap } from '../calc/unwrap.mjs';
import { unwrap } from '../calc/unwrap.mjs';
import { number, unit } from '../calc/number.mjs';
import { stripCalc } from '../calc/stripCalc.mjs';

import { valueTransformer } from './transformers/valueTransformer.mjs';
import toJS from './toJs.mjs';

import { hasVars, isVar } from '../calc/vars.mjs';
import { parseFn } from '../ast/parseFn.mjs';
import { compute } from '../calc/compute.mjs';

import { ENV_2022, ENV_2023, ENV_2024, ENV_NEXT } from './env.mjs';
import { exp } from './env/env2023.mjs';

const OPERATORS = {
  '+': '_add',
  '-': '_subtract',
  '*': '_multiply',
  '/': '_divide',
};

const isTerm = value =>
  !!String(value).match( /^\s*(calc\(|\(*\s*-?(\d+[\d.-e]*|var\()([a-z]{2,}|%)*\s*\)*\s*[-+*/])/);

const coreEnv = {
  _undef: (name, ...args) => `${name}(${args.join(', ')})`,
  _join: (delimiter, ...items) => items.join(delimiter),
  calc: (expression) => {
    if (typeof expression === 'number') {
      return expression;
    }

    const r = unwrap(expression);
    const n = number(r);
    
    if (!isNaN(n)) {
      const u = unit(r);

      return u ? `${n}${u}` : n;
    }
    
    const result = `calc(${r})`;

    return result;
    return expression;
    const value = unwrap(expression);

    return value !== expression ? value : `calc(${stripCalc(value)})`;
    return value !== expression ? value : expression;
  },
  ...Object.fromEntries(
    Object.entries(OPERATORS).map(([op, fn]) => [fn, compute(op)])
  )
};

export const getEval = (customEnv = {}, baseEnv = ENV_2024) => {
  const evalEnv ={ ...coreEnv, ...baseEnv, ...customEnv };

  // Remove undefined or null values
  Object.keys(evalEnv).forEach(key => {
    if (evalEnv[key] === undefined || evalEnv[key] === null) {
      delete evalEnv[key];
    }
  });

  let e;

  e = (input, context = {}, options = {}) => {
    const { evalResult = true } = options;
    // Function handler to wrap the function calls
    const handler = {
      apply(target, thisArg, args) {
        let result = Reflect.apply(target, thisArg, args);

        const [name] = parseFn(result) || [];

        if (typeof result !== 'string' || name === target.name) {
          return result;
        }

        result = e(result, context, options);

        return result;
      }
    };

    // Ensure `customEnv` functions are valid before creating proxies
    const validCustomEnv = Object.fromEntries(
      Object.entries(customEnv).filter(([_, func]) => typeof func === 'function')
    );

    let fn = Object.fromEntries(
      Object.entries(validCustomEnv).map(([name, func]) => [name, new Proxy(func, handler)])
    );

    fn = {
      ...evalEnv,
      ...fn,
      _var: null
    };

    const beforeEnv = Env.getEnv();
  
    Env.setEnv(evalEnv);

    // console.log('INPUT: ', input);
    // console.log('ENV: ', Object.keys(evalEnv));

  
    let result = CSS.stringify(input, {
      transformers: [
        valueTransformer((input) => {
          const js = toJS(input, {
            operators: OPERATORS,
            validIdentifiers: [
              '_var',
              // '_join',
              ...Object.keys(evalEnv)
            ]
          });
          // console.log('js: ',  js);
      
          const f = new Function('__context', ...Object.keys(evalEnv), `{
            const _var = (name, defaultValue = '') => {
              const value = __context[name];

              if (typeof value !== 'undefined') {
                return value;
              }

              if (defaultValue !== '') {
                return defaultValue;
              }
              
              return defaultValue 
                ?  'var(' + name + ', ' + defaultValue + ')'
                : 'var(' + name + ')';
            }
           
            try {
              return ${js}
            } catch (e) {
              // console.error(e);
              throw new Error('Could not evaluate: "' + '${js.substring(0, 100) + '..."'}' + ' with error: ' + e.message);
            }
          }`);
          
          let result = f(context, ...Object.values(evalEnv));

          // console.log('EVAL RESULT: ', result, String(result));
      
          // result = unwrap(result);
      
          // if (Number.isNaN(result) || typeof result === 'undefined') {
          //   return typeof input === 'object' ? CSS.stringify(input) : input;
          // }

          return result;
        })
      ]
    });

    Env.setEnv(beforeEnv);

    // console.log('AFTER EVAL RESULT: ', result);

    // const js = toJS(input, {
    //   operators: OPERATORS,
    //   validIdentifiers: ['_var', ...Object.keys(evalEnv)]
    // });

    // const f = new Function('__context', ...Object.keys(evalEnv), `{
    //   const _var = (name) => {
    //     return typeof __context[name] !== 'undefined' ? __context[name] : 'var(' + name + ')';
    //   }
    //   try {
    //     return ${js}
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }`);

    // const beforeEnv = Env.getEnv();

    // // console.log('EVAL ENV: ', Object.keys(evalEnv), 'BEFORE: ', Object.keys(beforeEnv));

    // Env.setEnv(evalEnv);
    
    // let result = f(context, ...Object.values(evalEnv));

    // Env.setEnv(beforeEnv);

    // result = unwrap(result);

    // if (Number.isNaN(result) || typeof result === 'undefined') {
    //   return input;
    // }

    // console.log('typeof result: ', result, typeof result);

    if (result === 'NaN') {
      return Number.NaN;
    }

    if (typeof result === 'object') {
      throw new Error('Result is an object: ' + JSON.stringify(result));
    }

    if (!evalResult) {
      return result;
    }
    
    const contextKeys = Object.keys(context);
    const unresolvedContextVars = contextKeys.length && hasVars(result, contextKeys);
    const unresolvedVars = isVar(result);
    const unresolvedCalc = typeof result === 'string' && result.includes('calc(');
    const unresolvedIdentifiers = typeof result === 'string' && /\s+\w|\w\s+/.test(result);
    const evalAgain = (unresolvedVars || unresolvedContextVars || unresolvedCalc) // && !unresolvedIdentifiers;

    if (evalAgain) {
      result = e(result, context, { evalResult: false });
    }

    if (typeof result === 'number') {
      return result;
    }

    const r = unwrap(result);
    const n = number(r);
    
    if (!isNaN(n)) {
      const u = unit(r);
      
      return u ? `${n}${u}` : n;
    }

    // if (unresolvedCalc || input.trim().startsWith('calc(')) {
    //   result = stripCalc(result);
    //   result = `calc(${result})`;
    // }

    return result;
  };
  
  return e;
};

export const evaluate = getEval();

export { ENV_2022, ENV_2023, ENV_2024, ENV_NEXT };