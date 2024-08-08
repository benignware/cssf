import { expect } from 'chai';
import { oklabToOklch, oklchToOklab } from './oklch.mjs';

const testCases = [
  {
    name: 'Red',
    oklab: [0.628, 0.22, 0.13],
    oklch: [0.627, 0.25768330773615683, 29.2338851923426]
  },
  {
    name: 'Green',
    oklab: [0.8664, -0.23, 0.18],
    oklch: [0.8664396115356693, 0.2948272403370167, 142.49533888780996]
  },
  {
    name: 'Blue',
    oklab: [0.452, -0.03, -0.31],
    oklch: [0.45201371838534286, 0.31321437166460125, 264.052020638055]
  },
  {
    name: 'White',
    oklab: [1.000, 0.000, 0.000],
    oklch: [1.000, 0.000, 0.000]
  },
  {
    name: 'Black',
    oklab: [0.000, 0.000, 0.000],
    oklch: [0.000, 0.000, 0.000]
  },
  {
    name: 'Gray',
    oklab: [0.500, 0.000, 0.000],
    oklch: [0.500, 0.000, 0.000]
  }
];

// Tests for OKLab to OKLCH conversions
describe("OKLab to OKLCH", () => {
  testCases.forEach(({ name, oklab, oklch }) => {
    it(`should convert OKLab to OKLCH correctly for ${name}`, () => {
      expect(oklabToOklch(...oklab)).to.be.deepCloseTo(oklch, [0.1, 0.1, 10]);
    });
  });
});

// Tests for OKLCH to OKLab conversions
describe("OKLCH to OKLab", () => {
  testCases.forEach(({ name, oklab, oklch }) => {
    it(`should convert OKLCH to OKLab correctly for ${name}`, () => {
      expect(oklchToOklab(...oklch)).to.be.deepCloseTo(oklab, [0.1, 0.1, 0.1]);
    });
  });
});
