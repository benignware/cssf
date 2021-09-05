const assert = require('assert');
const evaluate = require('../eval');
const abs = require('./abs');

describe('abs', () => {
  it('returns positive value', () => {
    const actual = abs('-342px');

    assert.strictEqual(evaluate(actual), '342px');
  });
});
