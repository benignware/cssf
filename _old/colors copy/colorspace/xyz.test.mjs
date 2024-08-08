import { expect } from 'chai';
import * as conversions from './conversions.mjs';
import { colors, tolerances } from './color-test-cases.json' assert { type: 'json' };

// Define whitepoints
const D50 = [96.422, 100.000, 82.521];
const D65 = [95.047, 100.000, 108.883];

// Utility functions
const decamelize = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const camelize = (str) => str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
  index === 0 ? match.toLowerCase() : match.toUpperCase()).replace(/[\s-]+/g, '') ;

// Extract function mappings dynamically
const conversionFunctions = Object.entries(conversions)
  .reduce((acc, [key, func]) => {
    if (typeof func === 'function') {
      const [fromSpace, toSpace] = key.match(/([a-z]+)To([a-z]+)/i)
        .slice(1, 3)
        .map(part => decamelize(part).toLowerCase());

      // Initialize mappings
      acc[fromSpace] = acc[fromSpace] || { from: [], to: [] };
      acc[toSpace] = acc[toSpace] || { from: [], to: [] };

      // Determine if it's a 'from' or 'to' conversion
      if (key.includes('To')) {
        acc[fromSpace].to.push({ func, name: key });
        acc[toSpace].from.push({ func, name: key });
      }
    }
    return acc;
  }, {});

// Create dynamic tests
describe('Color Space Conversions', () => {
  Object.entries(conversionFunctions).forEach(([space, { from, to }]) => {
    const fromSpace = decamelize(space).replace(/-d65|-d50/, '');
    const toSpace = fromSpace;
    const whitepoint = space.includes('-d65') ? D65 : (space.includes('-d50') ? D50 : null);

    // From space tests
    if (from.length > 0) {
      describe(`From ${fromSpace}`, () => {
        from.forEach(({ func, name }) => {
          Object.values(colors).forEach(({ name: colorName, [fromSpace]: fromValues }) => {
            const tolerance = tolerances[fromSpace] || 0.1;
            it(`should convert ${colorName} from ${fromSpace} correctly`, () => {
              if (whitepoint) {
                expect(func(...fromValues, whitepoint)).to.be.deepCloseTo(colors[colorName][toSpace], tolerance);
              } else {
                expect(func(...fromValues)).to.be.deepCloseTo(colors[colorName][toSpace], tolerance);
              }
            });
          });
        });
      });
    }

    // To space tests
    if (to.length > 0) {
      describe(`To ${toSpace}`, () => {
        to.forEach(({ func, name }) => {
          Object.values(colors).forEach(({ name: colorName, [toSpace]: toValues }) => {
            const tolerance = tolerances[toSpace] || 0.1;
            it(`should convert ${colorName} to ${toSpace} correctly`, () => {
              if (whitepoint) {
                expect(func(...toValues, whitepoint)).to.be.deepCloseTo(colors[colorName][fromSpace], tolerance);
              } else {
                expect(func(...toValues)).to.be.deepCloseTo(colors[colorName][fromSpace], tolerance);
              }
            });
          });
        });
      });
    }
  });
});
