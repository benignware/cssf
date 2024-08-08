import { expect } from 'chai';
import * as conversions from './conversions.mjs';
import colors from '../../fixtures/conversions.json' assert { type: 'json' };
import ranges from '../../fixtures/ranges.json' assert { type: 'json' };

// const PRECISION = 0.15;
const PRECISION = 0.15;

const colorSpaces = global.COLOR_SPACES || [];

const camelize = str => str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
const pascalize = str => str.charAt(0).toUpperCase() + camelize(str).slice(1);
const decamelize = str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const toleranceFromRange = (array, precision = PRECISION) =>
  (array || []).map(([min, max]) => (max - min) * precision)
  .reduce((acc, t) => acc === undefined ? t : (acc === t ? acc : t), undefined);

describe('Color Conversion Functions', () => {
  Object.entries(conversions).forEach(([key, func]) => {
    const [fromSpace, toSpace] = key.split('To').map(part => decamelize(part).toLowerCase());

    if (!colorSpaces.includes(fromSpace) || !colorSpaces.includes(toSpace)) {
      return;
    }

    describe(`From ${fromSpace} to ${toSpace}`, () => {
      Object.entries(colors).forEach(([colorName, values]) => {
        const src = values[fromSpace];
        const dst = values[toSpace];

        if (!src || !dst) return;

        const key = `${camelize(fromSpace)}To${pascalize(toSpace)}`;

        const fn = conversions[key];

        if (!fn) {
          return;
        }

        const tolerance = toleranceFromRange(ranges[toSpace]);

        it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
          expect(func(...src)).to.be.deepCloseTo(dst, tolerance);
        });
      });
    });
  });
});
