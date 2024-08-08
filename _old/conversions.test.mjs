import { expect } from 'chai';
import * as conversions from '../colorspace/index.mjs';
import { ColorConverter } from './ColorConverter.mjs';
import colors from './conversions.json' assert { type: 'json' };

const decamelize = str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// Get all registered conversions
// const colorSpaces = Object.entries(conversions).reduce((spaces, [key]) => {
//   const [fromSpace, toSpace] = key.split('To').map(part => decamelize(part).toLowerCase());

//   if (!spaces.includes(fromSpace)) spaces.push(fromSpace);
//   if (!spaces.includes(toSpace)) spaces.push(toSpace);

//   return spaces;
// }, []);

const colorSpaces = [
  'rgb', 
  'hsl',
  'hwb',
  'xyz',
  'xyz-d65',
  'xyz-d50',
  'lab',
  'lch',
  'oklab',
  'oklch',
  'srgb',
  'srgb-linear',
  'rgb-linear',
  'a98-rgb',
  'rec2020',
  'display-p3',
  // 'prophoto-rgb',
];

const RANGES = {
  rgb: [[0, 255], [0, 255], [0, 255]],
  'rgb-linear': [[0, 1], [0, 1], [0, 1]],
  hsl: [[0, 360], [0, 1], [0, 1]],
  hwb: [[0, 360], [0, 1], [0, 1]],
  hsv: [[0, 360], [0, 1], [0, 1]],
  lab: [[0, 100], [-128, 128], [-128, 128]],
  lch: [[0, 100], [0, 180], [0, 360]],
  oklab: [[0, 1], [-0.5, 0.5], [-0.5, 0.5]],
  oklch: [[0, 1], [0, 0.5], [0, 360]],
  xyz: [[0, 1], [0, 1], [0, 1]],
  'xyz-d65': [[0, 1], [0, 1], [0, 1]],
  'xyz-d50': [[0, 1], [0, 1], [0, 1]],
  srgb: [[0, 1], [0, 1], [0, 1]],
  'srgb-linear': [[0, 1], [0, 1], [0, 1]],
  'display-p3': [[-0.6, 1.6], [-0.6, 1.6], [-0.6, 1.6]],
  'a98-rgb': [[-0.6, 1.6], [-0.6, 1.6], [-0.6, 1.6]],
  'prophoto-rgb': [[-0.6, 1.6], [-0.6, 1.6], [-0.6, 1.6]],
  rec2020: [[-0.6, 1.6], [-0.6, 1.6], [-0.6, 1.6]],
};

const toleranceFromRange = (colorSpace, precision = 0.15) => {
  const range = RANGES[colorSpace];
  if (!range) return precision;

  const tolerances = range.map(([min, max]) => (max - min) * precision);
  return tolerances.every(t => t === tolerances[0]) ? tolerances[0] : tolerances;
};


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
          console.log('--->', fromSpace, toSpace);
          Object.entries(colors).forEach(([colorName, values]) => {
            const src = values[fromSpace];
            const dst = values[toSpace];

            if (!src || !dst) return;

            it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
              const converted = colorConverter.convertColor(fromSpace, toSpace, ...src);
              expect(converted).to.deepCloseTo(dst, toleranceFromRange(toSpace));
            });
          });
        });
      }
    });
  });
});


// describe('Color Space Conversions', () => {
//   Object.entries(conversions).forEach(([key, func]) => {
//     const [fromSpace, toSpace] = key.split('To').map(part => decamelize(part).toLowerCase());
//     const tolerance = toleranceFromRange(toSpace);

//     describe(`From ${fromSpace} to ${toSpace}`, () => {
//       Object.entries(colors).forEach(([colorName, values]) => {
//         const srcEntry = values[fromSpace];
//         if (!srcEntry) return;

//         const [srcValues, srcSpace] = srcEntry.length === 4 ? [srcEntry.slice(0, 3), srcEntry[3]] : [srcEntry, fromSpace];
//         const dst = values[toSpace];

//         if (!dst) return;

//         const fn = srcSpace !== fromSpace ? conversions[`${srcSpace}To${fromSpace}`] : null;
//         const normalizedSrc = fn ? fn(...srcValues) : srcValues;

//         it(`should convert ${colorName} from ${fromSpace} to ${toSpace} correctly`, () => {
//           expect(func(...normalizedSrc)).to.be.deepCloseTo(dst, tolerance);
//         });
//       });
//     });
//   });
// });
