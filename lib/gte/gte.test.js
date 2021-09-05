const assert = require('assert');
const evaluate = require('../eval');
const gte = require('./gte');

describe('gte', () => {
  it('returns 1 if a equals b', () => {
    assert.strictEqual(evaluate(gte(0, 0)), 1);
  });

  it('returns 1 if a is greater than b', () => {
    assert.strictEqual(evaluate(gte(1, 0)), 1);
  });

  it('returns 0 if a is lesser than b', () => {
    assert.strictEqual(evaluate(gte(0, 1)), 0);
  });
});
