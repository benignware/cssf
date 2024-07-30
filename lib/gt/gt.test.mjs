import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import gt from './gt.mjs';

describe('gt', () => {
  it('returns 1 if a is greater than b', () => {
    assert.strictEqual(evaluate(`calc(${gt(1, 0)})`), 1);
  });

  it('returns 0 if a is lesser than b', () => {
    assert.strictEqual(evaluate(`calc(${gt(0, 1)})`), 0);
  });

  it('returns 0 if a equals b', () => {
    assert.strictEqual(evaluate(`calc(${gt(1, 1)})`), 0);
  });
});
