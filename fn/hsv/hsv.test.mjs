// test/hsv.test.js
import { expect } from 'chai';
import { runInBrowser } from '../../setup/runInBrowser.mjs';
import { hsv } from './hsv.mjs';
import { getRender } from '../../utils/render/getRender.mjs';
import { getEval, ENV_2022 } from '../../utils/eval/getEval.mjs';

const e = getEval();

const render = getRender({ hsv });

describe('hsv', () => {
  it('should convert hsv to hsl', () => {
    const result = e(hsv('240deg 100% 100%'));
    expect(result).to.equal('hsl(240deg 100% 50%)');
  });

  xit('should run in browser', async () => {
    const color = render(hsv('240deg 100% 100%'));

    const htmlContent = `
      <style>${render(`
        .example {
          color: ${color};
        }
      `)}</style>
      <div class="example"></div>
    `;

    const computedColor = await runInBrowser(htmlContent, () =>
      window.getComputedStyle(document.querySelector('.example')).color);

    expect(computedColor).to.equal('rgb(0, 0, 255)');
  }, 30000);

  xit('should convert rgb to hsv and output hsl', () => {
    const input = hsv('from rgb(255 0 255) h s v');
    const result = e(input);
    expect(result).to.equal('hsv(240deg 100% 100%)');
  });

  xit('should convert hsl to hsv and back to hsl', () => {
    const result = e(hsv('from hsl(240deg 100% 50%)'));
    expect(result).to.equal('hsl(240deg 100% 50%)');
  });
});
