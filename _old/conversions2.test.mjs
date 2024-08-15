import { expect } from 'chai';
import { toleranceFromRange } from '../setup/toleranceFromRange.mjs';
import { camelCase, pascalCase, constantCase, kebabCase } from 'change-case';

import { ColorConverter } from '../utils/colors/ColorConverter.mjs';

import * as rgbConversions from '../utils/colors/conversions/ref/rgb.mjs';
import * as hslConversions from '../utils/colors/conversions/ref/hsl.mjs';
import * as hwbConversions from '../utils/colors/conversions/ref/hwb.mjs';

import colorData from '../fixtures/conversions.json' assert { type: 'json' };
import ranges from '../fixtures/ranges.json' assert { type: 'json' };
import { getEval } from '../utils/eval/getEval.mjs';
import { getColorFn } from '../utils/colors/getColorFn.mjs';

import { toUnit } from '../utils/calc/toUnit.mjs';

const PRECISION = 0.05;
// const PRECISION = 0.75;

const colorSpaces = global.COLOR_SPACES || [];
const colors = Object.assign({}, ...global.COLORS.map((key) => ({
  [key]: colorData[key],
})));


describe('Color Function Conversions', () => {
  const colorDef = {
    rgb: ['rgb', rgbConversions],
    hsl: ['hsl', hslConversions, { units: ['deg', '%', '%'] }],
    hwb: ['hwb', hwbConversions, { units: ['deg', '%', '%'] }],
  };
  
  const colorFn = Object.fromEntries(Object.entries(colorDef)
    .map(([colorSpace, [name, conversions = {}, options = {}]]) => {
      return [name, getColorFn(name, colorSpace, conversions, options)];
    }));

  const e = getEval(colorFn);

  colorSpaces.forEach(fromSpace => {
    colorSpaces.forEach(toSpace => {
      if (fromSpace !== toSpace) {
        if (!Object.keys(colorDef).includes(fromSpace) || !Object.keys(colorDef).includes(toSpace)) {
          return;
        }

        const fromFn = colorDef[fromSpace][0];
        const fromUnits = colorDef[fromSpace][2]?.units || ['', '', ''];
        const toFn = colorDef[toSpace][0];
        const toUnits = colorDef[toSpace][2]?.units || ['', '', ''];
        
        let toIdentifiers = colorDef[toSpace][2]?.identifiers || toSpace.slice(toSpace.length - 3);

        toIdentifiers = Array.isArray(toIdentifiers) ? toIdentifiers : toIdentifiers.split('');

        describe(`From ${constantCase(fromSpace)} to ${constantCase(toSpace)}`, () => {
          Object.entries(colors).forEach(([colorName, values]) => {
            const src = values[fromSpace];
            const dst = values[toSpace];

            if (!src || !dst) return;

            const tolerance = toleranceFromRange(ranges[toSpace], PRECISION);

            const srcValues = src.map((x, i) => toUnit(x, fromUnits[i]));
            const dstValues = dst.map((x, i) => toUnit(x, toUnits[i]));

            

            it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
              const input = `${toFn}(from ${fromFn}(${srcValues.join(', ')}) ${toIdentifiers.join(' ')})`;
              const expected = `${toFn}(${dstValues.join(' ')})`;
              const actual = e(input);
              
              expect(actual).to.be.closeToUnit(expected, tolerance);
            });
          });
        });
      }
    });
  });
});