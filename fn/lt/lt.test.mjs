import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { lt } from './lt.mjs';

const e = getEval({ lt });

describe('lt', () => {
  it('returns 1 if a is lesser than b', () => {
    expect(e(`calc(${lt(0, 1)})`)).to.equal(1);
  });

  it('returns 0 if a is greater than b', () => {
    expect(e(`calc(${lt(1, 0)})`)).to.equal(0);
  });

  it('returns 0 if a equals b', () => {
    expect(e(`calc(${lt(1, 1)})`)).to.equal(0);
  });
});
