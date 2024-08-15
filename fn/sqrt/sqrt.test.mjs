import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { sqrt } from './sqrt.mjs';

describe('sqrt', () => {
  it('calculates square root of 2', () => {
    expect(getEval()(`calc(${sqrt(2)})`)).to.be.closeTo(Math.sqrt(2), 0.01);
  });

  it('calculates square root of 2px', () => {
    expect(getEval()(`calc(${sqrt('2px')})`)).to.be.closeToUnit(`${Math.sqrt(2)}px`, 0.01);
  });

  it('calculates the square root of 9 correctly', () => {
    expect(getEval()(`calc(${sqrt(9)})`)).to.be.closeTo(Math.sqrt(9), 0.01);
  });

  it('calculates the square root of 0 correctly', () => {
    expect(getEval()(`calc(${sqrt(0)})`)).to.be.closeTo(Math.sqrt(0), 0.01);
  });

  it('calculates the square root of 2 correctly', () => {
    expect(getEval()(`calc(${sqrt(2)})`)).to.be.closeTo(Math.sqrt(2), 0.01);
  });

  it('calculates the square root of 7 correctly', () => {
    expect(getEval()(`calc(${sqrt(7)})`)).to.be.closeTo(Math.sqrt(7), 0.01);
  });

  it('calculates the square root of 0.01 correctly', () => {
    expect(getEval()(`calc(${sqrt(0.01)})`)).to.be.closeTo(Math.sqrt(0.01), 0.1);
  });

  it('calculates the square root of 1e-6 correctly', () => {
    expect(getEval()(`calc(${sqrt(1e-6)})`)).to.be.closeTo(Math.sqrt(1e-6), 0.1);
  });

  xit('calculates the square root of 10000 correctly', () => {
    expect(getEval()(`calc(${sqrt(10000)})`)).to.be.closeTo(Math.sqrt(10000), 5);
  });

  xit('calculates the square root of 1e+6 correctly', () => {
    expect(getEval()(`calc(${sqrt(1e+6)})`)).to.be.closeTo(Math.sqrt(1e+6), 5);
  });

  xit('returns NaN for non-numeric inputs', () => {
    expect(getEval()(`calc(${sqrt('string')})`)).to.be.NaN;
    expect(getEval()(`calc(${sqrt([])})`)).to.be.NaN;
  });
});