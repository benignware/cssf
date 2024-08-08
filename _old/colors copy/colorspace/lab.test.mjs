import { expect } from 'chai';
import { xyzToLab, labToXyz } from './lab.mjs';

const D65 = [95.047, 100.000, 108.883];
const D50 = [96.422, 100.000, 82.521];

// Tests for XYZ to LAB conversions
describe("XYZ to LAB", () => {
  it('should convert XYZ to LAB with D65 whitepoint correctly', () => {
    expect(xyzToLab(0.4124564, 0.2126729, 0.0193339)).to.be.deepCloseTo([53.2408, 80.0925, 67.2032], 1);
  });

  it('should convert XYZ to LAB with D50 whitepoint correctly', () => {
    expect(xyzToLab(0.4360747, 0.2225045, 0.014652915229161376, D50)).to.be.deepCloseTo([53.2408, 80.0925, 67.2032], 2);
  });
});

// Tests for LAB to XYZ conversions
describe("LAB to XYZ", () => {
  it('should convert LAB to XYZ with D65 whitepoint correctly', () => {
    expect(labToXyz(53.2408, 80.0925, 67.2032)).to.be.deepCloseTo([0.4124564, 0.2126729, 0.0193339], 0.01);
  });

  it('should convert LAB to XYZ with D50 whitepoint correctly', () => {
    expect(labToXyz(53.2408, 80.0925, 67.2032, D50)).to.be.deepCloseTo([0.4360747, 0.2225045, 0.014652915229161376], 0.05);
  });
});
