import { hsl2rgb } from './hsl2rgb.mjs';
import {
    isNumber, isChar, isVar, hasVars,
    isFunction, parseArgs, parseFn, stripCalc,
    replaceIdentifiers, toDecimal
} from '../utils.mjs';
import chroma from 'chroma-js';

export function color(from, colorspace, c1, c2, c3, A) {
  const input = [...arguments].join(' ');
  const args = parseArgs(input, { tokens: true });
  
  from = (
    args.find((arg, index, array) =>
      arg.startsWith('from') && arg.length > 4
      || index > 0 &&  array[index - 1] === 'from') || ''
  ).replace(/^from\s*/, '');
  colorspace = args.find((arg) => !arg.startsWith('from') && /^[a-z-]{2,}$/.test(arg));
  
  let cArgs = args.filter((arg) => !arg.startsWith('from') && (!from || arg !== from) && (!colorspace || arg !== colorspace));

  console.log('cArg', cArgs);

  const isRelative = !!from;

  const components = {
    'srgb': ['r', 'g', 'b'],
    'lab': ['l', 'a', 'b'],
  }[colorspace];

  const method = {
    'srgb': 'rgb',
    'lab': 'lab',
  }[colorspace];

  cArgs = from ? Object.values(Object.assign({}, components, cArgs)) : cArgs;

  let c = cArgs.map((char, index) => cArgs[index] || char);

  if (isRelative) {
    let cmap = {};
        
    try {
      const chr = chroma(from);

      console.log('METHOD: ', method, Reflect.has(chr, method));

      if (Reflect.has(chr, method)) {
        let result = chr[method]();

        if (method === 'lab') {
          result = result.map((v, index) => {
            if (index === 0) {
              return v;
            }

            return toDecimal(v);
          });
        }

        console.log('RESULT: ', result);

        Object.assign(cmap, ...result.map((v, index) => ({
          [components[index]]: v
        })));
      } else {
        console.log('Unsupported method', method);
      }
      
      cmap['A'] = chr.alpha();
    } catch (e) {
      console.error(e);
      throw new Error(`Unsupported color ${from}`, e);
    }

    console.log('C: ', c);
    console.log('cmap', cmap);

    c = c.map((v) => {
      if (typeof v === 'undefined') {
        return;
      }

      if (isChar(v)) {
        return cmap[v];
      }

      v = replaceIdentifiers(v, cmap);

      return v;
    });
  };

  console.log('replaced', c);

  [c1, c2, c3, A] = c;

  return `color(${[colorspace, c1, c2, c3, A && '/', A].join(' ')})`;
}

const colorFn = (
  name,
  components, 
  resolve = () => {}
) => {
  // const cs = colorspace;
  // const components = name.substring(0, 3).split('');

  name = 'color';

  return function (from = null, colorspace = null, c1, c2, c3, A = null) {
    const input = [...arguments].join(' ');
    const args = parseArgs(input, { tokens: true });
    
    from = (
      args.find((arg, index, array) =>
        arg.startsWith('from') && arg.length > 4
        || index > 0 &&  array[index - 1] === 'from') || ''
    ).replace(/^from\s*/, '');
    colorspace = args.find((arg) => !arg.startsWith('from') && /^[a-z-]{2,}$/.test(arg));
    
    let cArgs = args.filter((arg) => !arg.startsWith('from') && (!from || arg !== from) && (!colorspace || arg !== colorspace));

    cArgs = from ? Object.values(Object.assign({}, components, cArgs)) : cArgs;

    let c = cArgs.map((char, index) => cArgs[index] || char);

    const isRelative = !!from;
    const isIdentity = isRelative && c.every((v) => isChar(v));
    const isDynamic = c.some((arg) => hasVars(arg));

    // if (isIdentity) {
    //   return from.replace(/\//g, ' / ').replace(/\s+/g, ' ');
    // }

    console.log('from', from);
    const method = components;

    if (isRelative) {
      if (isDynamic) {
        return `${name}(${input})`;
      }

      let cmap = {};

      console.log('method: ', method, Reflect.has(chr, method));

      // if (from.startsWith('#') || !isFunction(from)) {
      
      if (Reflect.has(chr, method)) {
        let chr;

        try {
          chr = chroma(from);
        } catch (e) {
          console.error(e);
          throw new Error(`Unsupported color ${from}`);
        }

        if (!chr)  {
          return 'error';
        }

        console.log('PARSED', chr);

        const result = chr[method]();

        console.log('result: ', result);

        Object.assign(cmap, ...result.map((v, index) => ({
          [components[index]]: v
        })));
        
        cmap['A'] = chr.alpha();
      }
      console.log('C: ', c);
      console.log('cmap', cmap);

      c = c.map((v) => {
        if (typeof v === 'undefined') {
          return;
        }

        if (isChar(v)) {
          return cmap[v];
        }

        v = replaceIdentifiers(v, cmap);

        return v;
      });

      console.log('replaced', c);
    }

    [c1, c2, c3, A] = c;

    console.log('args', from, colorspace, c1, c2, c3, A);

    if (name === 'color' && !colorspace) {
      colorspace = 'srgb';
    }

    return `${name}(${[colorspace, c1, c2, c3, A && '/', A].filter(arg => arg).join(' ')})`;
  }
}

const rgb = colorFn('rgb', 'rgb');

const hsl = colorFn('hsl', 'hsl');

export { rgb, hsl };


/**
 * Specifies a rgb color
 * @param {string} from A color to convert from
 * @param {string} r Red channel
 * @param {string} g Green channel
 * @param {string} b Blue channel
 * @param {string} a Alpha channel
 * @returns {string} The resulting rgb color
 */
function rgba(from = null, r, g, b, a) {
  const input = [...arguments].join(' ');
  const args = parseArgs(input, { tokens: true });

  from = args[0] === 'from' ? args[1] : null;

  const isRelative = !!from;
  let cArgs = (from ? args.slice(2) : args)
    .filter((arg) =>
      isNumber(arg) || arg.startsWith('calc') || isChar(arg) || isVar(arg)
    );

  cArgs = isRelative ? Object.values(Object.assign({}, 'rgb', cArgs)) : cArgs;

  [r, g, b, a] = cArgs.map((char, index) => cArgs[index] || char);

  const c = [r, g, b, a];

  const isDynamic = cArgs.some((arg) => hasVars(arg));

  if (isRelative && isDynamic) {
    return `rgba(${input})`;
  }

  let
      fromName, fromArgs,
      fromR, fromG, fromB, fromA;

  if (isRelative) {
    if (from.startsWith('#') || !isFunction(from)) {
      try {
         [fromR, fromG, fromB] = chroma(from).rgb();
         fromA = 1;
      } catch (e) {
        console.error(e);
        throw new Error(`Unsupported color ${from}`);
      }
    } else {
      [fromName, ...fromArgs] = parseFn(from, { tokens: true });
      const nestedFrom = !!fromArgs.find((arg) => arg.startsWith('from'));

      const isIdentity = c.every((v) => isChar(v));

      if (fromName.startsWith('rgb') && isIdentity) {
        return from.replace(/\//g, ' / ').replace(/\s+/g, ' ');
      }
      
      if (nestedFrom) {
        from = fromName === 'color'
          ? color('from', ...fromArgs)
          : rgba('from', ...fromArgs)

        if (!from) {
          throw new Error(`Unsupported color function ${fromName}`);
        }
      }

      [fromR, fromG, fromB, fromA] = parseFn(from, { tokens: true })
        .slice(fromName === 'color' ? 2 : 1);

      if (fromName === 'color') {
        // normalize values
        fromR = `(${stripCalc(fromR)} * 255)`;
        fromG = `(${stripCalc(fromG)} * 255)`;
        fromB = `(${stripCalc(fromB)} * 255)`;
        
        if (typeof fromA === 'undefined' && ['rgba', 'hsla'].includes(fromName)) {
          fromA = 1;
        }
      } else if (fromName.startsWith('hsl')) {
        const fromH = fromR;
        const fromS = `calc(${stripCalc(fromG)} / 100%)`;
        const fromL = `calc(${stripCalc(fromB)} / 100%)`;
        
        [fromR, fromG, fromB] = hsl2rgb(fromH, fromS, fromL);

        fromR = `calc(${fromR} * 255)`;
        fromG = `calc(${fromG} * 255)`;
        fromB = `calc(${fromB} * 255)`;
      }
    }

    const map = { r: fromR, g: fromG, b: fromB, a: fromA };

    [r, g, b, a] = c.map((v) => {
      if (typeof v === 'undefined') {
        return;
      }

      if (isChar(v)) {
        return map[v];
      }

      v = replaceIdentifiers(v, map);

      return v;
    });
  }

  [r, g, b, a] = [r, g, b, a].map((v) => {
    v = stripCalc(v);
    return typeof v === 'undefined'
      || isNumber(v)
      || isVar(v)
      ? v : `calc(${v})`;
  });

  const result = typeof a === 'undefined'
    ? `rgb(${r} ${g} ${b})`
    : `rgba(${r} ${g} ${b} / ${a})`;

  return result;
}

export default rgba;
