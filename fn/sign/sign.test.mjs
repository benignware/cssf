import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { sign } from './sign.mjs';

const e = getEval();

function isMinusZero(value) {
  // return 1/value === -Infinity;
  return Math.atan2(0, value) === Math.PI;
}

describe('sign', () => {
  it('returns 1 if value is positive', () => {
    expect(e(`calc(${sign(2.99999)})`)).to.equal(1);
  });

  it('returns -1 if value is negative', () => {
    expect(e(`calc(${sign(-2.99999)})`)).to.equal(-1);
  });

  it('returns 0 if value is positive zero', () => {
    expect(e(`calc(${sign(0)})`)).to.equal(0);
  });

  xit('returns -0 if value is negative zero', () => {
    expect(isMinusZero(e(`calc(${sign(-0)})`))).to.be.true;
  });
});

