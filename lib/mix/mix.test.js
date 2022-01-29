const assert = require('assert');
// const chroma = require('chroma-js');
const mix = require('./mix');
const evaluate = require('../eval');

describe('mix', () => {
  it('mixes hsla colors', () => {
    const hsl1 = 'hsla(60, 25%, 75%, 1)';
    const hsl2 = 'hsla(300, 75%, 25%, 1)';
    const expected = 'hsla(180, 50%, 50%, 1)';
    const actual = mix(hsl1, hsl2);

    assert.strictEqual(evaluate(actual), expected);
  });
});
