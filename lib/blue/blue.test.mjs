import assert from 'assert';
import chroma from 'chroma-js';
import blue from './blue.mjs';
import evaluate from '../eval/eval.mjs';

xdescribe('blue', () => {
  it('retrieves blue from rgb', () => {
    const rgb = 'rgb(123, 123, 123)';
    const b = blue(rgb);

    assert.strictEqual(evaluate(b), 123);
  });

  it('retrieves blue from hex', () => {
    const rgb = 'rgb(123, 245, 112)';
    const hex = chroma(rgb).hex();
    const b = blue(hex);

    assert.strictEqual(evaluate(b), chroma(rgb).rgb()[2]);
  });
});

export {};
