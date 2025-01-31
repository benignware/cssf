// CSS.mjs
import * as csstree from 'css-tree';
import { normalizeTransformer } from './transformers/normalizeTransformer.mjs';

export class CSS {
  static parse(input, options = {}) {
    if (typeof input !== 'string') return input;
    if (input === '') return {};

    const { context = !/\{/.test(input) ? 'value' : undefined } = options;

    try {
      // Parse the CSS
      const ast = csstree.parse(input, {
        parseCustomProperty: true,
        positions: true,
        context,
        ...options
      });
      
      return ast;
    } catch (e) {
      console.error(`Could not parse CSS "${input.substring(0, 100)}": ${e.message}`);
      return null;
    }
  }

  static stringify(ast, options = {}) {
    if (!ast) return '';

    if (typeof ast === 'string') {
      // try {
        ast = CSS.parse(ast, options);
      // } catch (e) {
      //   // console.error('Could not stringify', e);
      //   return null;
      // }
    }

    if (!ast) return '';

    const { normalize = true, transformers = [], ...cssTreeOptions } = options;

    // Apply transformers
    ast = transformers.reduce((ast, transformer) => {
      // try {
        return transformer.call(this, ast);
      // } catch (e) {
      //   // Handle transformer errors
      //   console.error('Transformer error', e);
      //   return ast;
      // }
    }, ast);

    // Apply whitespace transformer if minify is false
    if (normalize) {
      ast = normalizeTransformer()(ast);
    }

    try {
      return csstree.generate(ast, {
        mode: 'safe',
        ...cssTreeOptions
      });
    } catch (e) {
      // console.error('Could not stringify', e);
      return '';
    }
  }

  static parseFn(css) {
    return css;
  }
}
