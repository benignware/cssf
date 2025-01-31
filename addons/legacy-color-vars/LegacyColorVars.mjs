import { colorVarTransformer } from '../../utils/render/transformers/colorVarTransformer.mjs';
import { CSS } from '../../utils/ast/CSS.mjs';
import { parseArgs } from '../../lib/utils.mjs';

export class LegacyColorVars {
  _options = {};

  constructor(options = {}) {
    this._options = {
      ...this._options,
      ...options,
    };
  }

  _call(fn, ...args) {
    args = args.map((s) => {
      const a = Array.isArray(s)
        ? parseArgs(s).map(s => s.trim())
        : [s];
      
      let r = a.map((s) => {
        if (!s.match(/var\(--/)) {
          return s;
        }
        
        return CSS.stringify(s, {
          transformers: [colorVarTransformer(this._options)],
        })
      }).join(', ');
      
      return r;
    });

    // console.log('PLUGIN CALL AFTER ARGS: ', fn.name, args);

    const ret = this.__next(fn, ...args);

    // console.log('ret ', ret);
    return ret;
  }

  render(input) {
    const { transformOnRender = true, ...options } = this._options;

    if (transformOnRender) {
      input = CSS.stringify(input, {
        transformers: [colorVarTransformer(this._options)],
      });
    }
    
    const result = this.__next(input);

    return result;
  }
}
