import * as sass from 'sass';

import { RenderTag } from '../utils/render/getRenderTag.mjs';
import { describe } from '../utils/meta/describe.mjs';

const kebabCase = (string) =>
  string.replace(/^[a-z]|[A-Z]/g, (c, i) => (i ? '-' : '') + c.toLowerCase());

const unit = (value) => {
  if (!isNaN(Number(value))) {
    return '';
  }

  return (String(value).match(/^s*[-\d.e]+([a-z%]{2,})/) || [])[1] || '';
};

// const getArgs = (...args) => {
//   return [...args];
  // return args.map(arg => {
  //   if (arg instanceof sass.SassColor) {
  //     return `rgba(${arg.getR()}, ${arg.getG()}, ${arg.getB()}, ${arg.getA()})`;
  //   }

  //   if (arg instanceof sass.SassNumber) {

  //     // return arg.getUnit()
  //     //   ? `${arg.getValue()}${arg.getUnit()}`
  //     //   : arg.getValue();
  //     return arg;
  //   }

  //   if (arg instanceof sass.SassString) {
  //     return arg.getValue ? arg.getValue() : arg;
  //   }

  //   return String(arg) !== 'null' ? String(arg) : undefined;
  // });
// };

const fnProxy = (fn) => {
  const name = fn.name;
  const f = function (...args) {
    args = args.map(s => {
      // if (s instanceof sass.SassColor) {
      //   return `rgba(${s.getR()}, ${s.getG()}, ${s.getB()}, ${s.getA()})`;
      // }

      // if (s instanceof sass.SassNumber) {
      //   return s.getUnit()
      //     ? `${s.getValue()}${s.getUnit()}`
      //     : s.getValue();
      // }

      // if (s instanceof sass.SassString) {
      //   return s.getValue ? s.getValue() : s;
      // }

      // return String(s) !== 'null' ? String(s) : 'xxxxxxx';
      return s;
    });
    // args = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    // console.log('CALL SASS PROXY FN: ', name, args.length === 1 ? args[0]);
    
    const result = fn(...args);

    if (result instanceof sass.SassString) {
      return result;
    }

    if (typeof result === 'number' || !isNaN(parseFloat(result))) {
      const u = unit(result);
      return new sass.SassNumber(parseFloat(result), u);
    }

    if (typeof result === 'string') {
      const hasQuotes = result.startsWith('"') && result.endsWith('"');

      if (hasQuotes) {
        const unquoted = result.replace(/^"|"$/g, '');
        return new sass.SassString(unquoted, { quotes: true });
      }

      return new sass.SassString(result, {
        quotes: false
      });
    }

    return new sass.Value(result);
  };

  Object.defineProperty(f, 'name', { value: name, writable: false });

  return f;
};

export const getSassProxy = (env = {}, options = {}) => {
  const { meta } = options;
  return Object.keys(env).reduce((acc, key) => {
    
    const fn = env[key];
    const fnMeta = meta[key] || describe(fn);

    const p = fnMeta.params.map(({ name, value }) => `$${name}${value ? `: ${value}` : ''}`).join(', ');
    const sig = `${key}(${p})`;
    const fnp = fnProxy(fn);
    acc[sig] = fnp;

    const kebab = kebabCase(key);

    if (kebab !== key) {
      const sig = `${kebab}(${p})`;
      acc[sig] = fnp;
    }
    
    return acc;
  }, {});
};

export class SassTag extends RenderTag {
  get env() {
    return getSassProxy(super.env, {
      meta: this.meta
    });
  }

  render(string) {
    const functions = this.env;
    const result = sass.compileString(string, {
      functions
    });

    if (!result) {
      return '';
    }
    
    const { css } = result;

    return css;
  }
}

export const getSassTag = (env = {}, options = {}) => {
  return new SassTag(env, options);
}

export const scssf = getSassTag();

export default scssf;
