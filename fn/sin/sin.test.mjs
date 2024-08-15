import { expect } from 'chai';
import { sin } from './sin.mjs';
import { getEval } from '../../utils/eval/getEval.mjs';

const e = getEval({ sin });

describe('sin', () => {
  it('should return 0 when the input is 0', () => {
    expect(e(`calc(${sin(0)})`)).to.equal(0);
  });

  it('should return 1 when the input is π/2', () => {
    expect(e(`calc(${sin(Math.PI / 2)})`)).to.be.closeTo(1, 0.01);
  });

  it('should return 0 when the input is π', () => {
    expect(e(`calc(${sin(Math.PI)})`)).to.be.closeTo(0, 0.01);
  });

  xit('should return -1 when the input is 3π/2', () => {
    expect(e(`calc(${sin(3 * Math.PI / 2)})`)).to.be.closeTo(-1, 0.01);
  });

  xit('should return sine for dynamic input', () => {
    expect(e(`calc(${sin('var(--x)')})`, {
      '--x': Math.PI / 2
    })).to.be.closeTo(1, 0.01);
  });
});