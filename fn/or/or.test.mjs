import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { or } from './or.mjs';

const e = getEval();

describe('or', () => {
  it('returns 1 if a is 1 but not b', () => {
    expect(e(`calc(${or(1, 0)})`)).to.equal(1);
  });

  it('returns 1 if b is 1 but not a', () => {
    expect(e(`calc(${or(0, 1)})`)).to.equal(1);
  });

  it('returns 1 if a and b is both 1', () => {
    expect(e(`calc(${or(1, 1)})`)).to.equal(1);
  });

  it('returns 0 if a and b is both 0', () => {
    expect(e(`calc(${or(0, 0)})`)).to.equal(0);
  });
});
