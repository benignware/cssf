import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import gte from './gte.mjs';

describe('gte', () => {
  it('returns 1 if a equals b', () => {
    assert.strictEqual(evaluate(`calc(${gte(1, 1)})`), 1);
  });

  it('returns 1 if a is greater than b', () => {
    assert.strictEqual(evaluate(`calc(${gte(1, 0)})`), 1);
  });

  it('returns 0 if a is lesser than b', () => {
    assert.strictEqual(evaluate(`calc(${gte(0, 1)})`), 0);
  });
});
