import assert from 'assert';
import lighten from './lighten.mjs';
import evaluate from '../eval/eval.mjs';

describe('lighten', () => {
  it('lightens hsl color', () => {
    const hsl = 'hsl(123, 43%, 0%)';
    const actual = lighten(hsl, 0.5);
    const expected = `hsl(123, 43%, 50%)`;

    assert.strictEqual(evaluate(actual), expected);
  });

  it('lightens rgb color', () => {
    const rgb = 'rgb(0, 0, 0)';
    const actual = lighten(rgb, 0.5);
    const expected = `rgb(127.5, 127.5, 127.5)`;

    assert.strictEqual(evaluate(actual), expected);
  });
});
