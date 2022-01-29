const assert = require('assert');
const chroma = require('chroma-js');
const blue = require('./blue');
const evaluate = require('../eval');

describe('blue', () => {
  it('retrieves blue from rgb', () => {
    const rgb = 'rgb(123, 123, 123)';
    const b = blue(rgb);

    assert.strictEqual(evaluate(b), 123);
  });

  it('retrieves blue from hex', () => {
    const rgb = 'rgb(123, 245, 112)';
    const hex = chroma(rgb).hex();
    const b = blue(hex);

    assert.strictEqual(evaluate(b), chroma(rgb).rgb()[2]);
  });
});
