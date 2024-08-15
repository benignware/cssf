import { valueTransformer } from "./transformers/valueTransformer.mjs";

export const transformCss = (input, transformaers = [], options = {}) => {
  let ast;

  if (typeof input === 'string') {
    try {
      ast = CSS.parse(input, {
        ...options,
        // context: 'value'
      });
    } catch (e) {
      console.error(e);
      return;
    }
  } else {
    ast = input;
  }

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

  return output;
}