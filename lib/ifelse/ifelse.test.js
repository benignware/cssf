const assert = require('assert');
const evaluate = require('../eval');
const ifelse = require('./ifelse');

describe('ifelse', () => {
  it('evaluates condition', () => {
    assert.strictEqual(evaluate(ifelse(1, 1, 0)), 1);
  });
});
