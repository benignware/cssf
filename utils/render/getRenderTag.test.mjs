// test/RenderTag.test.js

import { expect } from 'chai';
import { getRenderTag } from './getRenderTag.mjs';
import { getEval } from '../eval/getEval.mjs';
import { Plugin, PluginDef } from './Plugin.mjs';
import { colorVarTransformer } from './transformers/colorVarTransformer.mjs';
import { CSS } from '../ast/CSS.mjs';
// import { e } from '../eval/env/env2023.mjs';

describe('RenderTag', function() {
  let e;

  beforeEach(() => {
    e = getEval();
  });

  it('should add a function to the environment', function() {
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
        color: hsl(0deg, 100%, 50%);
      }
    `;

    expect(e(input)).to.be.cssEquivalent(expectedOutput);
  });

  it('should register a callback', function() {
    const cssf = getRenderTag();

    function fn() {
      return 'fn';
    }
    
    cssf.set('callback', (target, args) =>
      target.name === 'fn' ? 'cb' : target(...args));
  
    cssf.use(fn);
    
    expect(cssf.env.fn()).to.equal('cb');
  });

  it('registers a plugin', function() {
    const cssf = getRenderTag();

    const plugin = new class {
      _call(target, ...args) {
        return 'fn';
      }
    }
  
    cssf.use(plugin);
    
    expect(cssf.has(plugin)).to.be.true;
  });

  it('applies plugin that intercepts function calls', function() {
    const cssf = getRenderTag();

    const plugin = new class {
      _call(fn, ...args) {
        return this.__next(fn, ...args);
      }
    }
    
    const fn = function(a, b, c) {
      return `plugin: ${a * 2} ${b * 2} ${c * 2}`;
    }
    
    cssf.use(fn);

    cssf.use(plugin);

    const result = cssf.env.fn(1, 2, 3);
    
    expect(result).to.equal('plugin: 2 4 6');
  });

  it('applies plugin that manipulates arguments', function() {
    const cssf = getRenderTag();

    const plugin = new class {
      _call(fn, ...args) {
        args = args.map(a => {
          const css = CSS.stringify(a, {
            transformers: [colorVarTransformer()],
          });
          
          return css;
        });

        return this.__next(fn, ...args);
      }
    }
  
    cssf.use(plugin);

    const fn = function(...args) {
      return String(args);
    }
    
    cssf.use(fn);

    const result = cssf.env.fn('var(--primary, red)');
    expect(result).cssEquivalent('rgba(var(--primary-r, 255), var(--primary-g, 0), var(--primary-b, 0), var(--primary-a, 1))');
  });
});
