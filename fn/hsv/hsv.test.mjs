// test/hsv.test.js
import { expect } from 'chai';
import { runInBrowser } from '../../setup/runInBrowser.mjs';
import { hsv } from './hsv.mjs';
import { getRender } from '../../utils/render/getRender.mjs';
import { getEval, ENV_2022 } from '../../utils/eval/getEval.mjs';

const e = getEval();

const render = getRender();

describe('hsv', () => {
  it('should convert hsv to hsl', () => {
    const result = e(hsv('240deg 100% 100%'));
    expect(result).to.equal('hsl(240deg 100% 50%)');
  });

  return;

  xit('should convert hsl to hsv and back to hsl', () => {
    const result = e(hsv('from hsl(240deg 100% 50%)'));
    expect(result).to.equal('hsl(240deg 100% 50%)');
  });

  it('should run in browser', async () => {
    const htmlContent = `
      <style>${render(`
        .example {
          color: ${render(hsv('240deg 100% 100%'))};
        }
      `)}</style>
      <div class="example"></div>
    `;

    const computedWidth = await runInBrowser(htmlContent, () =>
      window.getComputedStyle(document.querySelector('.example')).color);

    expect(computedWidth).to.equal('rgb(0, 0, 255)');
  }, 30000);
});
