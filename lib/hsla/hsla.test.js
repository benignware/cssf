const assert = require('assert');
const chroma = require('chroma-js');
const hsla = require('./hsla');
const evaluate = require('../eval');

describe('hsla', () => {
  it('creates hsla color', () => {
    assert.strictEqual(hsla(123, 0.43, 0.6, 0.9), 'hsla(123, 43%, 60%, 0.9)');
  });

  it('creates hsla color from hex', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.9)';
    const color = chroma(hsl);
    const hex = color.hex();
    const actual = hsla(hex);

    const expected = `hsla(${[
      ...color
        .hsl()
        .slice(0, 3)
        .map((v) => (v = isNaN(v) ? 0 : v))
        .map((v, i) => (i === 1 || i === 2 ? `${Math.round(v * 100)}%` : v)),
      color.alpha(),
    ].join(', ')})`;

    assert.strictEqual(actual, expected);
  });

  it('creates hsla color from rgb', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.9)';
    const color = chroma(hsl);
    const rgb = `rgb(${color.rgb().join(', ')})`;
    const expected = `hsla(${[
      ...color
        .hsl()
        .slice(0, 3)
        .map((v) => (v = isNaN(v) ? 0 : v))
        .map((v, i) => (i === 1 || i === 2 ? `${v * 100}%` : v)),
      color.alpha(),
    ].join(', ')})`;
    const actual = hsla(rgb, 0.9);

    assert.strictEqual(evaluate(actual), expected);
  });

  it('creates hsla color from rgb dynamically', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.9)';
    const color = chroma(hsl);
    const rgb = `rgba(var(--r), var(--g), var(--b), var(--a))`;
    const [r, g, b] = color.rgb();

    const expected = `hsla(${[
      ...color
        .hsl()
        .slice(0, 3)
        .map((v) => (v = isNaN(v) ? 0 : v))
        .map((v, i) => (i === 1 || i === 2 ? `${v * 100}%` : v)),
      color.alpha(),
    ].join(', ')})`;

    assert.strictEqual(
      evaluate(hsla(rgb, color.alpha()), {
        r,
        g,
        b,
        a: color.alpha(),
      }),
      expected
    );
  });
});
