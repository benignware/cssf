const assert = require('assert');
const evaluate = require('../eval');
const lt = require('./lt');

describe('lt', () => {
  it('returns 1 if a is lesser than b', () => {
    assert.strictEqual(evaluate(lt(0, 1)), 1);
  });

  it('returns 0 if a is greater than b', () => {
    assert.strictEqual(evaluate(lt(1, 0)), 0);
  });

  it('returns 0 if a equals b', () => {
    assert.strictEqual(evaluate(lt(0, 0)), 0);
  });
});
