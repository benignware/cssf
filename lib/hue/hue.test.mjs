import assert from 'assert';
import chroma from 'chroma-js';
import hue from './hue.mjs';
import evaluate from '../eval/eval.mjs';

describe('hue', () => {
  it('retrieves hue from hsl', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const h = hue(hsl);

    assert.strictEqual(evaluate(h), 123);
  });

  it('retrieves hue from hex', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const hex = chroma(hsl).hex();
    const h = hue(hex);

    assert.strictEqual(evaluate(h), chroma(hsl).hsl()[0]);
  });

  it('retrieves hue from from rgb', () => {
    const hsl = 'hsl(123, 43%, 60%)';
    const rgb = `rgb(${chroma(hsl).rgb().join(', ')})`;
    const h = hue(rgb);

    assert.strictEqual(evaluate(h), chroma(hsl).hsl()[0]);
  });

  it('retrieves hue from rgb dynamically', () => {
    const color = chroma.hsl(123, 0.43, 0.6);
    const [r, g, b] = color.rgb();
    const rgb = `rgb(var(--r), var(--g), var(--b))`;
    const h = hue(rgb);

    assert.strictEqual(
      evaluate(h, {
        r,
        g,
        b,
      }),
      color.hsl()[0]
    );
  });
});

export default hue;
