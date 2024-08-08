// colorConversions.test.mjs

import { expect } from 'chai';
import { rgbToXyz, xyzToRgb } from './colorConversions.mjs';

// New test data
const testData = {
  "red": {
    "rgb": [1, 0, 0, "srgb"],
    "xyz": [0.412426, 0.212648, 0.0193173, "xyz-d65"],
    // Other color spaces...
  },
  "green": {
    "rgb": [0, 1, 0, "srgb"],
    "xyz": [0.357628, 0.715142, 0.119175, "xyz-d65"],
    // Other color spaces...
  },
  "blue": {
    "rgb": [0, 0, 1, "srgb"],
    "xyz": [0.180452, 0.0721746, 0.950405, "xyz-d65"],
    // Other color spaces...
  }
};

describe('Color Conversion Tests', () => {
  Object.keys(testData).forEach(colorName => {
    const colorData = testData[colorName];
    
    it(`${colorName} RGB to XYZ`, () => {
      const [r, g, b, colorSpace] = colorData.rgb;
      const xyz = rgbToXyz(r * 255, g * 255, b * 255, colorSpace); // Convert [0,1] range to [0,255] range if needed
      const [expectedX, expectedY, expectedZ] = colorData.xyz;
      expect(xyz).to.be.deepCloseTo([expectedX, expectedY, expectedZ], 0.01);
    });

    it(`${colorName} XYZ to RGB`, () => {
      const [x, y, z, colorSpace] = colorData.xyz;
      const rgbBack = xyzToRgb(x, y, z, colorSpace);
      expect(rgbBack).to.be.deepCloseTo(colorData.rgb.slice(0, 3).map(v => Math.round(v * 255)), 1); // Convert [0,1] range to [0,255] range if needed
    });
  });
});
