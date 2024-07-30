import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import lt from './lt.mjs';

describe('lt', () => {
  it('returns 1 if a is lesser than b', () => {
    assert.strictEqual(evaluate(`calc(${lt(0, 1)})`), 1);
  });

  it('returns 0 if a is greater than b', () => {
    assert.strictEqual(evaluate(`calc(${lt(1, 0)})`), 0);
  });

  it('returns 0 if a equals b', () => {
    assert.strictEqual(evaluate(`calc(${lt(1, 1)})`), 0);
  });
});
