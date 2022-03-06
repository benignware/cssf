const assert = require('assert');
// const chroma = require('chroma-js');
const darken = require('./darken');
const evaluate = require('../eval');

describe('darken', () => {
  it('darkens hsl color', () => {
    const hsl = 'hsl(123, 43%, 100%)';
    const actual = darken(hsl, 0.5);
    const expected = `hsl(123, 43%, 50%)`;

    assert.strictEqual(evaluate(actual), expected);
  });

  it('darkens rgb color', () => {
    const rgb = 'rgb(255, 255, 255)';
    const actual = darken(rgb, 0.5);
    const expected = `rgb(127.5, 127.5, 127.5)`;

    assert.strictEqual(evaluate(actual), expected);
  });
});
