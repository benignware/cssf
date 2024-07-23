import { strictEqual } from 'assert';
import chroma from 'chroma-js';
import hsla from './hsla.mjs';
import evaluate from '../eval/eval.mjs';

describe('hsla', () => {
  it('creates hsla color', () => {
    strictEqual(hsla(123, 0.43, 0.6, 0.9), 'hsla(123, 43%, 60%, 0.9)');
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

    strictEqual(actual, expected);
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

    strictEqual(evaluate(actual), expected);
  });

  it('creates hsla color from rgb dynamically', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.9)';
    const color = chroma(hsl);
    const rgb = `rgba(var(--r), var(--g), var(--b), var(--a))`;
    const [r, g, b] = color.rgb();
    const a = color.alpha();

    const expected = `hsla(${[
      ...color
        .hsl()
        .slice(0, 3)
        .map((v) => (v = isNaN(v) ? 0 : v))
        .map((v, i) => (i === 1 || i === 2 ? `${v * 100}%` : v)),
      color.alpha(),
    ].join(', ')})`;

    strictEqual(
      evaluate(hsla(rgb, color.alpha()), {
        '--r': r,
        '--g': g,
        '--b': b,
        '--a': a,
      }),
      expected
    );
  });
});
