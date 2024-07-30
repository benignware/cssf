import assert from 'assert';
import exp from './exp.mjs';
import evaluate from '../eval/eval.mjs';

// Test cases for exp function
describe('exp', () => {
  it('should return 1 when the input is 0', () => {
    assert.strictEqual(evaluate(`calc(${exp(0)})`), 1);
  });

  it('should return e when the input is 1', () => {
    assert.strictEqual(evaluate(`calc(${exp(1)})`), Math.E);
  });

  it('should return e^2 when the input is 2', () => {
    assert.strictEqual(evaluate(`calc(${exp(2)})`), Math.E ** 2);
  });

  xit('should return exp for dynamic base', () => {
    const base = 2;
    const result = exp(`var(--base)`);

    assert.strictEqual(evaluate(`calc(${exp(`var(--base)`)} )`, {
      '--base': base,
    }), Math.E ** 2);
  });

  xit('should return e^(-1) when the input is -1', () => {
    assert.strictEqual(evaluate(`calc(${exp(-1)})`), Math.E ** -1);
  });

 xit('should return NaN when the input is NaN', () => {
    assert.strictEqual(evaluate(`calc(${exp(NaN)})`, { '--base': NaN }), NaN);
  });
});