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

const getArgs = (...args) => {
  return [...args];
  return args.map(arg => {
    if (arg instanceof sass.SassColor) {
      return `rgba(${arg.getR()}, ${arg.getG()}, ${arg.getB()}, ${arg.getA()})`;
    }

    if (arg instanceof sass.SassNumber) {

      // return arg.getUnit()
      //   ? `${arg.getValue()}${arg.getUnit()}`
      //   : arg.getValue();
      return arg;
    }

    if (arg instanceof sass.SassString) {
      return arg.getValue ? arg.getValue() : arg;
    }

    return String(arg) !== 'null' ? String(arg) : undefined;
  });
};

const fnProxy = (fn) => {
  return function (args) {
    args = getArgs(...args);

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

    return result;
  };
};

export const getSassProxy = (env = {}, options = {}) => {
  return Object.keys(env).reduce((acc, key) => {
    const fn = env[key];
    const name = kebabCase(key);
    const meta = describe(fn);
    const p = meta.params.map(({ name, value }) => `$${name}${value ? `: ${value}` : ''}`).join(', ');
    const sig = `${key}(${p})`;
    acc[sig] = fnProxy(fn);
    return acc;
  }, {});
};

export class SassTag extends RenderTag {
  get env() {
    return getSassProxy(super.env);
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
