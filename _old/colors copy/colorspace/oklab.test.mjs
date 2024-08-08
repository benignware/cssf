import { expect } from 'chai';
import {
  oklabToXyz, xyzToOklab,
} from './oklab.mjs';

// Test for OKLab to XYZ conversion
describe('OKLab to XYZ Conversion', () => {
  xit('should convert OKLab (0.4002, -0.2263, 0.0000) to XYZ (0.4124564, 0.2126729, 0.0193339)', () => {
    expect(oklabToXyz(0.4002, -0.2263, 0.0000)).to.be.deepCloseTo([0.4124564, 0.2126729, 0.0193339], 0.1);
  });

  xit('should convert OKLab (0.7085, 1.1653, 0.0000) to XYZ (0.3575761, 0.7151522, 0.1191920)', () => {
    expect(oklabToXyz(0.7085, 1.1653, 0.0000)).to.be.deepCloseTo([0.3575761, 0.7151522, 0.1191920], 0.1);
  });

  xit('should convert OKLab (0.0800, -0.0670, 0.8670) to XYZ (0.1804375, 0.0721750, 0.9503041)', () => {
    expect(oklabToXyz(0.0800, -0.0670, 0.8670)).to.be.deepCloseTo([0.1804375, 0.0721750, 0.9503041], 0.1);
  });

  it('should convert OKLab (0.0000, 0.0000, 0.0000) to XYZ (0.0000000, 0.0000000, 0.0000000)', () => {
    expect(oklabToXyz(0.0000, 0.0000, 0.0000)).to.be.deepCloseTo([0.0000000, 0.0000000, 0.0000000], 0.1);
  });

  it('should convert OKLab (1.0000, 0.0000, 0.0000) to XYZ (0.9503041, 1.0000000, 1.0890500)', () => {
    expect(oklabToXyz(1.0000, 0.0000, 0.0000)).to.be.deepCloseTo([0.9503041, 1.0000000, 1.0890500], 0.1);
  });

  xit('should convert OKLab (0.5000, 0.0000, 0.0000) to XYZ (0.3150000, 0.3280000, 0.3130000)', () => {
    expect(oklabToXyz(0.5000, 0.0000, 0.0000)).to.be.deepCloseTo([0.3150000, 0.3280000, 0.3130000], 0.1);
  });
});

// Test for XYZ to OKLab conversion
describe('XYZ to OKLab Conversion', () => {
  it('should convert XYZ (0.4124564, 0.2126729, 0.0193339) to OKLab (0.4002, -0.2263, 0.0000)', () => {
    expect(xyzToOklab(0.4124564, 0.2126729, 0.0193339)).to.be.deepCloseTo([0.4002, -0.2263, 0.0000], 0.1);
  });

  it('should convert XYZ (0.3575761, 0.7151522, 0.1191920) to OKLab (0.7085, 1.1653, 0.0000)', () => {
    expect(xyzToOklab(0.3575761, 0.7151522, 0.1191920)).to.be.deepCloseTo([0.7085, 1.1653, 0.0000], 0.1);
  });

  xit('should convert XYZ (0.1804375, 0.0721750, 0.9503041) to OKLab (0.0800, -0.0670, 0.8670)', () => {
    expect(xyzToOklab(0.1804375, 0.0721750, 0.9503041)).to.be.deepCloseTo([0.0800, -0.0670, 0.8670], 0.1);
  });

  it('should convert XYZ (0.0000000, 0.0000000, 0.0000000) to OKLab (0.0000, 0.0000, 0.0000)', () => {
    expect(xyzToOklab(0.0000000, 0.0000000, 0.0000000)).to.be.deepCloseTo([0.0000, 0.0000, 0.0000], 0.1);
  });

  xit('should convert XYZ (0.9503041, 1.0000000, 1.0890500) to OKLab (1.0000, 0.0000, 0.0000)', () => {
    expect(xyzToOklab(0.9503041, 1.0000000, 1.0890500)).to.be.deepCloseTo([1.0000, 0.0000, 0.0000], 0.1);
  });

  xit('should convert XYZ (0.3150000, 0.3280000, 0.3130000) to OKLab (0.5000, 0.0000, 0.0000)', () => {
    expect(xyzToOklab(0.3150000, 0.3280000, 0.3130000)).to.be.deepCloseTo([0.5000, 0.0000, 0.0000], 0.1);
  });
});
