import { kebabCase } from 'change-case';
import { getColorArgs } from './getColorArgs.mjs';
import { ColorConverter } from './ColorConverter.mjs';
import { replaceIdentifiers, hasIdentifiers } from '../ast/replaceIdentifiers.mjs';
import { parseFn } from '../ast/parseFn.mjs';
import { hexToRgb } from './hexToRgb.mjs';
import { isColorKey, keyToRgb } from './keyToRgb.mjs';
import { Env } from '../env/Env.mjs';
import { isNumber, number, unit, unwrap } from '../calc/number.mjs';
import { toNumeric } from '../calc/toNumeric.mjs';
import { toUnit } from '../calc/toUnit.mjs';
import { stripCalc } from '../calc/stripCalc.mjs';

const isChar = (input) => typeof input === 'string' && /^[a-z]$/u.test(input);
const isFunction = (input) => typeof input === 'string' && input.match(/^\w+\(.*\)$/);
const isHex = (input) => typeof input === 'string' && !!input.match(/^#[0-9a-f]{3,6}$/i);
const isIdentifier = (input) => typeof input === 'string' && !!input.match(/^[a-z][a-z0-9-_]*$/i);
// const hasIdentifiers = (input) => typeof input === 'string' && !!input.match(/^[a-z][a-z0-9-_]*\s*\(.*\)$/i);

export const colorConverter = new ColorConverter();

const colorEnv = new WeakMap();

export const getColorFn = function(name, colorSpace, conversions = {}, options = {}) {
  const { identifiers = null, units = ['', '', ''], legacyFormat = false, output = {}, input = {} } = options;
  const { colorSpace: outputColorSpace, funcName: outputFuncName, format, units: outputUnits = ['', '', ''] } = output;
  const { colorSpace: inputColorSpace, identifiers: inputIdentifiers, funcName: inputFuncName, units: inputUnits = ['', '', ''] } = input;

  colorConverter.addConversions(conversions);
  
  const isMultiColorSpace = Array.isArray(colorSpace);
  const colorSpaces = isMultiColorSpace ? colorSpace : [colorSpace];
  
  let colorSpaceIdentifiers = colorSpaces.reduce((acc, space) => {
      const ids = space.slice(space.length - 3);
      acc[space] = ids;
      return acc;
  }, {});

  colorSpaceIdentifiers = Object.assign({}, colorSpaceIdentifiers, typeof identifiers === 'string' || Array.isArray(identifiers) ? {
      [colorSpace]: identifiers
  } : identifiers);

  colorSpaceIdentifiers = Object.assign(
      {},
      ...Object.entries(colorSpaceIdentifiers).map(([key, value]) => ({
          [key]: Array.isArray(value) ? value : value.split('')
      }))
  );

  function fn(...args) {
      const input = [...arguments].join(', ');
      let { from, colorSpace: argSpace, c1, c2, c3, a } = getColorArgs(input);

      // console.log();
      // console.log('-------------------');
      // console.log('* ', name, ' - ', `${name}(${input})`);

      let fnName = name;

      let wasConverted = false;

      let outFrom = null;

      let result = null;

      if (from) {
          const toSpace = argSpace && colorSpaces.includes(argSpace) ? argSpace : colorSpace;

          let fromSpace = null;
          let fromColorArgs = null;

          let f = null;

          if (isFunction(from)) {
              const [fromName, ...fromArgs] = parseFn(from);
              const env = Env.getEnv();
              const fn = env[fromName];
              
              fromColorArgs = getColorArgs(fromArgs.join(', '));

              if (fn && colorEnv.has(fn)) {
                const { colorSpace: fnSpace, identifiers: fromIdentifiers } = colorEnv.get(fn);

                fromSpace = fromColorArgs.colorSpace || fnSpace;
              } else {
                // if (['rgb', 'rgba'].includes(fromName)) {
                //     fromSpace = 'rgb';
                // }
              }
                
          } else if (isHex(from)) {
            fromColorArgs = hexToRgb(from);
            fromSpace = 'rgb';
          } else if (isColorKey(from)) {
            fromColorArgs = keyToRgb(from);
            fromSpace = 'rgb';
          }

          if (!fromSpace) {
            if (inputColorSpace) {
              fromSpace = inputColorSpace;
              fromColorArgs = [...inputIdentifiers];
              outFrom = `from ${inputFuncName}(from ${from})`;
            }
          }

          if (fromSpace) {
            const needsConversion = fromSpace !== toSpace;
            const hasConversion = colorConverter.hasConversion(fromSpace, toSpace);
            const isValidConversion = needsConversion && hasConversion || !needsConversion;

            if (isValidConversion) {
              f = [...fromColorArgs];

              if (!wasConverted) {
                f = f.map(toNumeric);
                wasConverted = true;
              }

              f = f.map(v => stripCalc(v));
            }
            
            if (needsConversion && hasConversion) {
              f = colorConverter.convertColor(fromSpace, toSpace, ...f);
            }
          }

          if (!f) {
            result = `${name}(${input})`; // Return input if conversion fails

            return result;
          }

          const identifiers = colorSpaceIdentifiers[toSpace] || [];
          const [f1, f2, f3, fa] = f;
          const cMap = Object.assign(
              {},
              ...[f1, f2, f3].map((v, index) => ({
                  [identifiers[index] || `c${index + 1}`]: v
              }))
          );

          [c1, c2, c3, a] = [c1, c2, c3, a].map((v, i) => {
              if (typeof v === 'undefined') {
                  return f[i];
              }

              if (isChar(v)) {
                  return cMap[v];
              }

              v = replaceIdentifiers(v, cMap);
              return v;
          });

          // const identifiersLeft = [c1, c2, c3].some(v => hasIdentifiers(v, Object.keys(cMap)));

          // if (identifiersLeft) {
          //   // console.log('!!!! ', 'identifiers left');
          //   const s = `${name}(${input})`;
          //   // console.log('!!!! ', s);

          //   return s
          // }
      }

      if (outputColorSpace) {
        // console.log('> ', `to ${outputColorSpace}`);
          if (colorConverter.hasConversion(colorSpace, outputColorSpace)) {
            let c = [c1, c2, c3]
            
            if (!wasConverted) {
              c = c.map(toNumeric);
              wasConverted = true;
            }

            c = c.map(v => stripCalc(v));

            let converted = colorConverter.convertColor(colorSpace, outputColorSpace, ...c);

            fnName = outputFuncName || kebabCase(outputColorSpace);
            [c1, c2, c3] = converted;
          }
      }

      let c = [c1, c2, c3];

      c = c.map(v => {
        const w = unwrap(`calc(${stripCalc(v)})`);

        return w;
      });
  
      c = c.map((v, i) => toUnit(v, outputUnits[i] || units[i]), wasConverted);
      

      // console.log('$ ', `${fnName}(${c.join(', ')})`);

      [c1, c2, c3] = c;

      let outputArgs = [ outFrom, argSpace, c1, c2, c3]
        .filter(arg => typeof arg !== 'undefined' && arg !== null)
        .join(legacyFormat ? ', ' : ' ')

      if (typeof a !== 'undefined' && a !== 1) {
        outputArgs += legacyFormat ? ', ' : ' / ';
        outputArgs += a;
      }

      result = `${fnName}(${outputArgs})`;

      return result;
  }

  const argNames = isMultiColorSpace ? ['colorspace', 'c1', 'c2', 'c3'] : colorSpaceIdentifiers[colorSpace];

  const f = new Function('fn', 'argNames', `
    return function ${name}(${argNames.join(', ')}) {
      return fn(...arguments);
    }
  `)(fn, argNames || []);

  Object.defineProperty(f, 'name', { value: name, writable: false });

  const meta = {
      name,
      colorSpace,
      colorSpaces,
      identifiers,
      fn,
  };

  colorEnv.set(f, meta);

  return f;
};
