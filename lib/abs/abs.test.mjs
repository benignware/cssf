import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import abs from './abs.mjs';

describe('abs', () => {
  it('returns positive value', () => {
    const actual = abs('-342px');

    assert.strictEqual(evaluate(actual), '342px');
  });
});
