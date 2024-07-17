import assert from 'assert';
import contrastRatio from './contrastRatio.mjs';
import evaluate from '../eval/eval.mjs';

describe('contrastRatio', () => {
  it('computes contrast ratio', () => {
    const rgb1 = 'rgb(0, 0, 0)';
    const rgb2 = 'rgb(255, 255, 255)';
    const actual = contrastRatio(rgb2, rgb1);

    assert.strictEqual(evaluate(actual), 21);
  });
});
