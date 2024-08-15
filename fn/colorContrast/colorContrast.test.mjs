import { expect } from 'chai';
import { runInBrowser } from '../../setup/runInBrowser.mjs';
import { colorContrast } from './colorContrast.mjs';
import { getEval } from '../../utils/eval/getEval.mjs';
import { getRender } from '../../utils/render/getRender.mjs';

const e = getEval();

const render = getRender();

describe('colorContrast', () => {
  it('computes light contrast color', () => {
    const rgb = 'rgb(5, 5, 5)';
    const actual = colorContrast(rgb, '#fff', '#000');

    const expected = 'rgb(255 255 255)';

    expect(e(actual)).to.equal(expected);
  });

  xit('computes dark contrast color', () => {
    const rgb = 'rgb(250, 240, 240)';
    const actual = colorContrast(rgb, '#fff', '#000');

    const expected = 'rgb(0 0 0)';

    expect(e(actual)).to.equal(expected);
  });

  it('should compute dark contrast color in browser', async () => {
    const htmlContent = `
      <style>${render(`
        .example {
          color: ${render(colorContrast('rgb(250, 240, 240)'))};
        }
      `)}</style>
      <div class="example"></div>
    `;

    const computedWidth = await runInBrowser(htmlContent, () =>
      window.getComputedStyle(document.querySelector('.example')).color);

    expect(computedWidth).to.equal('color(srgb 0 0 0)');
  }, 30000);

  it('should compute light contrast color in browser', async () => {
    const htmlContent = `
      <style>${render(`
        .example {
          color: ${render(colorContrast('rgb(10 5 10)'))};
        }
      `)}</style>
      <div class="example"></div>
    `;

    const computedWidth = await runInBrowser(htmlContent, () =>
      window.getComputedStyle(document.querySelector('.example')).color);

    expect(computedWidth).to.equal('color(srgb 1 1 1)');
  }, 30000);

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
