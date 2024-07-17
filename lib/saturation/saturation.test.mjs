import assert from 'assert';
import chroma from 'chroma-js';
import saturation from './saturation.mjs';
import evaluate from '../eval/eval.mjs';

describe('saturation', () => {
  it('retrieves saturation from hsl', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const s = saturation(hsl);

    assert.strictEqual(evaluate(s), Number(chroma(hsl).hsl()[1].toFixed(2)));
  });

  it('retrieves saturation from hex', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const color = chroma(hsl);
    const hex = color.hex();
    const s = saturation(hex);

    assert.strictEqual(evaluate(s), Number(chroma(hsl).hsl()[1].toFixed(2)));
  });

  it('retrieves saturation from from rgb', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const color = chroma(hsl);
    const rgb = `rgb(${color.rgb().join(', ')})`;
    const s = saturation(rgb);

    assert.strictEqual(evaluate(s), chroma(hsl).hsl()[1]);
  });

  it('retrieves saturation from rgb dynamically', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const color = chroma(hsl);
    const [r, g, b] = color.rgb();
    const rgb = `rgb(var(--r), var(--g), var(--b))`;
    const s = saturation(rgb);

    assert.strictEqual(
      evaluate(s, {
        r,
        g,
        b,
      }),
      chroma(hsl).hsl()[1]
    );
  });
});

export {};
