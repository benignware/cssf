import { expect } from "chai";
import { exp } from "./exp.mjs";
import { getEval } from "../../utils/eval/getEval.mjs";

const e = getEval({ exp });

// Test cases for exp function
describe('exp', () => {
  it('should return 1 when the input is 0', () => {
    expect(e(`calc(${exp(0)})`)).to.equal(1);
  });

  it('should return e when the input is 1', () => {
    expect(e(`calc(${exp(1)})`)).to.equal(Math.E);
  });

  it('should return e^2 when the input is 2', () => {
    expect(e(`calc(${exp(2)})`)).to.be.closeTo(Math.E ** 2, 0.01);
  });

  xit('should return exp for dynamic base', () => {
    const base = 2;
    const result = exp(`var(--base)`);

    expect(e(`calc(${result})`, { '--base': base })).to.be.closeTo(Math.E ** base, 0.01);
  });

  xit('should return e^(-1) when the input is -1', () => {
    expect(e(`calc(${exp(-1)})`)).to.be.closeTo(1 / Math.E, 0.01);
  });

 xit('should return NaN when the input is NaN', () => {
    expect(e(`calc(${exp(NaN)})`)).to.be.NaN;
  });
});