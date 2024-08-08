import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { getRender } from '../../utils/render/getRender.mjs';
import { runInBrowser } from '../../setup/runInBrowser.mjs';

import abs from './abs.mjs';

const e = getEval({ abs });
const render = getRender({ abs });

describe('abs', () => {
  it('returns positive value of a negative number', () => {
    expect(e('calc(abs(-342))')).to.equal(342);
  });

  it('returns positive value of a positive number', () => {
    expect(e('calc(abs(342))')).to.equal(342);
  });

  it('returns positive value of a negative dimension', () => {
    expect(e(`calc(abs('-342px'))`)).to.equal('342px');
  });

  it('returns positive value of a positive dimension', () => {
    expect(e(`calc(abs('342px'))`)).to.equal('342px');
  });

  it('should run in browser', async () => {
    const htmlContent = `
      <style>${render(`
        .example {
          width: calc(${render(abs('-342px'))});
        }
      `)}</style>
      <div class="example"></div>
    `;

    const computedWidth = await runInBrowser(htmlContent, () =>
      window.getComputedStyle(document.querySelector('.example')).width);

    expect(computedWidth).to.equal('342px');
  }, 30000);
});
