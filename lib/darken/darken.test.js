const assert = require('assert');
// const chroma = require('chroma-js');
const darken = require('./darken');
const evaluate = require('../eval');

describe('darken', () => {
  it('darkens hsl color', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    // const color = chroma(hsl);
    const actual = darken(hsl, 0.5);
    const expected = `hsl(123, 43%, 30%)`;
    // const expected = color.darken(0.5).hsl();

    assert.strictEqual(evaluate(actual), expected);
  });

  it('darkens rgb color', () => {
    const rgb = 'rgb(255, 255, 255)';
    // const color = chroma(hsl);
    const actual = darken(rgb, 0.5);
    const expected = `rgb(127.5, 127.5, 127.5)`;
    // const expected = color.darken(0.5).hsl();

    assert.strictEqual(evaluate(actual), expected);
  });
});
