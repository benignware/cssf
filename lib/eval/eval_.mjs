import * as csstree from 'css-tree';
// import add from '../add/add.mjs';
// import subtract from '../subtract/subtract.mjs';
// import multiply from '../multiply/multiply.mjs';
// import divide from '../divide/divide.mjs';
import { parse, stringify, getValue, isNumber, stripCalc, camelize, getArgs } from '../utils.mjs';
import * as env from './coreEnv.mjs';
import * as functions from '../index.mjs';

export const getEnv = (fn = {}) => {
  const all = {
    ...env,
    // ...functions,
    ...fn,
    // rgba: functions.rgba,
    // colorMix: functions.colorMix,
  };

  return all;
}

// const nameTransformer =
//   (options = {}) =>
//   (ast) => {
//     csstree.walk(ast, {
//       leave(node) {
//         if (['Function'].includes(node.type)) {
//           node.name = (options.functions || {})[node.name] || node.name;
//         }
//       },
//     });

//     return ast;
//   };

const RESERVED = ['var'];

const literalTransformer = (options = {}) => (ast) => {
  csstree.walk(ast, {
    enter(node, item, list) {
      if (node.type === 'Function') {
        node.name = camelize(node.name);
        node.name = RESERVED.includes(node.name) ? '_' + node.name : node.name;
      }

      if (node.type === 'Identifier') {
        const [_sign = '', name] = node.name.match(/^(-)?(.*)$/).slice(1) || [];
        const def = options.functions[name] || options.functions[camelize(name)];

        if (typeof def !== 'undefined' && typeof def !== 'function') {
          node.type = 'Raw';
          node.value = node.name;
        } else {
          node.type = 'String';
          node.value = node.name;
        }
      }

      if (node.type === 'Hash') {
        node.type = 'String';
        node.value = '#' + node.value;
      }

      if (node.type === 'Percentage') {
        node.type = 'String';
        node.value = node.value + '%';
      }

      if (node.unit) {
        node.type = 'String';
        node.value = node.value + node.unit;
      }
    },
  });

  return ast;
};

const argumentTransformer = (options = {}) => (ast) => {
  csstree.walk(ast, {
    leave(node) {
      if (node.type === 'Function') {
        const children = node.children.copy();

        node.children.clear();

        const argNodes = [];
        let currentArg = null;

        for (const argToken of children) {
          if (argToken.type === 'WhiteSpace') {
            continue;
          }

          if (!currentArg || argToken.type === 'Operator' && argToken.value === ',') {
            currentArg = argToken.type === 'Operator' ? [] : [argToken];

            argNodes.push(currentArg);
          } else {
            currentArg.push(argToken);
          }
        }

        for (const arg of argNodes) {
          if (arg.length === 0) {
            continue;
          }

          let argNode;

          if (arg.length === 1) {
            argNode = arg[0];
          } else {
            argNode = {
              type: 'Function',
              name: '_join',
              children: new csstree.List(),
            };

            for (const argToken of arg) {
              argNode.children.appendData(argToken);

              if (argToken !== arg[arg.length - 1]) {
                const operator = {
                  type: 'Operator',
                  value: ',',
                };

                argNode.children.appendData(operator);

                const whitespace = {
                  type: 'WhiteSpace',
                  value: ' ',
                };

                argNode.children.appendData(whitespace);
              }
            }
          }

          node.children.appendData(argNode);

          if (arg !== argNodes[argNodes.length - 1]) {
            const operator = {
              type: 'Operator',
              value: ',',
            };

            node.children.appendData(operator);

            const whitespace = {
              type: 'WhiteSpace',
              value: ' ',
            };

            node.children.appendData(whitespace);
          }
        }
      }
    }
  });

  return ast;
};

const operatorTransformer =
  (options = {}) =>
  (ast) => {
    const valueTypes = [
      'Number',
      'Dimension',
      'Function',
      'Parentheses',
      'String',
      'Percentage',
      'Raw',
    ];

    [
      ['*', '/'], ['+', '-']
    ].map((operators) => {
      csstree.walk(ast, {
        leave(node, item, list) {
          if (node.type === 'Operator' && operators.includes(node.value.trim())) {
            const operator = node.value.trim();
            const children = list.copy();

            children.clear();

            let prev = item.prev;

            while (prev.data.type === 'WhiteSpace') {
              const p = prev;

              prev = prev.prev;

              list.remove(p);
            }

            list.prevUntil(prev, (data, item) => {
              if (!valueTypes.includes(data.type)) {
                return true;
              }

              children.prependData(data);
              list.remove(item);
            });

            children.appendData({
              type: 'Operator',
              value: ',',
            });

            children.appendData({
              type: 'WhiteSpace',
              value: ' ',
            });

            let next = item.next;

            while (next.data.type === 'WhiteSpace') {
              const n = next;

              next = next.next;

              list.remove(n);
            }

            list.nextUntil(next, (data, item) => {
              if (!valueTypes.includes(data.type)) {
                return true;
              }

              children.appendData(data);
              list.remove(item);
            });

            list.insertData(
              {
                type: 'Function',
                name: Object.assign(
                  {
                    '+': 'add',
                    '-': 'subtract',
                    '*': 'multiply',
                    '/': 'divide',
                  },
                  options.operators
                )[operator],
                children,
              },
              item.next
            );

            list.remove(item);
          }
        },
      });
    });

    return ast;
  };
    
const callbackTransformer =
  (callback = () => {}) =>
  (ast) => {
    csstree.walk(ast, {
      leave(node) {
        callback(node);
      },
    });

    return ast;
  };

const cssToJS = (input) => {

}

/**
 * Utility fucntion that evaluates a css expression.
 * @alias eval
 * @param {string} A css expression
 * @param {object} context An object that is transformed into css variables to be evaluated
 * @returns {(string|number)} Either a css expression or a number
 */
export default function evaluate(input, context = {}, options = {}) {
  console.log('******* EVAL: ', input);
  if (!isNaN(Number(input))) {
    return Number(input);
  }

  let _eval;

  let ast;

  try {
    ast = parse(input, {
      context: 'value'
    });
  } catch (e) {
    console.error(e);
    return;
  }

  let env = getEnv();

  // env = Object.assign({}, ...Object.entries(env).map(([key, value]) => {
  //   console.log('CREATE FN PROXY: ', key);
  //   value = new Proxy(value, {
  //     apply: (target, thisArg, args) => {
  //       return target(...args.map(_eval));
  //     }
  //   });
  //   return {
  //     [key]: typeof value === 'function' ? value : () => value
  //   };
  // }));

  let { add, subtract, multiply, divide, ...fn } = functions;

  console.log('fn keys: ', Object.keys(fn));

  let i = 0;
  
  fn = Object.assign({}, ...Object.entries(fn).map(([key, value]) => {
    console.log('CREATE FN PROXY: ', key);
    value = new Proxy(value, {
      apply: (target, thisArg, args) => {
        const res = Reflect.apply(target, thisArg, args);

        i++;

        if (i > 100) {
          console.log('EXIT; ', i);
          process.exit();
        }

        console.log('FN RESULT: ', key, res, typeof res, target);
        // try {
        //   const r = _eval(res);
        //   return r;
        // } catch (e) {
        //   console.error(e); 
        // }
        return res;
        // return stripCalc(res);
      }
    });
    return {
      [key]: value
    };
  }));

  env = Object.assign({}, env, {
    _var (name, value) {
      const key = getValue(name).replace(/^--/, '');
  
      return context[key] || value;
    },
    calc (expression) {
      console.log('******* CALC:', expression);
      // return _eval(expression);
      return expression;
    },
  }, fn);

  console.log('ENV: ', Object.keys(env));


  const undef = {};
  // const ignore = ['calc', '_var', '_join'];
  const ignore = [];

  const transformers = [
    // nameTransformer({
    //   functions: {
    //     var: '_var',
    //   },
    // }),
    literalTransformer({
      functions: env
    }),
    operatorTransformer(),
    argumentTransformer(),
    callbackTransformer((node) => {
      if (node.type === 'Function') {
        const name = camelize(node.name);
        const def = env[name];

        if (!ignore.includes(name) && typeof def === 'undefined' && !undef[name]) {
          undef[name] = function () {
            
            const call = `${name}(${[...arguments].join(', ')})`;

            console.log('CALL UNDEFINED: ', call);
            return call;
          };
        }
      }
    }),
  ];

  // console.log('PREPROCESS: ', input);

  env = Object.assign({}, env, undef);

  // const fnk = Object.keys(env);
  // const fnv = Object.values(env);

  _eval = (input) => {
    console.log('CALL _eval: ', input);
    input = stripCalc(input);

    if (isNumber(input)) {
      return input;
    }

    input = String(input);
    input = stringify(
      (transformers || []).reduce(
        (ast, transformer) => {
          try {
            ast = transformer.call(this, ast);
          } catch (e) {
            console.error(e);
          }
          return ast;
        },
        ast
      )
    );

    const f = new Function(
      ...Object.keys(env),
      // ...Object.keys(undef),
      `
      return (${input});
    `);

    let result ;
    
    try {
      result = f(
        ...Object.values(env),
        // ...Object.values(undef)
      );
    } catch (e) {
      console.error(e);
    }

    result = stripCalc(result);

    if (!isNaN(Number(result))) {
      result = Number(result);
    }

    return result;
  }

  const result = _eval(input);

  return result;
}
