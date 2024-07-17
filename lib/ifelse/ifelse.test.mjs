import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import ifelse from './ifelse.mjs';

describe('ifelse', () => {
  it('evaluates condition', () => {
    assert.strictEqual(evaluate(ifelse(1, 1, 0)), 1);
  });
});
