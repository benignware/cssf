import assert from 'assert';
import chroma from 'chroma-js';
import green from './green.mjs';
import evaluate from '../eval/eval.mjs';

describe('green', () => {
  it('retrieves green from rgb', () => {
    const rgb = 'rgb(123, 123, 123)';
    const r = green(rgb);

    assert.strictEqual(evaluate(r), 123);
  });

  it('retrieves green from hex', () => {
    const rgb = 'rgb(123, 245, 112)';
    const hex = chroma(rgb).hex();
    const g = green(hex);

    assert.strictEqual(evaluate(g), chroma(rgb).rgb()[1]);
  });

  it('retrieves red from from achromatic hsl', () => {
    const hsl = 'hsl(150, 10%, 20%)';
    const g = green(hsl);

    assert.strictEqual(evaluate(g), chroma(hsl).rgb()[1]);
  });
});