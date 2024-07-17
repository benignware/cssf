import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import lte from './lte.mjs';

describe('lte', () => {
  it('returns 1 if a equals b', () => {
    assert.strictEqual(evaluate(lte(0, 0)), 1);
  });

  it('returns 1 if a is lesser than b', () => {
    assert.strictEqual(evaluate(lte(0, 1)), 1);
  });

  it('returns 0 if a is greater than b', () => {
    assert.strictEqual(evaluate(lte(1, 0)), 0);
  });
});
