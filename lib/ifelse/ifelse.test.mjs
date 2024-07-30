import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import ifelse from './ifelse.mjs';
import eq from '../eq/eq.mjs';

describe('ifelse', () => {
  it('evaluates truthy condition', () => {
    assert.strictEqual(evaluate(`calc(${ifelse(1, 1, 0)})`), 1);
  });

  it('evaluates falsy condition', () => {
    assert.strictEqual(evaluate(`calc(${ifelse(0, 1, 0)})`), 0);
  });

  xit('evaluates truthy condition with infinity', () => {
    assert.strictEqual(evaluate(`calc(${ifelse('1 / infinity', 1, 0)})`), 1);
  });

  it('evaluates a falsy condition with negative infinity', () => {
    assert.strictEqual(evaluate(`calc(${ifelse('1 / -infinity', 0, 0)})`), 0);
  });

  it('resolves a condition to zero', () => {
    assert.strictEqual(evaluate(`calc(${ifelse(1, 0, 1)})`), 0);
  });

  xit('resolves a condition to negative zero', () => {
    assert.strictEqual(evaluate(`calc(${ifelse(1, -0, 1)})`), -0);
  });
});
