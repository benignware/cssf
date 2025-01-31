import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { eq } from './eq.mjs';

const e = getEval();

describe('eq', () => {
  it('returns 1 if integer a equals integer b', () => {
    expect(e(`calc(${eq(1, 1)}`)).to.equal(1);
  });

  it('returns 0 if integer a does not equal integer b', () => {
    expect(e(`calc(${eq(1, 2)}`)).to.equal(0);
  });

  it('returns 1 if float a equals float b', () => {
    expect(e(`calc(${eq(1.2345678, 1.2345678)}`)).to.equal(1);
  });

  it('returns 0 if float a does not equal float b', () => {
    expect(e(`calc(${eq(1.2345678, 1.2345679)}`)).to.equal(0);
  });

  it('returns 1 if a equals b', () => {
    expect(e(`calc(${eq('1', '1')}`)).to.equal(1);
  });

  it('handles zero', () => {
    expect(e(`calc(${eq('0', '0')}`)).to.equal(1);
  });
});
