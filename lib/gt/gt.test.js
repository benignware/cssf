const assert = require('assert');
const evaluate = require('../eval');
const gt = require('./gt');

describe('gt', () => {
  it('returns 1 if a is greater than b', () => {
    assert.strictEqual(evaluate(gt(1, 0)), 1);
  });

  it('returns 0 if a is lesser than b', () => {
    assert.strictEqual(evaluate(gt(0, 1)), 0);
  });

  it('returns 0 if a equals b', () => {
    assert.strictEqual(evaluate(gt(0, 0)), 0);
  });
});
