import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { gt } from './gt.mjs';

const e = getEval();

describe('gt', () => {
  it('returns 1 if a is greater than b', () => {
    expect(e(`calc(${gt(1, 0)})`)).to.equal(1);
  });

  it('returns 0 if a is lesser than b', () => {
    expect(e(`calc(${gt(0, 1)})`)).to.equal(0);
  });

  it('returns 0 if a equals b', () => {
    expect(e(`calc(${gt(1, 1)})`)).to.equal(0);
  });
});
