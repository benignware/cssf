import assert from 'assert';
import mod from './mod.mjs';
import evaluate from '../eval/eval.mjs';

describe('mod', () => {
  it('returns remainder', () => {
    assert.strictEqual(evaluate(mod(240, 360)), 240 % 360);
  });

  it('returns remainder when a is negative', () => {
    assert.strictEqual(evaluate(mod(360 - 120, 360)), (360 - 120) % 360);
  });

  it('returns remainder when a is larger than b', () => {
    assert.strictEqual(evaluate(mod(360 + 120, 360)), (360 + 120) % 360);
  });
});
