import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import not from './not.mjs';

describe('not', () => {
  it('returns 1 if a is 0', () => {
    assert.strictEqual(evaluate(not(0)), 1);
  });

  it('returns 0 if a is 1', () => {
    assert.strictEqual(evaluate(not(1)), 0);
  });
});
