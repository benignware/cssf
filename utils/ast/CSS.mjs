import * as csstree from 'css-tree';
import { isNumber } from '../calc/number.mjs';

export class CSS {
  static parse(input, options = {}) {
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
