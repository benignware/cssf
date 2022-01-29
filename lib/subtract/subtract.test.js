const assert = require('assert');
const subtract = require('./subtract');

describe('subtract', () => {
  it('computes plain numbers', () => {
    assert.strictEqual(subtract(15, 3), 12);
  });

  it('computes multiple values', () => {
    assert.strictEqual(subtract(15, 3, 10), 2);
  });

  it('computes same units', () => {
    assert.strictEqual(subtract('15px', '3px'), '12px');
  });

  it(`doesn't compute different units`, () => {
    assert.strictEqual(subtract('15px', '3rem'), 'calc(15px - 3rem)');
  });

  it(`doesn't compute terms`, () => {
    assert.strictEqual(
      subtract('3px + 4px', '5rem'),
      'calc((3px + 4px) - 5rem)'
    );
  });

  it(`doesn't concatenate strings`, () => {
    assert.notStrictEqual(subtract('Hello', ' World'), 'Hello World');
  });
});
