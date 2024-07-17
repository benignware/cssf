import assert from 'assert';
import chroma from 'chroma-js';
import alpha from './alpha.mjs';
import evaluate from '../eval/eval.mjs';

describe('alpha', () => {
  it('retrieves alpha from hsla', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.5)';
    const a = alpha(hsl);

    assert.strictEqual(evaluate(a), chroma(hsl).alpha());
  });

  it('retrieves alpha from hex', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.5)';
    const hex = chroma(hsl).hex();
    const a = alpha(hex);

    assert.strictEqual(evaluate(a), chroma(hsl).alpha());
  });

  it('retrieves alpha from from rgb', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.5)';
    const color = chroma(hsl);
    const rgb = `rgba(${color.rgb().join(', ')}, ${color.alpha()})`;
    const a = alpha(rgb);

    assert.strictEqual(evaluate(a), color.alpha());
  });

  it('retrieves alpha from rgb dynamically', () => {
    const hsl = 'hsla(123, 43%, 60%, 0.5)';
    const color = chroma(hsl);
    const [r, g, b] = color.rgb();
    const rgb = `rgba(var(--r), var(--g), var(--b), var(--a))`;
    const a = alpha(rgb);

    assert.strictEqual(
      evaluate(a, {
        r,
        g,
        b,
        a: color.alpha(),
      }),
      color.alpha()
    );
  });
});
