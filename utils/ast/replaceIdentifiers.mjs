import * as csstree from 'css-tree';
import { isNumber } from '../calc/number.mjs';
import { CSS} from '../ast/CSS.mjs';

export const replaceIdentifiers = (input, identifiers) => {
  if (isNumber(input)) {
    return input;
  }

  const ast = input.node ? input : CSS.parse(input);
  const visitor = {
    visit: 'Identifier',
    enter: (node) => {
      if (typeof identifiers[node.name] !== 'undefined') {
        const value = identifiers[node.name];

        if (isNumber(value)) {
          node.type = 'Number';
          node.value = String(value);
        }

        if (typeof value === 'string') {
          node.type = 'Raw';
          node.value = value;
        }
      }
    }
  };

  csstree.walk(ast, visitor);

  try {
    return CSS.stringify(ast);
  } catch (e) {
    console.error('Could not replace identifiers', e);
  }

  return input;
}