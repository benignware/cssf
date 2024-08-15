import { expect } from 'chai';
import { log } from './log.mjs';
import { getEval } from '../../utils/eval/getEval.mjs';

const e = getEval({ log });

describe('log', () => {
  it('should return 0 when the input is 1', () => {
    expect(e(`calc(${log(1)})`)).to.equal(0);
  });

  it('should return 1 when the input is e', () => {
    expect(e(`calc(${log(Math.E)})`)).to.equal(1);
  });

  it('should return 2 when the input is 7.389', () => {
    expect(e(`calc(${log(7.389)})`)).to.be.closeTo(2, 0.01);
  });

  it(`should return '200px' when the input is 7.389 and the result is multiplied by '100px'`, () => {
    expect(e(`calc(100px * ${log(7.389)})`)).to.be.closeToUnit('200px', 0.01);
  });

  it('should return 1 when the input is 10 and the base is 10', () => {
    expect(e(`calc(${log(10, 10)})`)).to.equal(1);
  });

  it('should return ~2.3026 when the input is 10', () => {
    expect(e(`calc(${log(10)})`)).to.be.closeTo(2.3026, 0.0001);
  });

  xit('should handle dynamic input', () => {
    const input = `calc(${log('var(--x)')})`;
    const actual = e(input, {
      '--x': 7.389
    });

    expect(actual).to.be.closeTo(2, 0.01);
  });
});
