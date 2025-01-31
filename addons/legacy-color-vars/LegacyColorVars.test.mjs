import { expect } from 'chai';
import { cssf, evaluate } from "../../index.mjs";
import { scssf, getSassTag } from "../../peer/index.mjs";
import { LegacyColorVars } from "./LegacyColorVars.mjs";
import { getEval } from "../../utils/eval/getEval.mjs";

describe("Plugin: LegacyColorVars", () => {
  let plugin;

  before(() => {
    plugin = new LegacyColorVars();
    cssf.use(plugin);
  });

  // it('applies LegacyColorVars plugin to a function', function() {
  //   // const rgb = 'rgb(var(--primary-r), var(--primary-g), var(--primary-b))';
  //   const rgb = 'var(--primary)';
  //   const input = cssf.env.colorContrast(rgb, '#fff', '#000');

  //   console.log('input: ', input);
    
  //   const result = evaluate(input, {
  //     '--primary-r': 255,
  //     '--primary-g': 126,
  //     '--primary-b': 235,
  //     // '--primary-a': 1,
  //     // '--primary': 'rgb(255, 25, 235)',
  //   });
  //   const expected = 'rgb(0 0 0)';

  //   expect(result).cssEquivalent(expected);
  // });

  // it('applies LegacyColorVars plugin to render', function() {
  //   const input = cssf`
  //     .example {
  //       color: var(--primary);
  //     }
  //   `;
    
  //   const expected = `
  //     .example {
  //       color: rgba(var(--primary-r), var(--primary-g), var(--primary-b), var(--primary-a, 1));
  //     }`;

  //   expect(input).cssEquivalent(expected);
  // });

  describe('with sass', function() {
    let scssf;
    
    before(() => {
      scssf = getSassTag();

      scssf.use(new LegacyColorVars({
        transformOnRender: false,
        identifiers: [
          '--primary'
        ]
      }));
    });
    
    xit('applies basic transform in sass', function() {
      const input = scssf`
        .example {
          $color: var(--primary);
          color: $color;
        }
      `;
      
      const expected = `
        .example {
          color: rgba(var(--primary-r), var(--primary-g), var(--primary-b), var(--primary-a, 1));
        }`;

      expect(input).cssEquivalent(expected);
    });

    xit('applies advanced transform in sass', function() {
      const input = scssf`
        .btn {
          $bg: var(--primary);
          color: color-contrast($bg, #fff, #000);
        }
      `;

      const e = getEval();
      const result = e(input, {
        '--primary': 'rgb(255, 126, 235)',
        '--primary-r': 255,
        '--primary-g': 126,
        '--primary-b': 235,
      });
  
      const expected = `
        .btn {
          color: rgb(0 0 0);
        }`;

      expect(result).cssEquivalent(expected);
    });

    it('applies complex transform in sass', function() {
      const input = scssf`
        .btn-primary {
          $bg: var(--primary);
          $color: color-contrast($bg, #fff, #000);
          $hover-bg: color-mix(in srgb, $color 0.5, $bg);
          $hover-color: color-contrast($hover-bg, #fff, #000);
          --btn-bg: #{$bg};
          --btn-color: #{$color};
          --btn-hover-bg: #{$hover-bg};
          --btn-hover-color: #{$hover-color};
        }
      `;

      const e = getEval();
      const result = e(input, {
        // '--primary': 'rgb(255, 126, 235)',
        '--primary-r': 255,
        '--primary-g': 120,
        '--primary-b': 235,
        '--primary': 'rgb(var(--primary-r), var(--primary-g), var(--primary-b))',
      });
      
      const expected = `
        .btn-primary {
          --btn-bg: rgb(255, 120, 235);
          --btn-color: rgb(0 0 0);
          --btn-hover-bg: rgb(127.5, 60, 117.5);
          --btn-hover-color: rgb(255 255 255);
        }`;

      expect(result).cssEquivalent(expected);
    });
  });
});