const assert = require('assert');
const multiply = require('./multiply');

describe('multiply', () => {
  it('computes plain numbers', () => {
    assert.strictEqual(multiply(3, 5), 15);
  });

  it('computes multiple values', () => {
    assert.strictEqual(multiply(3, 5, 4), 60);
  });

  it('computes same units', () => {
    assert.strictEqual(multiply('3px', '5px'), '15px');
  });

  it(`doesn't compute different units`, () => {
    assert.strictEqual(multiply('3px', '5rem'), 'calc(3px * 5rem)');
  });

  it(`doesn't compute terms`, () => {
    assert.strictEqual(
      multiply('3px + 4px', '5rem'),
      'calc((3px + 4px) * 5rem)'
    );
  });

  it(`doesn't concatenate strings`, () => {
    assert.notStrictEqual(multiply('Hello', ' World'), 'Hello World');
  });
});
