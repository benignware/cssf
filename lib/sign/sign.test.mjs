import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import sign from './sign.mjs';
import eq from '../eq/eq.mjs';

function isMinusZero(value) {
  // return 1/value === -Infinity;
  return Math.atan2(0, value) === Math.PI;
}



describe('sign', () => {
  it('returns 1 if value is positive', () => {
    assert.strictEqual(evaluate(sign(2.99999)), 1);
  });

  it('returns -1 if value is negative', () => {
    assert.strictEqual(evaluate(sign(-2.99999)), -1);
  });

  it('returns 0 if value is positive zero', () => {
    assert.strictEqual(evaluate(sign(0)), 0);
  });

  xit('returns -0 if value is negative zero', () => {
    assert.strictEqual(evaluate(sign(-0)), -0);
  });
});

