const assert = require('assert');
const evaluate = require('../eval');
const lte = require('./lte');

describe('lte', () => {
  it('returns 1 if a equals b', () => {
    assert.strictEqual(evaluate(lte(0, 0)), 1);
  });

  it('returns 1 if a is lesser than b', () => {
    assert.strictEqual(evaluate(lte(0, 1)), 1);
  });

  it('returns 0 if a is greater than b', () => {
    assert.strictEqual(evaluate(lte(1, 0)), 0);
  });
});
