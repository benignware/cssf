import assert from 'assert';
import rem from './rem.mjs';
import evaluate from '../eval/eval.mjs';

describe('rem', () => {
  xit('returns remainder', () => {
    assert.strictEqual(evaluate(`calc(${rem(120, 360)})`), 120 % 360);
  });

  xit('returns remainder when a is negative', () => {
    assert.strictEqual(evaluate(`calc(${rem(-120, 360)})`), -120 % 360);
  });

  it('returns remainder when a is larger than b', () => {
    assert.strictEqual(evaluate(`calc(${rem(360, 120)})`), 360 % 120);
  });
});
