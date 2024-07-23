import assert from 'assert';
import rem from './rem.mjs';
import evaluate from '../eval/eval.mjs';

describe('rem', () => {
  it('returns remainder', () => {
    assert.strictEqual(evaluate(rem(240, 360)), 240 % 360);
  });

  it('returns remainder when a is negative', () => {
    assert.strictEqual(evaluate(rem(360 - 120, 360)), (360 - 120) % 360);
  });

  it('returns remainder when a is larger than b', () => {
    assert.strictEqual(evaluate(rem(360 + 120, 360)), (360 + 120) % 360);
  });
});
