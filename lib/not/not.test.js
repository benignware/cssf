const assert = require('assert');
const evaluate = require('../eval');
const not = require('./not');

describe('not', () => {
  it('returns 1 if a is 0', () => {
    assert.strictEqual(evaluate(not(0)), 1);
  });

  it('returns 0 if a is 1', () => {
    assert.strictEqual(evaluate(not(1)), 0);
  });
});
