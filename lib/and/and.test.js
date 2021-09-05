const assert = require('assert');
const evaluate = require('../eval');
const and = require('./and');

describe('and', () => {
  it('returns 1 if a and b is both 1', () => {
    assert.strictEqual(evaluate(and(1, 1)), 1);
  });

  it('returns 0 if a is 0', () => {
    assert.strictEqual(evaluate(and(0, 1)), 0);
  });

  it('returns 0 if b is 0', () => {
    assert.strictEqual(evaluate(and(1, 0)), 0);
  });

  it('returns 0 if a and b is both 0', () => {
    assert.strictEqual(evaluate(and(0, 0)), 0);
  });
});
