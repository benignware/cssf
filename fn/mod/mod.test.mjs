import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { mod } from './mod.mjs';

describe('mod', () => {
  beforeEach(() => {
    global.e = getEval({ mod });
  });

  it('should return the modulus of two numbers', () => {
    expect(e(`calc(${mod(5, 2)}`)).to.equal(5 % 2);
  });

  it('should return the modulus of two numbers with units', () => {
    expect(e(`calc(${mod('5px', '2px')}`)).to.equal(5 % 2 + 'px');
  });

  xit('should handle modulus with zero as divisor gracefully', () => {
    expect(e(`calc(${mod(5, 0)}`)).to.equal('NaN');
  });

  xit('should handle modulus with zero and units gracefully', () => {
    expect(e(`calc(${mod('5px', '0px')}`)).to.equal('NaN');
  });
});