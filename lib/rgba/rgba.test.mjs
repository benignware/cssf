import assert from 'assert';
import chroma from 'chroma-js';
import rgba from './rgba.mjs';
import evaluate from '../eval/eval.mjs';

const rgb2hsl = (r, g, b) =>
  (!g ? chroma(r) : chroma.rgb(r, g, b))
    .hsl()
    .slice(0, 3)
    .map((v) => (v = isNaN(v) ? 0 : v))
    .map((v, i) => (i === 1 || i === 2 ? `${v * 100}%` : v));

describe('rgba', () => {
  it('creates rgba color', () => {
    assert.strictEqual(rgba(123, 230, 199, 0.9), 'rgba(123, 230, 199, 0.9)');
  });

  it('creates rgba color from hex', () => {
    const rgb = 'rgb(255, 25, 25)';
    const color = chroma(rgb);
    const hex = color.hex();
    const actual = rgba(hex);

    const expected = `rgba(${[
      ...color.rgb().map((v) => (v = isNaN(v) ? 0 : v)),
      color.alpha(),
    ].join(', ')})`;

    assert.strictEqual(actual, expected);
  });

  it('creates achromatic rgba color from hsl', () => {
    const rgb = 'rgb(255, 25, 25)';
    const hsl = `hsl(${rgb2hsl(rgb).join(', ')})`;

    const actual = rgba(hsl, 0.9);
    const expected = `rgba(${chroma(hsl).rgb().slice(0, 3).join(', ')}, 0.9)`;

    assert.strictEqual(evaluate(actual), expected);
  });

  it('creates redish rgba color from hsl', () => {
    const rgb = 'rgb(255, 25, 25)';
    const hsl = `hsl(${rgb2hsl(rgb).join(', ')})`;

    const actual = evaluate(rgba(hsl, 0.9));
    const expected = `rgba(${chroma(hsl).rgb().slice(0, 3).join(', ')}, 0.9)`;

    assert.strictEqual(actual, expected);
  });

  it('creates greenish rgba color from hsl', () => {
    const rgb = 'rgb(0, 230, 25)';
    const hsl = `hsl(${rgb2hsl(rgb).join(', ')})`;

    const actual = evaluate(rgba(hsl, 0.9));
    const expected = `rgba(${chroma(hsl).rgb().slice(0, 3).join(', ')}, 0.9)`;

    assert.strictEqual(actual, expected);
  });

  it('creates blueish rgba color from hsl', () => {
    const rgb = 'rgb(25, 25, 255)';
    const hsl = `hsl(${rgb2hsl(rgb).join(', ')})`;

    assert.strictEqual(
      evaluate(rgba(hsl, 0.9)),
      `rgba(${chroma(hsl).rgb().slice(0, 3).join(', ')}, 0.9)`
    );
  });

  it('creates rgb color from hsl dynamically', () => {
    const rgb = 'rgb(25, 25, 255)';
    const hsl = `hsla(var(--h), var(--s), var(--l), var(--a))`;
    const [h, s, l] = rgb2hsl(rgb);

    assert.strictEqual(
      evaluate(rgba(hsl, 0.9), {
        h,
        s: parseFloat(s) / 100,
        l: parseFloat(l) / 100,
        a: 1,
      }),
      `rgba(${chroma(`hsl(${h}, ${s}, ${l})`)
        .rgb()
        .slice(0, 3)
        .join(', ')}, 0.9)`
    );
  });

  it('creates rgb color from implicit comma separated values', () => {
    const rgb = 'rgb(25, 25, 255)';
    const color = chroma(rgb);

    assert.strictEqual(
      evaluate(rgba('var(--rgb)', 1), {
        rgb: color.rgb().join(', '),
      }),
      `rgba(${color.rgb().join(', ')}, ${color.alpha()})`
    );
  });
});

export default rgba;
