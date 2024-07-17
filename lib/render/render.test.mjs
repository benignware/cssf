import assert from 'assert';
import render from './render.mjs';
import evaluate from '../eval/eval.mjs';

describe('render', () => {
  it('transpiles expression', () => {
    assert.strictEqual(evaluate(render('calc(ifelse(1, 123, 456))')), 123);
  });

  /*
  it('transpiles stylesheet', () => {
    const css = render(`
      :root {
        --primary-r: 255;
        --primary-g: 0;
        --primary-b: 255;
      }

      body {
        background: mix(
          #000000,
          rgba(
            var(--primary-h),
            var(--primary-s),
            var(--primary-l)
          ),
          0.75
        );
      }
    `);

    assert.strictEqual(
      css,
      ':root{--primary-r: 255;--primary-g: 0;--primary-b: 255}body{background:rgba(calc(((var(--primary-h) - 0) * (1 - 0.75)) + 0), calc(((var(--primary-s) - 0) * (1 - 0.75)) + 0), calc(((var(--primary-l) - 0) * (1 - 0.75)) + 0), calc(((1 - 1) * (1 - 0.75)) + 1))}'
    );
  });
  */
});

export {};
