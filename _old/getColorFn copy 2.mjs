import { kebabCase } from 'change-case';
import { getColorArgs } from '../utils/colors/getColorArgs.mjs';
import { ColorConverter } from '../utils/colors/ColorConverter.mjs';
import { replaceIdentifiers } from '../utils/ast/replaceIdentifiers.mjs';
import { parseFn } from '../utils/ast/parseFn.mjs';
import { hexToRgb } from '../utils/colors/hexToRgb.mjs';
import { keyToRgb } from '../utils/colors/keyToRgb.mjs';
import { Env } from '../utils/env/Env.mjs';
import { isNumber, number, unit } from '../utils/calc/number.mjs';
import { stripCalc } from '../utils/calc/stripCalc.mjs';

const isChar = (input) => typeof input === 'string' && /^[a-z]$/u.test(input);
const isFunction = (input) => typeof input === 'string' && input.match(/^\w+\(.*\)$/);
const isHex = (input) => typeof input === 'string' && !!input.match(/^#[0-9a-f]{3,6}$/i);
const isIdentifier = (input) => typeof input === 'string' && !!input.match(/^[a-z][a-z0-9-_]*$/i);

const toNumericValue = (value) => {
  const n = number(value);
  const u = unit(value);

  if (isNaN(n) || n === 'NaN') return value;

  return u === '%' ? n / 100 :
         u === 'deg' ? n :
         u === 'turn' ? n * 360 :
         n;
}

const formatValue = (value, toUnit) => {
  const n = number(value);
  const u = unit(value);

  if (!isNaN(n) && n !== 'NaN' && !u) {
    return toUnit === '%' ? `${n * 100}%` :
           toUnit === 'deg' ? `${value}deg` :
           toUnit === 'turn' ? `${value}turn` :
           value;
  }

  return toUnit === 'deg' ? `calc(${stripCalc(value)} * 1deg)` :
         toUnit === '%' ? `calc(${stripCalc(value)} * 100%)` :
         value;
}


export const colorConverter = new ColorConverter();

const colorEnv = new WeakMap();

const applyFormatValues = (values, units) => {
  return values.map((value, index) => formatValue(value, units[index]));
};


export const getColorFn = function(name, colorSpace, conversions = {}, options = {}) {
  const { identifiers = null, units = ['', '', ''], legacyFormat = false, output = {}, input = {} } = options;
  const { colorSpace: outputColorSpace, funcName: outputFuncName, format, units: outputUnits } = output;
  const { colorSpace: inputColorSpace, identifiers: inputIdentifiers, funcName: inputFuncName, units: inputUnits = ['', '', ''] } = input;

  colorConverter.addConversions(conversions);

  const colorSpaces = Array.isArray(colorSpace) ? colorSpace : [colorSpace];
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
      const input = args.join(', ');
      let { from, colorSpace: argSpace, c1, c2, c3, a } = getColorArgs(input);
      let fnName = name;

      if (from) {
          const toSpace = argSpace && colorSpaces.includes(argSpace) ? argSpace : colorSpace;

          let fromSpace = null;
          let f = null;

          if (isFunction(from)) {
              const [fromName, ...fromArgs] = parseFn(from);
              const env = Env.getEnv();
              const fn = env[fromName];

              if (fn && colorEnv.has(fn)) {
                  const { colorSpace: fnSpace, identifiers: fromIdentifiers } = colorEnv.get(fn);
                  const fromColorArgs = getColorArgs(fromArgs.join(', '));
                
                  fromSpace = fromColorArgs.colorSpace || fnSpace;

                  if (fromSpace && colorConverter.hasConversion(fromSpace, toSpace)) {
                      f = [...fromColorArgs];
                      f = f.map(toNumericValue);
                      f = colorConverter.convertColor(fromSpace, toSpace, ...f);
                  }

              } else if (inputColorSpace && inputIdentifiers) {
                // Not yet working
                  const inputFnName = inputFuncName || inputColorSpace.charAt(0).toUpperCase() + inputColorSpace.slice(1).toLowerCase();
                  const inputColor = `${inputFnName}(from ${from} ${inputIdentifiers.join(' ')})`;

                  const [parsedInputFnName, ...parsedInputFnArgs] = parseFn(inputColor);
                  const inputInput = parsedInputFnArgs.join(', ');
                  let parsedInputFnColorComponents = [...getColorArgs(inputInput)];

                  parsedInputFnColorComponents = parsedInputFnColorComponents.map(v => stripCalc(v));
                  let k = parsedInputFnColorComponents.map(toNumericValue);
                  k = colorConverter.convertColor(toSpace, inputColorSpace, ...k);

                  const identifiers = colorSpaceIdentifiers[toSpace] || [];
                  const kMap = Object.assign(
                      {},
                      ...k.map((v, index) => ({
                          [identifiers[index]]: v
                      }))
                  );

                  let kc = [c1, c2, c3].map((v, i) => {
                      if (typeof v === 'undefined') {
                          return k[i];
                      }

                      v = replaceIdentifiers(v, kMap);
                      return v;
                  });

                  kc = kc.map(v => `calc(${v})`);

                  const result = `${inputFnName}(\nfrom ${from} \n ${kc.join(' ')}\n\n)`;

                  return result;
              }
          } else if (isHex(from)) {
              f = hexToRgb(from);
          } else if (isIdentifier(from)) {
            console.log('FROM KEYWORD', from);
              f = keyToRgb(from);

              console.log('F: ', f);
          }

          if (!f) {
              return `${name}(${input})`; // Return input if conversion fails
          }

          const identifiers = colorSpaceIdentifiers[toSpace] || [];
          const [f1, f2, f3, fa] = f;
          const cMap = Object.assign(
              {},
              ...[f1, f2, f3].map((v, index) => ({
                  [identifiers[index] || `c${index + 1}`]: formatValue(v, units[index])
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
      }

      if (outputColorSpace) {
          if (colorConverter.hasConversion(colorSpace, outputColorSpace)) {
            const c = [c1, c2, c3].map(toNumericValue);
            let converted = colorConverter.convertColor(colorSpace, outputColorSpace, ...c);

            converted = applyFormatValues(converted, outputUnits || units);

            fnName = outputFuncName || kebabCase(outputColorSpace);
            [c1, c2, c3] = converted;
          }
      }

      console.log('argSpace: ', argSpace);

      let outputArgs = [ argSpace, c1, c2, c3]
        .filter(arg => typeof arg !== 'undefined' && arg !== null)
        .join(legacyFormat ? ', ' : ' ')
        
      if (typeof a !== 'undefined' && a !== 1) {
        outputArgs += legacyFormat ? ', ' : ' / ';
        outputArgs += a;
      }

      return `${fnName}(${outputArgs})`;
  }

  Object.defineProperty(fn, 'name', { value: name, writable: false });

  const meta = {
      name,
      colorSpace,
      colorSpaces,
      identifiers,
      fn,
  };

  colorEnv.set(fn, meta);

  return fn;
};
