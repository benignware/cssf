import assert from 'assert';
import chroma from 'chroma-js';
import colorMix from './colorMix.mjs';
import evaluate from '../eval/eval.mjs';

describe('colorMix', () => {
  it('mixes hsla colors', () => {
    const hsl1 = 'hsla(60, 25%, 75%, 1)';
    const hsl2 = 'hsla(300, 75%, 25%, 1)';
    const expected = 'hsla(180, 50%, 50%, 1)';
    const actual = colorMix('in srgb', hsl1, hsl2);

    assert.strictEqual(evaluate(actual), expected);
  });

  it('mixes rgb colors', () => {
    const rgb1 = 'rgb(0, 0, 0)';
    const w1 = '50%';
    const rgb2 = 'rgb(255, 255, 255)';
    const w2 = '50%';
    const rgb1_w1 = `${rgb1} ${w1}`;
    const rgb2_w2 = `${rgb2} ${w2}`;
    const expected = 'rgba(127.5, 127.5, 127.5, 1)';
    const actual = colorMix('in srgb', rgb1_w1, rgb2_w2);

    assert.strictEqual(evaluate(actual), expected);
  });

  it('mixes dynamic rgb colors', () => {
    const c1 = 'rgba(0, 0, 0, 1)';
    const w1 =  0.5;
    const c2 = 'rgba(255, 255, 255, 1)';
    const w2 = 0.5;
    const cw = [[c1, w1], [c2, w2]];
    
    const vars = cw.reduce((acc, [color, weight], i) => {
      const j = i + 1;
      const [r, g, b] = chroma(color).rgb();
      return { ...acc, [`--color-${j}-r`]: r, [`--color-${j}-g`]: g, [`--color-${j}-b`]: b, [`--weight-${j}`]: weight };
    }, {});

    const [a1, a2] = cw.reduce((acc, [color, weight], i) => {
      const j = i + 1;
      return [...acc, `rgba(var(--color-${j}-r), var(--color-${j}-g), var(--color-${j}-b)) var(--weight-${j})`];
    }, []);

    const expected = 'rgba(127.5, 127.5, 127.5, 1)';
    const actual = evaluate(colorMix('in srgb', a1, a2), vars);

    assert.strictEqual(actual, expected);
  });
  

  it('mixes rgb colors with dynamic weight', () => {
    const rgb1 = 'rgba(0, 0, 0, 1) var(--weight)';
    const rgb2 = 'rgba(255, 255, 255, 1)';
    const expected = 'rgba(127.5, 127.5, 127.5, 1)';
    const actual = evaluate(colorMix('in srgb', rgb1, rgb2), {
      '--weight': 0.5,
    });

    assert.strictEqual(actual, expected);
  });

  it('evaluates arguments when parsed from string', () => {
    const rgb1 = 'rgb(0, 0, 0)';
    const w1 = '50%';
    const rgb2 = 'rgb(255, 255, 255)';
    const w2 = '50%';
    const rgb1_w1 = `${rgb1} ${w1}`;
    const rgb2_w2 = `${rgb2} ${w2}`;
    const expected = 'rgba(127.5, 127.5, 127.5, 1)';
    // const actual = colorMix('in srgb', rgb1_w1, rgb2_w2);
    const actual = `color-mix(in srgb, ${rgb1_w1}, ${rgb2_w2})`;

    assert.strictEqual(evaluate(actual), expected);
  });
});
