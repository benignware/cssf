import { expect } from 'chai';
import * as conversions from './conversions.mjs';
import data from './color-test-cases.json' assert { type: 'json' };

const { ranges, colors } = data;

// Utility functions
const decamelize = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function toleranceFromRange(colorSpace, precision = 0.1) {
  const range = ranges[colorSpace];

  // Default tolerance if the color space is unknown
  if (!range) {
    return precision;
  }

  // Calculate tolerance for each component
  const tolerances = range.map(([min, max]) => {
    const rangeValue = max - min;
    return rangeValue * precision; // 1% of the range
  });

  // Check if all tolerances are the same
  const allSame = tolerances.every(tolerance => tolerance === tolerances[0]);

  return allSame ? tolerances[0] : tolerances;
}


// Create dynamic tests
describe('Color Space Conversions', () => {
  Object.entries(conversions).forEach(([key, func]) => {
    const [fromSpace, toSpace] = key.match(/([a-z\d]+)To([a-z\d]+)/i)
      .slice(1, 3)
      .map(part => decamelize(part).toLowerCase());

    describe(`From ${fromSpace} to ${toSpace}`, () => {
      const tolerance = toleranceFromRange(toSpace);

      Object.entries(colors).forEach(([colorName, values]) => {
        const src = values[fromSpace];
          const dst = values[toSpace];

          if (!src || !dst) {
            return;
          }

          it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
            expect(func(...src)).to.be.deepCloseTo(dst, tolerance);
          });
      });
    });
  });
});


