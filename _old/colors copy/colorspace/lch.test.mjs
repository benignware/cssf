import { expect } from 'chai';
import { labToLch, lchToLab } from './lch.mjs'; // Update path if needed

// Revised test cases for different colors in LAB and LCH
const testCases = [
  {
    name: 'Red',
    lab: [53.2408, 80.0925, 67.2032],
    lch: [53.241, 104.552, 39.999] // Verify with accurate values
  },
  {
    name: 'Green',
    lab: [87.735, -86.183, 83.179],
    lch: [87.735, 119.776, 136.016] // Updated expected value
  },
  {
    name: 'Blue',
    lab: [32.2970, 79.1947, -107.8631],
    lch: [32.297, 133.808, 306.285] // Updated expected value
  },
  {
    name: 'White',
    lab: [100.0000, 0.0000, 0.0000],
    lch: [100.0000, 0.0000, 0.0000]
  },
  {
    name: 'Black',
    lab: [0.0000, 0.0000, 0.0000],
    lch: [0.0000, 0.0000, 0.0000]
  },
  {
    name: 'Gray',
    lab: [53.5800, 0.0000, 0.0000],
    lch: [53.5800, 0.0000, 0.0000]
  }
];

// Tests for LAB to LCH conversions
describe("LAB to LCH", () => {
  testCases.forEach(({ name, lab, lch }) => {
    it(`should convert LAB to LCH correctly for ${name}`, () => {
      expect(labToLch(...lab)).to.be.deepCloseTo(lch, [0.1, 0.1, 0.1]); // Adjusted tolerances
    });
  });
});

// Tests for LCH to LAB conversions
describe("LCH to LAB", () => {
  testCases.forEach(({ name, lab, lch }) => {
    it(`should convert LCH to LAB correctly for ${name}`, () => {
      expect(lchToLab(...lch)).to.be.deepCloseTo(lab, [0.1, 0.1, 0.1]); // Adjusted tolerances
    });
  });
});
