const assert = require('assert');
const calc = require('./calc');

describe('calc', () => {
  it('wraps expression in calc', () => {
    assert.strictEqual(calc('543px + 234px'), 'calc(543px + 234px)');
  });

  it('strips nested calc', () => {
    assert.strictEqual(calc('calc(543px + 234px)'), 'calc(543px + 234px)');
  });
});
