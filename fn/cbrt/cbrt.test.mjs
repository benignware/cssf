import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { cbrt } from './cbrt.mjs';

describe('cbrt', () => {
  it('calculates cube root of 8 correctly', () => {
    expect(getEval()(`calc(${cbrt(8)})`)).to.be.closeTo(Math.cbrt(8), 0.01);
  });

  it('calculates cube root of 27 correctly', () => {
    expect(getEval()(`calc(${cbrt(27)})`)).to.be.closeTo(Math.cbrt(27), 0.01);
  });

  it('calculates cube root of 1 correctly', () => {
    expect(getEval()(`calc(${cbrt(1)})`)).to.be.closeTo(Math.cbrt(1), 0.01);
  });

  it('calculates cube root of 0 correctly', () => {
    expect(getEval()(`calc(${cbrt(0)})`)).to.be.closeTo(Math.cbrt(0), 0.01);
  });

  it('calculates the cube root of 64 correctly', () => {
    expect(getEval()(`calc(${cbrt(64)})`)).to.be.closeTo(Math.cbrt(64), 0.01);
  });

  it('calculates the cube root of 0.01 correctly', () => {
    expect(getEval()(`calc(${cbrt(0.01)})`)).to.be.closeTo(Math.cbrt(0.01), 0.01);
  });

  it('calculates the cube root of 1e-6 correctly', () => {
    expect(getEval()(`calc(${cbrt(1e-6)})`)).to.be.closeTo(Math.cbrt(1e-6), 0.1);
  });

  xit('returns NaN for non-numeric inputs', () => {
    expect(getEval()(`calc(${cbrt('string')})`)).to.be.NaN;
    expect(getEval()(`calc(${cbrt([])})`)).to.be.NaN;
  });

  it('calculates cube root of 1000 correctly', () => {
    expect(getEval()(`calc(${cbrt(1000)})`)).to.be.closeTo(Math.cbrt(1000), 0.01);
  });

  it('calculates cube root of 1e+6 correctly', () => {
    expect(getEval()(`calc(${cbrt(1e+6)})`)).to.be.closeTo(Math.cbrt(1e+6), 0.01);
  });

  // Optional: Test with units (assuming your implementation supports units)
  xit('calculates cube root of 8px correctly', () => {
    expect(getEval()(`calc(${cbrt('8px')})`)).to.be.closeToUnit(`${Math.cbrt(8)}px`, 0.01);
  });
});
