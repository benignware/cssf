import { expect } from 'chai';
import render from './render.mjs';
import { getEval } from '../eval/getEval.mjs';

const e = getEval();

describe('render', () => {
  it('transpiles expression', () => {
    expect(e(render('calc(ifelse(1, 123, 456))'))).to.equal(123);
  });

  xit('transpiles stylesheet', () => {
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
            var(--primary-r),
            var(--primary-g),
            var(--primary-b)
          ),
          0.75
        );
      }
    `);

    expect(css).to.equal(
      ':root{--primary-r:255;--primary-g:0;--primary-b:255}body{background:rgba(calc(((var(--primary-h) - 0) * (1 - 0.75)) + 0), calc(((var(--primary-s) - 0) * (1 - 0.75)) + 0), calc(((var(--primary-l) - 0) * (1 - 0.75)) + 0), calc(((1 - 1) * (1 - 0.75)) + 1))}'
    );
  });
});