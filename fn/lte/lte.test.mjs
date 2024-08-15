import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { lte } from './lte.mjs';

const e = getEval({ lte });

describe('lte', () => {
  it('returns 1 if a equals b', () => {
    expect(e(`calc(${lte(1, 1)})`)).to.equal(1);
  });

  it('returns 1 if a is lesser than b', () => {
    expect(e(`calc(${lte(0, 1)})`)).to.equal(1);
  });

  it('returns 0 if a is greater than b', () => {
    expect(e(`calc(${lte(1, 0)})`)).to.equal(0);
  });
});
