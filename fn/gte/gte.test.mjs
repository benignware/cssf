import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { gte } from './gte.mjs';

const e = getEval();

describe('gte', () => {
  it('returns 1 if a equals b', () => {
    expect(e(`calc(${gte(1, 1)})`)).to.equal(1);
  });

  it('returns 1 if a is greater than b', () => {
    expect(e(`calc(${gte(1, 0)})`)).to.equal(1);
  });

  it('returns 0 if a is lesser than b', () => {
    expect(e(`calc(${gte(0, 1)})`)).to.equal(0);
  });
});
