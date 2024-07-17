import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import eq from './eq.mjs';

describe('eq', () => {
  it('returns 1 if a equals b', () => {
    assert.strictEqual(evaluate(eq(0, 0)), 1);
  });

  it('returns 0 if a does not equal b', () => {
    assert.strictEqual(evaluate(eq(1, 1.0001)), 0);
  });
});
