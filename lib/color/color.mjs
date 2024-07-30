import chroma from 'chroma-js';
// import { rgb2hsl } from './rgb2hsl.mjs';
// import { hsl2rgb } from './hsl2rgb.mjs';
import { isNumber, parseArgs, parseFn, replaceIdentifiers, stripCalc, isFunction, hasVar, isChar, hasVars } from '../utils.mjs';
import rgba from '../rgba/rgba.mjs';
// import hsla from '../rgba/hsla.mjs';

const COLOR_SPACES = [
  'srgb',
  'srgb-linear',
  'display-p3',
  'a98-rgb',
  'prophoto-rgb',
  'rec2020',
  'xyz',
  'xyz-d50',
  'xyz-d65',
];

/**
 * Specifies a color
 * @param {string} colorspace A css colorspace
 * @param {string} c1 Color channel 1
 * @param {string} c2 Color channel 2
 * @param {string} c3 Color channel 3
 * @param {string} a Alpha channel
 * @returns {string} The resulting color
 */
function color(from = null, colorspace, c1, c2, c3, a) {
  const args = parseArgs([...arguments].join(', '), { tokens: true });

  from = args[0] === 'from' ? args[1] : null;
  colorspace = args.find((arg) => COLOR_SPACES.includes(arg)) || 'srgb';
  const isRelative = !!from;

  if (colorspace !== 'srgb') {
    throw new Error(`Unsupported colorspace ${colorspace}`);
  }

  let cArgs = (from ? args.slice(2) : args)
    .filter((arg) => arg !== colorspace)
    .filter((arg) =>
      isNumber(arg) || arg.startsWith('calc') || isChar(arg) || isVar(arg)
    );

  cArgs = isRelative ? Object.values(Object.assign({}, 'rgb', cArgs)) : cArgs;

  [c1, c2, c3, a] = cArgs.map((char, index) => cArgs[index] || char);

  const c = [c1, c2, c3, a];

  const isDynamic = cArgs.some((arg) => hasVars(arg));

  let r, g, b;

  if (isRelative) {
    if (isRelative && isDynamic) {
      return `color(${input})`;
    }

    let fromR, fromG, fromB, fromA;

    if (from.startsWith('#') || !isFunction(from)) {
      try {
         [fromR, fromG, fromB] = chroma(from).rgb();
      } catch (e) {
        console.error(e);
        throw new Error(`Unsupported color ${from}`);
      }
    } else {
      const [fromName, ...fromArgs] = parseFn(from, { tokens: true });

      const isIdentity = c.every((v) => isChar(v));

      if (fromName.startsWith('color') && isIdentity) {
        return from.replace(/\//g, ' / ').replace(/\s+/g, ' ');
      }

      if (fromName !== 'color') {
        from = rgba(`from ${fromName}(${fromArgs.join(' ')}) r g b / a`);
      }

      // const nestedFrom = !!fromArgs.find((arg) => arg.startsWith('from'));
      
      // if (nestedFrom) {
      //   console.log('NESTED FROM...');
      //   from = fromName === 'color'
      //     ? color('from', ...fromArgs)
      //     : rgba('from', ...fromArgs)

      //   if (!from) {
      //     throw new Error(`Unsupported color function ${fromName}`);
      //   }
      // }

      // from = fromName === 'color'
      //   ? color(...fromArgs)
      //   : rgba('from', ...fromArgs);

      [fromR, fromG, fromB, fromA] = parseFn(from, { tokens: true }).slice(1);

      // console.log('[fromR, fromG, fromB, fromA]: ', [fromR, fromG, fromB, fromA]);

      if (fromName !== 'color') {
        // normalize values
        fromR = `(${stripCalc(fromR)} / 255)`;
        fromG = `(${stripCalc(fromG)} / 255)`;
        fromB = `(${stripCalc(fromB)} / 255)`;
        
        if (typeof fromA === 'undefined' && ['rgba', 'hsla'].includes(fromName)) {
          fromA = 1;
        }
      }
    }

    const map = { r: fromR, g: fromG, b: fromB, a: fromA };

    [r, g, b, a] = c.map((v, index) => {
      if (typeof v === 'undefined') {
        return;
      }

      if (isChar(v)) {
        return map[v];
      }

      v = replaceIdentifiers(v, map);

      return v; 
    })
  } else {
    [r, g, b, a]  = c;
  }

  [r, g, b, a] = [r, g, b, a].map((v) => {
    v = stripCalc(v);
    return typeof v === 'undefined' || isNumber(v) ? v : `calc(${v})`;
  });
  
  let result = `color(${colorspace} ${r} ${g} ${b}${typeof a !== 'undefined' ? ` / ${a}` : ''})`;

  return result;
}

export default color;
