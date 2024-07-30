import assert from 'assert';
import log from './log.mjs';
import evaluate from '../eval/eval.mjs';
import { toPrecision } from '../utils.mjs';

describe('log', () => {
  // it('should return 0 when the input is 1', () => {
  //   assert.strictEqual(evaluate(`calc(${log(1)})`), 0);
  // });

  // it('should return 1 when the input is e', () => {
  //   assert.strictEqual(evaluate(`calc(${log(Math.E)})`), 1);
  // });

  // it('should return 2 when the input is 7.389', () => {
  //   assert.strictEqual(toPrecision(evaluate(`calc(${log(7.389)})`)), 2);
  // });

  // xit('should handle dynamic input', () => {
  //   assert.strictEqual(toPrecision(evaluate(`calc(${log('var(--x)')})`, {
  //     '--x': 7.389
  //   })), 2);
  // });

  // it(`should return '200px' when the input is 7.389 and the result is multiplied by '100px'`, () => {
  //   assert.strictEqual(toPrecision(evaluate(`calc(100px * ${log(7.389)})`)), '200px');
  // });

  // it('should return 1 when the input is 10 and the base is 10', () => {
  //   assert.strictEqual(evaluate(`calc(${log(10, 10)})`), 1);
  // });

  // it('should return 4 when the input is 16 and the base is 2', () => {
  //   assert.strictEqual(toPrecision(evaluate(`calc(${log(16, 2)})`)), 4);
  // });

  // it('should return ~2.3026 when the input is 10', () => {
  //   assert.strictEqual(toPrecision(evaluate(`calc(${log(10)})`)), toPrecision(2.3026));
  // });

  it('should return 0 when the input is 1', () => {
    assert.strictEqual(evaluate(`log(1)`), 0);
  });

  it('should return 1 when the input is e', () => {
    assert.strictEqual(evaluate(`log(e)`), 1);
  });

  it('should return 2 when the input is 7.389', () => {
    assert.strictEqual(toPrecision(evaluate(`log(7.389)`)), 2);
  });

  it('should handle dynamic input', () => {
    assert.strictEqual(toPrecision(evaluate(`log(var(--x)`, {
      '--x': 7.389
    })), 2);
  });

  it(`should return '200px' when the input is 7.389 and the result is multiplied by '100px'`, () => {
    assert.strictEqual(toPrecision(evaluate(`calc(100px * log(7.389))`)), '200px');
  });

  it('should return 1 when the input is 10 and the base is 10', () => {
    assert.strictEqual(evaluate(`calc(log(10, 10))`), 1);
  });

  it('should return 4 when the input is 16 and the base is 2', () => {
    assert.strictEqual(toPrecision(evaluate(`calc(log(16, 2))`)), 4);
  });

  it('should return ~2.3026 when the input is 10', () => {
    assert.strictEqual(toPrecision(evaluate(`calc(log(10))`)), toPrecision(2.3026));
  });
});
