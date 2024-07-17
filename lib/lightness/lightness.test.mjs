import assert from 'assert';
import chroma from 'chroma-js';
import lightness from './lightness.mjs';
import evaluate from '../eval/eval.mjs';

describe('lightness', () => {
  it('retrieves lightness from hsl', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const s = lightness(hsl);

    assert.strictEqual(evaluate(s), 0.6);
  });

  it('retrieves lightness from hex', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const hex = chroma(hsl).hex();
    const s = lightness(hex);

    assert.strictEqual(evaluate(s), chroma(hsl).hsl()[2]);
  });

  it('retrieves lightness from from rgb', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const rgb = `rgb(${chroma(hsl).rgb().join(', ')})`;
    const s = lightness(rgb);

    assert.strictEqual(evaluate(s), chroma(hsl).hsl()[2]);
  });

  it('retrieves lightness from rgb dynamically', () => {
    const color = chroma.hsl(123, 0.43, 0.6);
    const [r, g, b] = color.rgb();
    const rgb = `rgb(var(--r), var(--g), var(--b))`;
    const s = lightness(rgb);

    assert.strictEqual(
      evaluate(s, {
        r,
        g,
        b,
      }),
      color.hsl()[2]
    );
  });
});
