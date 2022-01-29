const assert = require('assert');
const evaluate = require('../eval/eval');
const add = require('./add');

describe('add', () => {
  it('computes plain numbers', () => {
    assert.strictEqual(add(3, 5), 8);
  });

  it('computes multiple values', () => {
    assert.strictEqual(add(3, 5, 10), 18);
  });

  it('computes same units', () => {
    assert.strictEqual(add('3px', '5px'), '8px');
  });

  it(`doesn't compute different units`, () => {
    assert.strictEqual(add('3px', '5rem'), 'calc(3px + 5rem)');
  });

  it(`doesn't compute terms`, () => {
    assert.strictEqual(add('3px + 4px', '5rem'), 'calc((3px + 4px) + 5rem)');
  });

  it('concatenates strings', () => {
    assert.strictEqual(add('Hello', ' World'), 'Hello World');
  });
});
