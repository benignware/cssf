const assert = require('assert');
const render = require('./render');
const evaluate = require('../eval');

describe('render', () => {
  it('transpiles expression', () => {
    assert.strictEqual(evaluate(render('calc(ifelse(1, 123, 456))')), 123);
  });

  xit('transpiles stylesheet', () => {
    const css = render(`
      :root {
        --primary-h: 123;
        --primary-s: 24%;
        --primary-l: 100%;
      }

      body {
        background: hsla(
          var(--primary-h),
          var(--primary-s),
          var(--primary-l)
        );
      }
    `);

    console.log(css);
  });
});
