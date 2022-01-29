const assert = require('assert');
const mod = require('./mod');
const evaluate = require('../eval');

describe('mod', () => {
  it('returns remainder', () => {
    assert.strictEqual(evaluate(mod(240, 360)), eval(`240 % 360`));
  });

  it('returns remainder when a is negative', () => {
    assert.strictEqual(evaluate(mod(360 - 120, 360)), eval(`360 - 120 % 360`));
  });

  it('returns remainder when a is larger than b', () => {
    assert.strictEqual(
      evaluate(mod(360 + 120, 360)),
      eval(`(360 + 120) % 360`)
    );
  });
});
