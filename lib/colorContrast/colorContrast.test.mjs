import { strictEqual } from 'assert';
import colorContrast from './colorContrast.mjs';
import colorMix from '../colorMix/colorMix.mjs';
import evaluate from '../eval/eval.mjs';
import chroma from 'chroma-js';

describe('colorContrast', () => {
  // it('computes light contrast color', () => {
  //   const rgb = 'rgb(5, 5, 5)';
  //   const actual = colorContrast(rgb, '#fff', '#000');
  //   const expected = 'rgba(255, 255, 255, 1)';

  //   strictEqual(evaluate(actual), expected);
  // });

  // it('computes dark contrast color', () => {
  //   const rgb = 'rgba(191.25, 191.25, 191.25, 1)';
  //   const actual = colorContrast(rgb, '#fff', '#000');
  //   const expected = 'rgba(0, 0, 0, 1)';

  //   strictEqual(evaluate(actual), expected);
  // });

  // xit('computes light contrast color with given contrast colors', () => {
  //   const rgb = 'rgb(5, 5, 5)';
  //   const actual = colorContrast(
  //     rgb,
  //     'rgba(240, 240, 240, 1)',
  //     'rgba(10, 10, 10, 1)'
  //   );
  //   const expected = 'rgba(240, 240, 240, 1)';

  //   strictEqual(evaluate(actual), expected);
  // });
  
  // xit('computes dark contrast color with given contrast colors', () => {
  //   const rgb = 'rgb(250, 250, 250)';
  //   const actual = colorContrast(
  //     rgb,
  //     'rgba(240, 240, 240, 1)',
  //     'rgba(10, 10, 10, 1)'
  //   );
  //   const expected = 'rgba(10, 10, 10, 1)';

  //   strictEqual(evaluate(actual), expected);
  // });

  // it('computes light contrast color dynamically', () => {
  //   const rgb = 'rgb(5, 5, 5)';
  //   const color = chroma(rgb);
  //   const [r, g, b] = color.rgb();
  //   const actual = colorContrast(
  //     `rgba(var(--r), var(--g), var(--b), var(--a))`
  //   );
  //   const expected = 'rgba(255, 255, 255, 1)';

  //   strictEqual(
  //     evaluate(actual, {
  //       '--r': r,
  //       '--g': g,
  //       '--b': b,
  //     }),
  //     expected
  //   );
  // });

  // it('computes dark contrast color dynamically', () => {
  //   const rgb = 'rgb(250, 250, 250)';
  //   const color = chroma(rgb);
  //   const [r, g, b] = color.rgb();
  //   const actual = colorContrast(
  //     `rgba(var(--r), var(--g), var(--b), var(--a))`
  //   );
  //   const expected = 'rgba(0, 0, 0, 1)';

  //   strictEqual(
  //     evaluate(actual, {
  //       '--r': r,
  //       '--g': g,
  //       '--b': b,
  //     }),
  //     expected
  //   );
  // });

  // it('computes dark contrast color from mixed color when being evaluated as string', () => {
  //   const rgb1 = 'rgba(127.5, 127.5, 127.5, 1)';
  //   const w1 = '50%';
  //   const rgb2 = 'rgb(255, 255, 255)';
  //   const w2 = '50%';
  //   const rgb1_w1 = `${rgb1} ${w1}`;
  //   const rgb2_w2 = `${rgb2} ${w2}`;
  //   const mixed = `color-mix(in srgb, ${rgb1_w1}, ${rgb2_w2})`;
  //   const actual = `color-contrast(${mixed}, #fff, #000)`;

  //   const expected = 'rgba(0, 0, 0, 1)';

  //   strictEqual(evaluate(actual), expected);
  // })
});
