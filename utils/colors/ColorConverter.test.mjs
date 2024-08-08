import { expect } from 'chai';
import * as conversions from './conversions.mjs';
import { ColorConverter } from './ColorConverter.mjs';
import colors from '../../fixtures/conversions.json' assert { type: 'json' };
import ranges from '../../fixtures/ranges.json' assert { type: 'json' };

const PRECISION = 0.004;

const colorSpaces = global.COLOR_SPACES || [];

const toleranceFromRange = (array, precision = PRECISION) =>
  (array || []).map(([min, max]) => (max - min) * precision)
  .reduce((acc, t) => acc === undefined ? t : (acc === t ? acc : t), undefined);

// Initialize ColorConverter and register conversions
const colorConverter = new ColorConverter(conversions);

describe('Color Converter', () => {
  colorSpaces.forEach(fromSpace => {
    colorSpaces.forEach(toSpace => {
      if (fromSpace !== toSpace) {
        const hasConversion = colorConverter.hasConversion(fromSpace, toSpace);

        if (!hasConversion) {
          console.warn(`Warn: No conversion from ${fromSpace} to ${toSpace}`);
          return;
        }

        describe(`From ${fromSpace} to ${toSpace}`, () => {
          Object.entries(colors).forEach(([colorName, values]) => {
            const src = values[fromSpace];
            const dst = values[toSpace];

            if (!src || !dst) return;

            it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
              const converted = colorConverter.convertColor(fromSpace, toSpace, ...src);
              expect(converted).to.deepCloseTo(dst, toleranceFromRange(ranges[toSpace]));
            });
          });
        });
      }
    });
  });
});
