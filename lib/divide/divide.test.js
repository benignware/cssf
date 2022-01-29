const assert = require('assert');
const divide = require('./divide');

describe('divide', () => {
  it('computes plain numbers', () => {
    assert.strictEqual(divide(15, 3), 5);
  });

  it('computes multiple values', () => {
    assert.strictEqual(divide(15, 3, 2), 2.5);
  });

  it('computes same units', () => {
    assert.strictEqual(divide('15px', '3px'), '5px');
  });

  it(`doesn't compute different units`, () => {
    assert.strictEqual(divide('15px', '3rem'), 'calc(15px / 3rem)');
  });

  it(`doesn't compute terms`, () => {
    assert.strictEqual(divide('3px + 4px', '5rem'), 'calc((3px + 4px) / 5rem)');
  });

  it(`doesn't concatenate strings`, () => {
    assert.notStrictEqual(divide('Hello', ' World'), 'Hello World');
  });
});
