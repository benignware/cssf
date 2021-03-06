const assert = require('assert');
const chroma = require('chroma-js');
const red = require('./red');
const evaluate = require('../eval');

describe('red', () => {
  it('retrieves red from achromatic rgb', () => {
    const rgb = 'rgb(123, 123, 123)';
    const r = red(rgb);

    assert.strictEqual(evaluate(r), 123);
  });

  it('retrieves red from hex', () => {
    const rgb = 'rgb(123, 245, 112)';
    const hex = chroma(rgb).hex();
    const r = red(hex);

    assert.strictEqual(evaluate(r), chroma(rgb).rgb()[0]);
  });

  it('retrieves red from from achromatic hsl', () => {
    const hsl = 'hsl(150, 10%, 20%)';
    const r = red(hsl);

    assert.strictEqual(evaluate(r), chroma(hsl).rgb()[0]);
  });
});
