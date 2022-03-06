const assert = require('assert');
const contrastColor = require('./contrastColor');
const evaluate = require('../eval');
const chroma = require('chroma-js');

describe('contrastColor', () => {
  it('computes light contrast color', () => {
    const rgb = 'rgb(5, 0, 5)';
    const actual = contrastColor(rgb);
    const expected = 'rgba(255, 255, 255, 1)';

    assert.strictEqual(evaluate(actual), expected);
  });

  it('computes dark contrast color', () => {
    const rgb = 'rgb(255, 0, 255)';
    const actual = contrastColor(rgb);
    const expected = 'rgba(0, 0, 0, 1)';

    assert.strictEqual(evaluate(actual), expected);
  });

  it('computes light contrast color with given contrast colors', () => {
    const rgb = 'rgb(5, 0, 5)';
    const actual = contrastColor(
      rgb,
      'rgba(240, 240, 240, 1)',
      'rgba(10, 10, 10, 1)'
    );
    const expected = 'rgba(240, 240, 240, 1)';

    assert.strictEqual(evaluate(actual), expected);
  });

  it('computes dark contrast color with given contrast colors', () => {
    const rgb = 'rgb(255, 0, 255)';
    const actual = contrastColor(
      rgb,
      'rgba(240, 240, 240, 1)',
      'rgba(10, 10, 10, 1)'
    );
    const expected = 'rgba(10, 10, 10, 1)';

    assert.strictEqual(evaluate(actual), expected);
  });

  it('computes light contrast color dynamically', () => {
    const rgb = 'rgb(5, 0, 5)';
    const color = chroma(rgb);
    const [r, g, b] = color.rgb();
    const actual = contrastColor(
      `rgba(var(--r), var(--g), var(--b), var(--a))`
    );
    const expected = 'rgba(255, 255, 255, 1)';

    assert.strictEqual(
      evaluate(actual, {
        r,
        g,
        b,
      }),
      expected
    );
  });

  it('computes dark contrast color dynamically', () => {
    const rgb = 'rgb(255, 0, 255)';
    const color = chroma(rgb);
    const [r, g, b] = color.rgb();
    const actual = contrastColor(
      `rgba(var(--r), var(--g), var(--b), var(--a))`
    );
    const expected = 'rgba(0, 0, 0, 1)';

    assert.strictEqual(
      evaluate(actual, {
        r,
        g,
        b,
      }),
      expected
    );
  });
});
