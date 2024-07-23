import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import eq from './eq.mjs';

describe('eq', () => {
  it('returns 1 if integer a equals integer b', () => {
    assert.strictEqual(evaluate(eq(1, 1)), 1);
  });

  it('returns 0 if integer a does not equal integer b', () => {
    assert.strictEqual(evaluate(eq(1, 2)), 0);
  });

  it('returns 1 if float a equals float b', () => {
    assert.strictEqual(evaluate(eq(1.2345678, 1.2345678)), 1);
  });

  it('returns 0 if float a does not equal float b', () => {
    assert.strictEqual(evaluate(eq(1.2345678, -1.2345678)), 0);
  });

  it('returns 1 if a equals b', () => {
    assert.strictEqual(evaluate(eq(0, 0)), 1);
  });

  it('compares with infinity', () => {
    assert.strictEqual(evaluate(eq('1 / infinity', 0)), 1);
  });

  it('compares with negative infinity', () => {
    assert.strictEqual(evaluate(eq('1 / -infinity', '-0')), 1);
  });
});
