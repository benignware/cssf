const assert = require('assert');
const evaluate = require('../eval');
const eq = require('./eq');

describe('eq', () => {
  it('returns 1 if a equals b', () => {
    assert.strictEqual(evaluate(eq(0, 0)), 1);
  });

  it('returns 0 if a does not equal b', () => {
    assert.strictEqual(evaluate(eq(1, 1.0001)), 0);
  });
});
