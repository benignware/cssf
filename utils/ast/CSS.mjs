import * as csstree from 'css-tree';
import { isNumber } from '../calc/number.mjs';

export class CSS {
  static parse(input, options = {}) {
    if (typeof input !== 'string') return input;
  
    try {
      return csstree.parse(input, {
        parseCustomProperty: true,
        context: options.context || !/\{/.test(input) ? 'value' : undefined,
        ...options
      });
    } catch (e) {
      console.error(`Could not parse '${input}'`, e);
      return null;
    }
  }

  static stringify(ast, options = {}) {
    if (!ast) return '';
    if (typeof ast === 'string') {
      ast = CSS.parse(ast, options)
    };

    const { transformers = [] } = options;

    ast = (transformers).reduce(
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

    try {
      return csstree.generate(ast, {
        // mode: 'spec',
        mode: 'safe',
        ...options
      });
    } catch (e) {
      console.error('Could not stringify', e);
      return '';
    }
  }

  static parseFn(css) {
    return css;
  }
}
