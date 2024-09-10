import { expect } from 'chai';
import { toleranceFromRange } from '../../setup/toleranceFromRange.mjs';
import { camelCase, pascalCase, constantCase, kebabCase } from 'change-case';

import { ColorConverter } from './ColorConverter.mjs';

import { refConversions, calcConversions } from './conversions.mjs';

import colorData from '../../fixtures/conversions.json' assert { type: 'json' };
import ranges from '../../fixtures/ranges.json' assert { type: 'json' };
import { getEval, ENV_2022, ENV_NEXT } from '../eval/getEval.mjs';

import { toUnit } from '../calc/toUnit.mjs';

import { getColorFn } from './getColorFn.mjs';

const colorSpaces = global.COLOR_SPACES || [];
const colors = Object.assign({}, ...global.COLORS.map((key) => ({
  [key]: colorData[key],
})));

console.log('COLOR SPACES: ', colorSpaces);

const PRECISION = 0.05;
// const PRECISION = 0.75;

const conversions = {
  ...refConversions,
  ...calcConversions
}

describe('Color Conversions', function() {

  console.log('conversions: ', conversions);

  const e = getEval({}, ENV_NEXT);

  Object.entries(conversions).forEach(([key, func]) => {
    const [fromSpace, toSpace] = key.split('To').map(part => kebabCase(part).toLowerCase());
    if (!colorSpaces.includes(fromSpace) || !colorSpaces.includes(toSpace)) return;

    const conversionKey = `${camelCase(fromSpace)}To${pascalCase(toSpace)}`;

    describe(`From ${constantCase(fromSpace)} to ${constantCase(toSpace)} - ${conversionKey}`, () => {
      Object.entries(colors).forEach(([colorName, values]) => {
        const src = values[fromSpace];
        const dst = values[toSpace];
        if (!src || !dst) return;

        const fn = conversions[conversionKey];
    
        if (!fn) return;

        const tolerance = toleranceFromRange(ranges[toSpace]);

        it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
          expect(func(...src).map(x => e(`calc(${x})`))).to.be.deepCloseTo(dst, tolerance);
        });
      });
    });
  });

  // Initialize ColorConverter and register conversions
  const colorConverter = new ColorConverter(conversions, {
    // transformer: result => result.map(x => e(`calc(${x})`)),
  });

  colorSpaces.forEach(fromSpace => {
    colorSpaces.forEach(toSpace => {
      if (fromSpace !== toSpace) {
        const hasConversion = colorConverter.hasConversion(fromSpace, toSpace);

        if (!hasConversion) {
          console.warn(`Warn: No conversion from ${fromSpace} to ${toSpace}`);
        }
        
        const conversionPath = hasConversion ? colorConverter.getConversionPath(fromSpace, toSpace) : [];
        const intermediateSpaces = conversionPath.slice(1, -1);

        if (hasConversion && intermediateSpaces.length === 0) {
          // We should have tested direct conversions already
          return;
        }
  
        describe(`From ${constantCase(fromSpace)} to ${constantCase(toSpace)}${conversionPath.length ? ` (${conversionPath.join(' > ')})` : ''}`, function() {
          if (!hasConversion) {
            // this.skip();
            return;
          }
        
          Object.entries(colors).forEach(([colorName, values]) => {const src = values[fromSpace];
            const dst = values[toSpace];

            if (!src || !dst) {
              return;
            }

            it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
              const converted = colorConverter.convertColor(fromSpace, toSpace, ...src);
              const evaluated = converted.map(x => e(`calc(${x})`));
              expect(evaluated).to.deepCloseTo(dst, toleranceFromRange(ranges[toSpace]));
            });
          });
        });
      }
    });
  });
});


describe('Color Function Conversions', () => {
  const colorDef = [
    ['rgb', 'rgb', conversions],
    ['hsl', 'hsl', {}, { units: ['deg', '%', '%'] }],
    ['hwb', 'hwb', {}, { units: ['deg', '%', '%'] }],
    ['hsv', 'hsv', {}, { units: ['deg', '%', '%'] }],
    ['lab', 'lab', {}],
    ['lch', 'lch', {}],
    ['color', [
      'xyz',
      'xyz-d50',
      'xyz-d65',
      'srgb',
    ], {}, {
      identifiers: {
        'xyz': 'xyz',
        'xyz-d65': 'xyz',
        'xyz-d50': 'xyz',
        'srgb': 'rgb',
      }
    }]
  ];
  
  const colorFn = Object.fromEntries(
    colorDef.map(([name, colorSpace, conversions = {}, options = {}]) => {
      return [name, getColorFn(name, colorSpace, conversions, options)];
    })
  );

  const e = getEval(colorFn, ENV_NEXT);

  colorSpaces.forEach(fromSpace => {
    colorSpaces.forEach(toSpace => {
      if (fromSpace !== toSpace) {

        const fromDef = colorDef.find(def => def[1] === fromSpace || def[1].includes(fromSpace))
        const toDef = colorDef.find(def => def[1] === toSpace || def[1].includes(toSpace))

        if (!fromDef || !toDef) {
          return;
        }

        let [fromFn, fromFnSpace,, { units: fromUnits = ['', '', '']} = {}] = fromDef;
        let [toFn, toFnSpace,, {
          units: toUnits = ['', '', ''],
          identifiers: toIdentifiers = toSpace.slice(toSpace.length - 3)
        } = {}] = toDef;

        toIdentifiers = toIdentifiers[toSpace] || toIdentifiers;
        toIdentifiers = Array.isArray(toIdentifiers) ? toIdentifiers : toIdentifiers.split('');

        
        describe(`From ${constantCase(fromSpace)} to ${constantCase(toSpace)}`, () => {
          Object.entries(colors).forEach(([colorName, values]) => {
            const src = values[fromSpace];
            const dst = values[toSpace];

            if (!src || !dst) return;

            const tolerance = toleranceFromRange(ranges[toSpace], PRECISION);

            const srcValues = src.map((x, i) => toUnit(x, fromUnits[i]));
            const dstValues = dst.map((x, i) => toUnit(x, toUnits[i]));

            // console.log('from ', fromFn, srcValues, ' to: ', toFn, dstValues);

            it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
              const input = `${toFn}(from ${fromFn}(${
                Array.isArray(fromFnSpace) ? fromSpace + ' ' : ''
              }${srcValues.join(', ')}) ${
                Array.isArray(toFnSpace) ? toSpace + ' ' : ''
              }${toIdentifiers.join(' ')})`;
              

              const expected = `${toFn}(${Array.isArray(toFnSpace) ? toSpace + ' ' : ''}${dstValues.join(' ')})`;
              const actual = e(input);
              // console.log('INPUT: ', input);
              // console.log('EXPECTED: ', expected);
              // console.log('ACTUAL: ', actual);
              
              expect(actual).to.be.closeToUnit(expected, tolerance);
            });
          });
        });
      }
    });
  });
});