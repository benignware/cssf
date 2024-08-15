import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { not } from './not.mjs';

const e = getEval();

describe('not', () => {
  it('returns 1 if a is 0', () => {
    expect(e(`calc(${not(0)})`)).to.equal(1);
  });

  it('returns 0 if a is 1', () => {
    expect(e(`calc(${not(1)})`)).to.equal(0);
  });
});
