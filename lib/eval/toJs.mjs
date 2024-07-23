import { argumentTransformer } from "./transformers/argumentTransformer.mjs";
import { literalTransformer } from "./transformers/literalTransformer.mjs";
import { operatorTransformer } from "./transformers/operatorTransformer.mjs";

import { parse, stringify } from '../utils.mjs';

import { calcTransformer } from "./transformers/calcTransformer.mjs";

const toJS = (input, options = {}) => {
  const {
    operators = {
      '+': 'add',
      '-': 'subtract',
      '*': 'multiply',
      '/': 'divide',
    },
    validIdentifiers = [],
    undef = '_undef',
  } = options;


  let ast;

  try {
    ast = parse(input, {
      context: 'value'
    });
  } catch (e) {
    console.error(e);
    return;
  }
  
  const transformers = [
    calcTransformer(),
    literalTransformer({
      undef,
      validIdentifiers,
    }),
    operatorTransformer({
      operators,
    }),
    argumentTransformer(),
  ];

  const output = stringify(
    (transformers).reduce(
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

  return output;
}

export default toJS;