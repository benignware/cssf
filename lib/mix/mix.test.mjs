import assert from 'assert';
import mix from './mix.mjs';
import evaluate from '../eval/eval.mjs';

xdescribe('mix', () => {
  it('mixes hsla colors', () => {
    const hsl1 = 'hsla(60, 25%, 75%, 1)';
    const hsl2 = 'hsla(300, 75%, 25%, 1)';
    const expected = 'hsla(180, 50%, 50%, 1)';
    const actual = mix(hsl1, hsl2);

    assert.strictEqual(evaluate(actual), expected);
  });

  it('mixes rgb colors', () => {
    const rgb1 = 'rgb(0, 0, 0)';
    const rgb2 = 'rgb(255, 255, 255)';
    const expected = 'rgba(127.5, 127.5, 127.5, 1)';
    const actual = mix(rgb1, rgb2);

    assert.strictEqual(evaluate(actual), expected);
  });

  it('mixes rgb colors by percentage', () => {
    const rgb1 = 'rgb(0, 0, 0)';
    const rgb2 = 'rgb(255, 255, 255)';
    const expected = 'rgba(127.5, 127.5, 127.5, 1)';
    const actual = mix(rgb1, rgb2, '50%');

    assert.strictEqual(evaluate(actual), expected);
  });

  it('mixes rgb colors with dynamic weight', () => {
    const rgb1 = 'rgb(0, 0, 0)';
    const rgb2 = 'rgb(255, 255, 255)';
    const expected = 'rgba(127.5, 127.5, 127.5, 1)';
    const actual = evaluate(mix(rgb1, rgb2, 'var(--weight)'), {
      '--weight': 0.5,
    });

    assert.strictEqual(actual, expected);
  });
});
