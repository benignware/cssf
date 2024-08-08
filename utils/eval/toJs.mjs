import { argumentTransformer } from "./transformers/argumentTransformer.mjs";
import { literalTransformer } from "./transformers/literalTransformer.mjs";
import { operatorTransformer } from "./transformers/operatorTransformer.mjs";
import { calcTransformer } from "./transformers/calcTransformer.mjs";

import { CSS } from '../ast/CSS.mjs';
import { unwrap } from "../calc/unwrap.mjs";


export const toJS = (input, options = {}) => {
  let {
    operators = {
      '+': '_add',
      '-': '_subtract',
      '*': '_multiply',
      '/': '_divide',
    },
    validIdentifiers = [],
  } = options;

  validIdentifiers.push(...Object.values(operators));

  let ast;

  try {
    ast = CSS.parse(input, {
      context: 'value'
    });
  } catch (e) {
    console.error(e);
    return;
  }
  
  const transformers = [
    operatorTransformer({
      operators,
    }),
    calcTransformer(),
    literalTransformer({
      validIdentifiers,
      undef: '_undef',
    }),
    argumentTransformer(),
  ];

  let output = CSS.stringify(
    (transformers).reduce(
      (ast, transformer) => {
        try {
          ast = transformer.call(this, ast);
        } catch (e) {
          // console.error(e);
        }
        return ast;
      },
      ast
    )
  );

  output = unwrap(output);

  return output;
}

export default toJS;