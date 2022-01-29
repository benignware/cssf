const assert = require('assert');
const evaluate = require('../eval');
const floor = require('./floor');

describe('floor', () => {
  it('rounds to next smaller integer', () => {
    const a = 2.99999;

    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });

  it('is safe with zero', () => {
    const a = 2.66;

    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });

  it('rounds value down', () => {
    const a = 3.1111;

    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });

  it('rounds negative value down', () => {
    const a = -3.1111;

    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });

  it('rounds negative value to next smaller integer', () => {
    const a = -2.99999;

    assert.strictEqual(evaluate(floor(a)), Math.floor(a));
  });
});
