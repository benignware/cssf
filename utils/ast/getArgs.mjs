import { CSS } from './CSS.mjs';
import { stripCalc } from '../calc/stripCalc.mjs';

export const getArgs = (fn, options = {}) => {
  let {
    separator = ' ',
    tokens = false,
    subTokens = false,
    stripCalc: _stripCalc = false,
  } = options;

  const nodes = fn.children.toArray();
  
  let args = nodes.reduce((acc, node, index, array) => {
    const isArgumentSeparator = node.type === 'Operator';
  
    if (!isArgumentSeparator) {
      let str = CSS.stringify(node);

      if (_stripCalc) {
        str = stripCalc(str);
      }

      if (!acc.length || tokens) {
        acc.push(subTokens ? [str] : str);
      } else {
        const current = acc[acc.length - 1];

        if (subTokens) {
          const prevNode = array[index - 1];
          const stringTypes = ['String', 'Identifier', 'Number', 'WhiteSpace' , 'Raw'];
          const isString = stringTypes.includes(node.type);
          const isPrevString = stringTypes.includes(prevNode && prevNode.type);

          if (prevNode && isString && isPrevString) {
            current[current.length - 1] += separator + str;
          } else {
            current.push(str);
          }
        } else {
          acc[acc.length - 1] += (acc[acc.length - 1].length && separator ? separator : ' ') + str;
        }
      }
    }

    if (isArgumentSeparator && index < array.length - 1) {
      acc.push(subTokens ? [] : '');
    }

    return acc;
  }, []);

  args = args.filter((arg) => arg);

  return args;
};