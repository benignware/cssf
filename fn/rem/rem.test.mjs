import { expect } from 'chai';
import { rem } from './rem.mjs';
import { getEval } from '../../utils/eval/getEval.mjs';

describe('rem', () => {
  beforeEach(() => {
    global.e = getEval({
      rem
    });
  });

  it('returns remainder', () => {
    expect(e(`calc(${rem(120, 360)})`)).to.equal(120 % 360);
  });

  xit('returns remainder when a is negative', () => {
    expect(e(`calc(${rem(-120, 360)})`)).to.equal(-120 % 360);
  });

  xit('returns remainder when a is larger than b', () => {
    expect(e(`calc(${rem(360, 120)})`)).to.equal(360 % 120);
  });

  return;

  it('should return the remainder of two numbers', () => {
    expect(e('rem(5, 2)')).to.equal(1);
  });

  it('should return the remainder of two numbers with units', () => {
    expect(e('rem(5px, 2px)')).to.equal('1px');
  });

  it('should handle dynamic input', () => {
    expect(e('rem(var(--x), 2px)', {
      '--x': '1px',
    })).to.equal('1px');
  });

  it('should handle zero as divisor gracefully', () => {
    expect(e('rem(5, 0)')).to.equal('NaN');
  });

  xit('should handle zero as divisor with units gracefully', () => {
    expect(e('rem(5px, 0px)')).to.equal('NaN');
  });
});
