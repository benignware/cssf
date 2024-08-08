import { getColorArgs } from './getColorArgs.mjs';
import { convertColor } from './convertColor.mjs';
import { isFunction, isHex, isIdentifier, isChar, replaceIdentifiers } from '../../lib/utils.mjs';

const colorFns = new Map();

export const registerColorFn = (name, options) => {
  colorFns.set(name, options);

  if (options.alias) {
    options.alias.forEach(alias => colorFns.set(alias, options));
  }
}

const getConverterSpace = (color) => {
  if (isHex(color)) {
    return 'hex';
  }

  if (isFunction(color) && colorFns.has(color.name)) {
    const fnMeta = colorFns.get(color.name);

    if (fnMeta.colorspace) {
      const [ mainSpace, subSpace ] = fnMeta.colorspace;

      return subSpace || mainSpace;
    }
  }

  if (isIdentifier(color)) {
    return 'key';
  }

  return null;
}

class IdentMap {
  constructor(object) {
    this.map = new Map(Object.entries(object));
  }

  set (key, value) {
    this.map.set(key, value);
  }

  get (key) {
    return this.map.get(key);
  }
}

export const getColorFn = (name, options = {}) => {
  const {
    components = name.replace(/a$/, '').split(''),
    colorspace: defspace,
  } = options;
  const [ fMainSpace, fSubSpace ] = defspace ? defspace.split('/') : [];

  function fn (...args) {
    let { from, colorspace: argSpace, c1, c2, c3, a } = getColorArgs(...args);
    const colorSpace = !fMainSpace ? argSpace : undefined;

    console.log('args', from, colorSpace, c1, c2, c3, a);

    if (from) {

      let [f1, f2, f3, fa] = [...getColorArgs(from)];

      console.log('fromArgs', f1, f2, f3, fa);
      const fromSpace = getConverterSpace(from);
      const toSpace = fSubSpace || fMainSpace || argSpace;

      console.log('fromSpace', fromSpace, 'toSpace', toSpace);

      if (fromSpace && toSpace) {
        [f1, f2, f3] = convertColor(fromSpace, toSpace, f1, f2, f3);

        console.log('converted', f1, f2, f3, fa);

        if (!c1 && !c2 && !c3) {
          return `${name}(${f1} ${f2} ${f3})`;
        }

        console.log('components: ', components);

        const cMap = Object.assign(
          {},
          ...[f1, f2, f3].map((v, index) => ({
            [components[index]]: v
          }))
        );

        console.log('cMap', cMap);

        [c1, c2, c3, a] = [c1, c2, c3, a].map((v) => {
          if (typeof v === 'undefined') {
            return;
          }
    
          if (isChar(v)) {
            return cMap[v];
          }
    
          v = replaceIdentifiers(v, cMap);
    
          return v;
        });

        console.log('replaced', c1, c2, c3, a);
      }
    } 

    return `${name}(${
      [colorSpace, c1, c2, c3, a !== 1 ? '/ ' + a : null]
        .filter(arg => typeof arg !== 'undefined' && arg !== null)
        .join(' ')
      })`;
  }

  Object.defineProperty(fn, 'name', { value: name, writable: false });

  const meta = {
    ...options,
    components,
    name,
    fn,
  };

  colorFns.set(name, meta);

  return fn;
}