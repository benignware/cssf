// test/RenderTag.test.js

import { expect } from 'chai';
import { getRenderTag } from './getRenderTag.mjs';
import { getEval } from '../eval/getEval.mjs';

describe('RenderTag', function() {
  beforeEach(() => {
    global.e = getEval();
  });

  it('should add functions to the environment', function() {
    const cssf = getRenderTag();

    const fn = function() {
      return 'fn';
    }
    
    cssf.use(fn);

    expect(cssf.has('fn')).to.be.true;
  });

  it('should add object with functions to the environment', function() {
    const cssf = getRenderTag();

    const fn = function() {
      return 'fn';
    }
    
    cssf.use({ fn });

    expect(cssf.has('fn')).to.be.true;
  });

  it('should clear the environment', function() {
    const cssf = getRenderTag();

    const fn = function() {
      return 'fn';
    }
    
    cssf.use(fn);
    cssf.clear();

    expect(cssf.has('fn')).to.be.false;
  });

  it('should render css with default env', function() {
    const cssf = getRenderTag();

    const input = cssf`
      .example {
        color: hsv(0, 100%, 100%);
      }
    `;

    const expectedOutput = `
      .example {
        color: hsl(0deg 100% 50%);
      }
    `;

    expect(e(input)).to.be.cssEquivalent(expectedOutput);
  });
});
