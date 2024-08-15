import { expect } from 'chai';
import { colorMix } from './colorMix.mjs';
import { getEval, ENV_2022, ENV_2023 } from '../../utils/eval/getEval.mjs';

const e = getEval({ colorMix }, ENV_2022);

describe('colorMix', () => {
  it('mixes rgb colors', () => {
    const rgb1 = 'rgb(0, 0, 0)';
    const rgb2 = 'rgb(255, 255, 255)';
    const expected = 'rgb(127.5, 127.5, 127.5)';
    const actual = colorMix('in rgb', rgb1, rgb2);

    expect(e(actual)).to.equal(expected);
  });
  // it('mixes hsl colors', () => {
  //   const hsl1 = 'hsl(60, 25%, 75%)';
  //   const hsl2 = 'hsl(300, 75%, 25%)';
  //   const expected = 'hsl(180, 50%, 50%)';
  //   const actual = colorMix('in srgb', hsl1, hsl2);

  //   expect(e(actual)).to.equal(expected);
  // });

  // it('mixes rgb colors', () => {
  //   const rgb1 = 'rgb(0, 0, 0)';
  //   const w1 = '50%';
  //   const rgb2 = 'rgb(255, 255, 255)';
  //   const w2 = '50%';
  //   const rgb1_w1 = `${rgb1} ${w1}`;
  //   const rgb2_w2 = `${rgb2} ${w2}`;
  //   const expected = 'rgba(127.5, 127.5, 127.5, 1)';
  //   const actual = colorMix('in srgb', rgb1_w1, rgb2_w2);

  //   assert.strictEqual(evaluate(actual), expected);
  // });

  // it('mixes dynamic rgb colors', () => {
  //   const c1 = 'rgba(0, 0, 0, 1)';
  //   const w1 =  0.5;
  //   const c2 = 'rgba(255, 255, 255, 1)';
  //   const w2 = 0.5;
  //   const cw = [[c1, w1], [c2, w2]];
    
  //   const vars = cw.reduce((acc, [color, weight], i) => {
  //     const j = i + 1;
  //     const [r, g, b] = chroma(color).rgb();
  //     return { ...acc, [`--color-${j}-r`]: r, [`--color-${j}-g`]: g, [`--color-${j}-b`]: b, [`--weight-${j}`]: weight };
  //   }, {});

  //   const [a1, a2] = cw.reduce((acc, [color, weight], i) => {
  //     const j = i + 1;
  //     return [...acc, `rgba(var(--color-${j}-r), var(--color-${j}-g), var(--color-${j}-b)) var(--weight-${j})`];
  //   }, []);

  //   const expected = 'rgba(127.5, 127.5, 127.5, 1)';
  //   const actual = evaluate(colorMix('in srgb', a1, a2), vars);

  //   assert.strictEqual(actual, expected);
  // });
  

  // it('mixes rgb colors with dynamic weight', () => {
  //   const rgb1 = 'rgba(0, 0, 0, 1) var(--weight)';
  //   const rgb2 = 'rgba(255, 255, 255, 1)';
  //   const expected = 'rgba(127.5, 127.5, 127.5, 1)';
  //   const actual = evaluate(colorMix('in srgb', rgb1, rgb2), {
  //     '--weight': 0.5,
  //   });

  //   assert.strictEqual(actual, expected);
  // });

  // it('evaluates arguments when parsed from string', () => {
  //   const rgb1 = 'rgb(0, 0, 0)';
  //   const w1 = '50%';
  //   const rgb2 = 'rgb(255, 255, 255)';
  //   const w2 = '50%';
  //   const rgb1_w1 = `${rgb1} ${w1}`;
  //   const rgb2_w2 = `${rgb2} ${w2}`;
  //   const expected = 'rgba(127.5, 127.5, 127.5, 1)';
  //   // const actual = colorMix('in srgb', rgb1_w1, rgb2_w2);
  //   const actual = `color-mix(in srgb, ${rgb1_w1}, ${rgb2_w2})`;

  //   assert.strictEqual(evaluate(actual), expected);
  // });
});
