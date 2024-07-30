// import chroma from 'chroma-js';
import { rgb2hsl } from './rgb2hsl.mjs';
// import { hsl2rgb } from './hsl2rgb.mjs';
import { isNumber, parseArgs, parseFn, replaceIdentifiers, stripCalc, isFunction, toDecimal, isVar, isChar, hasVar, isDelimiter, toPercent, hasVars } from '../utils.mjs';
import color from '../color/color.mjs';
import chroma from 'chroma-js';
// import hsla from '../rgba/hsla.mjs';


/**
 * Specifies a hsla color
 * @param {string} from A color to convert from
 * @param {string} h Hue channel
 * @param {string} s Saturation channel
 * @param {string} l Lightness channel
 * @param {string} a Alpha channel
 * @returns {string} The resulting hsla color
 */
function hsla(from = null, h, s, l, a) {
  const input = [...arguments].join(' ');
  const args = parseArgs(input, { tokens: true });

  from = args[0] === 'from' ? args[1] : null;

  const isRelative = !!from;
  let cArgs = (from ? args.slice(2) : args)
    .filter((arg) =>
      isNumber(arg) || arg.startsWith('calc') || isChar(arg) || isVar(arg)
    );

  cArgs = isRelative ? Object.values(Object.assign({}, 'hsl', cArgs)) : cArgs;

  [h, s, l, a] = cArgs.map((char, index) => cArgs[index] || char);

  const c = [h, s, l, a];

  const isDynamic = cArgs.some((arg) => hasVars(arg));

  if (isRelative && isDynamic) {
    return `hsla(${input})`;
  }

  if (isRelative) {
    let fromH, fromS, fromL, fromR, fromG, fromB, fromA;

    if (from.startsWith('#') || !isFunction(from)) {
      try {
        [fromH, fromS, fromL] = chroma(from.trim()).hsl().map((v, i) => {
          if (isNaN(v)) {
            return 0;
          }

          if (i === 1 || i === 2) {
            return `${Math.round(v * 100)}%`;
          }

          return v;
        });
        fromA = 1;
      } catch (e) {
        console.error(e);
        throw new Error(`Unsupported color ${from}`);
      }
    } else {
      const [fromName, ...fromArgs] = parseFn(from, { tokens: true });
      const nestedFrom = !!fromArgs.find((arg) => arg.startsWith('from'));

      const isIdentity = c.every((v) => isChar(v));

      if (fromName.startsWith('hsl') && isIdentity) {
        return from.replace(/\//g, ' / ').replace(/\s+/g, ' ');
      }
      
      if (nestedFrom) {
        from = fromName === 'color'
          ? color('from', ...fromArgs)
          : hsla('from', ...fromArgs)

        if (!from) {
          throw new Error(`Unsupported color function ${fromName}`);
        }
      }

      [fromH, fromS, fromL, fromA] = parseFn(from, { tokens: true })
        .slice(fromName === 'color' ? 2 : 1);

      if (fromName.startsWith('rgb') || fromName === 'color') {
        fromR = `(${stripCalc(fromH)})`;
        fromG = `(${stripCalc(fromS)})`;
        fromB = `(${stripCalc(fromL)})`;

        if (fromName.startsWith('rgb')) {
          fromR = `calc(${fromR} / 255)`;
          fromG = `calc(${fromG} / 255)`;
          fromB = `calc(${fromB} / 255)`;
        }

        [fromH, fromS, fromL] = rgb2hsl(fromR, fromG, fromB);

        fromH = `${fromH}`;
        fromS = `${fromS} * 100%`;
        fromL = `${fromL} * 100%`;
      }
    }

    const map = { h: fromH, s: fromS, l: fromL, r: fromR, g: fromG, b: fromB, a: fromA };

    [h, s, l, a] = c.map((v, index) => {
      
      if (typeof v === 'undefined') {
        return c[index];
      }

      if (isChar(v)) {
        return map[v];
      }

      v = replaceIdentifiers(v, map);

      return v;
    });
  }

  [h, s, l, a] = [h, s, l, a].map((v) => {
    v = stripCalc(v);
    return typeof v === 'undefined'
      || isNumber(v)
      || isVar(v)
      ? v : `calc(${v})`;
  });
  
  const result = typeof a === 'undefined'
    ? `hsl(${h} ${s} ${l})`
    : `hsla(${h} ${s} ${l} / ${a})`;



  return result;
}

export default hsla;
