// getArgs.mjs
import { CSS } from './CSS.mjs';
import { stripCalc } from '../calc/stripCalc.mjs';

export const getArgs = (input, options = {}) => {
  let {
    separator = ' ',
    tokens = false, // If true, it will return all tokens as an array, regardless of separator
    subTokens = false,
    stripCalc: _stripCalc = false,
  } = options;

  if (typeof input === 'string') {
    input = CSS.parse(input);
  }

  if (!input.children) {
    return [];
  }

  const nodes = input.children;
  
  let args = nodes.reduce((acc, node, index, array) => {
    const isArgumentSeparator = node.type === 'Operator' && node.value === ',';

    if (tokens && Array.isArray(tokens) && tokens.includes(node.value)) {
      return acc;
    }

    if (!acc.length || isArgumentSeparator || tokens) {
      acc.push(subTokens ? [] : '');
    }
  
    if (!isArgumentSeparator) {
      let str = CSS.stringify(node);

      if (_stripCalc) {
        str = stripCalc(str);
      }

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
        acc[acc.length - 1] += current.length ? separator + str : str;
      }
    }
    return acc;
  }, []);

  args = tokens ? args.filter((arg) => arg !== '') : args;

  return args;
};