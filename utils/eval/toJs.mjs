import { argumentTransformer } from "./transformers/argumentTransformer.mjs";
import { literalTransformer } from "./transformers/literalTransformer.mjs";
import { operatorTransformer } from "./transformers/operatorTransformer.mjs";
import { calcTransformer } from "./transformers/calcTransformer.mjs";

import { CSS } from '../ast/CSS.mjs';
// import { unwrap } from "../calc/unwrap.mjs";
// import { unwrap } from "../calc/number.mjs";

export const toJS = (input, options = {}) => {
  let {
    operators = {
      '+': '_add',
      '-': '_subtract',
      '*': '_multiply',
      '/': '_divide',
    },
    validIdentifiers = [
      'calc',
      '_join',
      // '_var',
    ],
  } = options;

  validIdentifiers.push(...Object.values(operators));

  let ast;

  if (typeof input === 'string') {
    try {
      ast = CSS.parse(input, {
        // context: 'value'
      });
    } catch (e) {
      console.error(e);
      return;
    }
  } else {
    ast = input;
  }
  
  const transformers = [
    operatorTransformer({
      operators,
    }),
    literalTransformer({
      validIdentifiers,
      undef: '_undef',
    }),
    argumentTransformer(),
    calcTransformer(),
  ];

  let output = CSS.stringify(
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