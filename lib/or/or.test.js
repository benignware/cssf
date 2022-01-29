const assert = require('assert');
const evaluate = require('../eval');
const and = require('./or');

describe('or', () => {
  it('returns 1 if a is 1 but not b', () => {
    assert.strictEqual(evaluate(and(1, 0)), 1);
  });

  it('returns 1 if b is 1 but not a', () => {
    assert.strictEqual(evaluate(and(0, 1)), 1);
  });

  it('returns 1 if a and b is both 1', () => {
    assert.strictEqual(evaluate(and(1, 1)), 1);
  });

  it('returns 0 if a and b is both 0', () => {
    assert.strictEqual(evaluate(and(0, 0)), 0);
  });
});
