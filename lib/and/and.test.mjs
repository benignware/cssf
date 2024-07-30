import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import and from './and.mjs';

describe('and', () => {
  it('returns 1 if a and b is both 1', () => {
    assert.strictEqual(evaluate(`calc(${and(1, 1)}`), 1);
  });

  it('returns 0 if a is 0', () => {
    assert.strictEqual(evaluate(`calc(${and(0, 1)}`), 0);
  });

  it('returns 0 if b is 0', () => {
    assert.strictEqual(evaluate(`calc(${and(1, 0)}`), 0);
  });

  it('returns 0 if a and b is both 0', () => {
    assert.strictEqual(evaluate(`calc(${and(0, 0)}`), 0);
  });

  it('handles calc expressions', () => {
    assert.strictEqual(evaluate(`calc(${and('calc(1)', 'calc(1)')}`), 1);
  });
});
