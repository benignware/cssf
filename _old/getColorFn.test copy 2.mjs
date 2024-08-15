import { expect } from "chai";
import { getColorFn } from "../utils/colors/getColorFn.mjs";
import { getEval } from "../utils/eval/getEval.mjs";
import * as hslConversions from "../utils/colors/conversions/ref/hsl.mjs";
import * as hslCalcConversions from "../utils/colors/conversions/calc/hsl.mjs";
import * as rgbConversions from "../utils/colors/conversions/ref/rgb.mjs";
import * as xyzConversions from "../utils/colors/conversions/ref/xyz.mjs";

import { eq } from '../fn/eq/eq.mjs';
import { ifelse } from '../fn/ifelse/ifelse.mjs';
import { or } from '../fn/or/or.mjs';
import { ENV_2022 } from "../utils/env/Env.mjs";
import { unit } from "../utils/calc/number.mjs";

// Define custom HSV conversions for testing
const hsvConversions = {
  hsvToHsl: (h, s, v) => {
    const l = (2 - s) * v / 2;
    const sHsl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

    return [h, sHsl, l];
  },

  hslToHsv: (h, s, l) => {
    const v = l + s * (1 - Math.abs(2 * l - 1)) / 2;
    const sHsv = v === 0 ? 0 : 2 * (1 - l / v);

    return [h, sHsv, v];
  }
  // hsvToRgb: (h, s, v) => {
  //   // Example HSV to RGB conversion implementation
  //   h = h / 360; // Normalize hue to [0, 1]

  //   let r, g, b;
  //   const i = Math.floor(h * 6);
  //   const f = h * 6 - i;
  //   const p = v * (1 - s);
  //   const q = v * (1 - f * s);
  //   const t = v * (1 - (1 - f) * s);
    
  //   switch (i % 6) {
  //     case 0: [r, g, b] = [v, t, p]; break;
  //     case 1: [r, g, b] = [q, v, p]; break;
  //     case 2: [r, g, b] = [p, v, t]; break;
  //     case 3: [r, g, b] = [p, q, v]; break;
  //     case 4: [r, g, b] = [t, p, v]; break;
  //     case 5: [r, g, b] = [v, p, q]; break;
  //   }

  //   return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  // },
  // rgbToHsv: (r, g, b) => {
  //   r = r / 255;
  //   g = g / 255;
  //   b = b / 255;

  //   const max = Math.max(r, g, b);
  //   const min = Math.min(r, g, b);
  //   const delta = max - min;

  //   let h = 0;
  //   let s = max === 0 ? 0 : delta / max;
  //   let v = max;

  //   if (delta !== 0) {
  //     if (max === r) {
  //       h = (g - b) / delta;
  //     } else if (max === g) {
  //       h = (b - r) / delta + 2;
  //     } else {
  //       h = (r - g) / delta + 4;
  //     }

  //     h *= 60;
  //     if (h < 0) h += 360;
  //   }

  //   return [h, s, v];
  // }
};

const hsvCalcConversions = {
  hsvToHsl: (h, s, v) => {
    const l = `(${v} - ${s} * ${v} / 2)`;
    const si = `(${v} - ${l}) / min(${l}, 1 - l)`;
    const c = or(eq(l, 0), eq(l, 1));

    const sl = ifelse(c, 0, si);
  
    return [ h, sl, l ];
  },
  hslToHsv: (h, s, l) => {
    const v = `(${l} + ${s} * ${l})`;
    const si = `(${v} - ${l}) / ${v}`;
    const c = or(eq(v, 0), eq(v, 1));

    const sv = ifelse(c, 0, si);

    return [ h, sv, v ];
  }
}

describe('getColorFn', () => {
  beforeEach(() => {
    global.e = getEval(ENV_2022);
  });

  it('should format output by colorspace and callback function', () => {
    const hsv = getColorFn('hsv', 'hsv', { ...hsvCalcConversions }, {
      output: {
        colorSpace: 'hsl',
        format: ([h, s, l]) => `hsl(${h} ${s} ${l})`,
        units: ['deg', '%', '%']
      },
      units: ['deg', '%', '%']
    });
    const hsl = getColorFn('hsl', 'hsl', { ...hslCalcConversions }, {
      units: ['deg', '%', '%']
    });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsv, hsl, rgb });

    const input = e('hsv(from rgb(255 0 0) h s v)');
    expect(input).to.be.equal('hsl(0deg 100% 50%)');
  });

  xit('should accept a conversion space by input option', () => {
    const hsv = getColorFn('hsv', 'hsv', { ...hsvCalcConversions }, {
      input: [{
        colorSpace: 'hsl',
        identifiers: ['h', 's', 'l']
      }],
      output: {
        colorSpace: 'hsl',
        format: ([h, s, l]) => `hsl(${h} ${s} ${l})`,
        units: ['deg', '%', '%']
      },
      units: ['deg', '%', '%']
    });

    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsv, rgb });

    const input = e('hsv(from rgb(255 0 0) h s v)');
    expect(input).to.be.equal('hsl(0deg 100% 50%)');
  });

  return;

  it('should return a color function', () => {
    const rgb = getColorFn('rgb', 'rgb'); 
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    
    const e = getEval({ rgb, hsl });
    
    const input = e('hsl(from rgb(255 0 0) h s l)');

    expect(input).to.be.equal('hsl(0deg 100% 50%)');
  });



  it('should return a multispace color function', () => {
    const color = getColorFn('color', ['srgb', 'xyz'], {
      ...rgbConversions,
      ...xyzConversions
    });

    const e = getEval({
      color
    });

    const input = e('color(from color(srgb 1 0 0) xyz x y z)');

    expect(input).to.be.equal('color(xyz 0.4124564 0.2126729 0.0193339)');
  });

  it('should return an HSL color function', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(0 0 255) h s l)');
    expect(input).to.be.equal('hsl(240deg 100% 50%)');

    const input2 = e('rgb(from hsl(240deg 100% 50%) r g b)');
    expect(input2).to.be.equal('rgb(0 0 255)');
  });


  it('should return an HSV color function', () => {
    const hsv = getColorFn('hsv', 'hsv', { ...hsvConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsv, rgb });

    const input = e('hsv(from rgb(255 0 0) h s v)');
    expect(input).to.be.equal('hsv(0deg 100% 100%)');

    const input2 = e('rgb(from hsv(240deg 100% 100%) r g b)');
    expect(input2).to.be.equal('rgb(0 0 255)');
  });

  it('should correctly apply a calc-based conversion', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslCalcConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(0 0 255) h s l)');
    expect(input).to.be.equal('hsl(240deg 100% 50%)');

    const input2 = e('rgb(from hsl(240deg 100% 50%) r g b)');
    expect(input2).to.be.equal('rgb(0 0 255)');
  });
  
  it('should handle invalid color spaces gracefully', () => {
    const invalidColor = getColorFn('invalidColor', 'invalidSpace');

    const e = getEval({ invalidColor });

    const input = e('invalidColor(from rgb(255 255 255) r g b)');
    expect(input).to.be.equal('invalidColor(from rgb(255 255 255) r g b)');
  });

  it('should handle unknown input color-function gracefully', () => {
    const rgb = getColorFn('myColorFunction', 'rgb');
    
    const e = getEval({ rgb });

    const input = e('myColorFunction(from unknownFunction(255 0 0) key1 key2 key3)');
    expect(input).to.be.equal('myColorFunction(from unknownFunction(255 0 0) key1 key2 key3)');
  });

  it('should handle edge case color values', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsl, rgb });

    // Test minimum values
    const input1 = e('hsl(from rgb(0 0 0) h s l)');
    expect(input1).to.be.equal('hsl(0deg 0% 0%)');

    // Test maximum values
    const input2 = e('hsl(from rgb(255 255 255) h s l)');
    expect(input2).to.be.equal('hsl(0deg 0% 100%)');
  });

  it('should handle percentage and unit edge cases correctly', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ hsl });

    // Test percentage values
    const input1 = e('hsl(from rgb(255 0 0) h s l)');
    expect(input1).to.be.equal('hsl(0deg 100% 50%)');

    // Test degrees and turns
    const input2 = e('hsl(from rgb(0 255 0) h s l)');
    expect(input2).to.be.equal('hsl(120deg 100% 50%)');
    
    const input3 = e('hsl(from rgb(0 0 255) h s l)');
    expect(input3).to.be.equal('hsl(240deg 100% 50%)');
  });

  it('should handle non-standard color identifiers', () => {
    const nonStandardColor = getColorFn('nonStandardColor', 'rgb', {}, { identifiers: ['key1', 'key2', 'key3'] });

    const e = getEval({ nonStandardColor });

    const input = e('nonStandardColor(from rgb(255 0 0) key1 key2 key3)');
    expect(input).to.be.equal('nonStandardColor(255 0 0)');
  });

  it('should handle empty or missing parameters gracefully', () => {
    const emptyParamsColor = getColorFn('emptyParamsColor', 'rgb');

    const e = getEval({ emptyParamsColor });

    // Test with missing parameters
    const input1 = e('emptyParamsColor(from rgb(255 255 255))');
    expect(input1).to.be.equal('emptyParamsColor(255 255 255)');
    
    // Test with no parameters
    const input2 = e('emptyParamsColor()');
    expect(input2).to.be.equal('emptyParamsColor()');
  });

  it('should handle calc-based adjustments in HSL function', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(255 0 255) calc(h * 0.5) calc(s * 0.25) calc(l * 0.25))');
    
    expect(input).to.be.equal('hsl(150deg 25% 12.5%)');
  });

  it('should handle calc-based adjustments in RGB function', () => {
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ rgb, hsl });

    const input = e('rgb(from hsl(180deg 100% 50%) calc(r * 0.5) calc(g * 0.5) calc(b * 0.5)');

    expect(input).to.be.equal('rgb(0 127.5 127.5)');
  });

  it('should handle computed adjustments with dynamic variables in RGB function', () => {
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ rgb, hsl });

    const input = e('rgb(from hsl(180deg 100% 50%) calc(var(--r) * var(--x)) calc(var(--r) * var(--x)) calc(var(--r) * var(--x)))', {
      '--r': 255,
      '--x': 0.5
    });

    expect(input).to.be.equal('rgb(127.5 127.5 127.5)');
  });

  it('should handle computed adjustments with dynamic variables in relative hsl color', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(255 0 255) calc(var(--x) * pi / 2) calc(var(--y) * 0.5) calc(var(--z) * 0.5))', {
      '--x': 0.5,
      '--y': 1,
      '--z': 0.5
    });

    expect(input).to.be.closeToUnit('hsl(45deg 50% 25%)');
  });

  it('should handle nested `calc` expressions with dynamic variables in RGB function', () => {
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ rgb, hsl });

    const input = e('rgb(from hsl(calc(var(--h) + 60deg) calc(var(--s) * 100%) calc(var(--l) * 50%)) calc(var(--r) * 0.5) calc(var(--g) * 0.5) calc(var(--b) * 0.5))', {
      '--h': 180,
      '--s': 0.75,
      '--l': 0.5,
      '--r': 255,
      '--g': 128,
      '--b': 64
    });

    expect(input).to.be.equal('rgb(127.5 64 32)');
  });

  it('should handle dynamic variables alone in HSL function', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });

    const e = getEval({ hsl, rgb });

    const input = e('hsl(var(--h) var(--s) var(--l))', {
      '--h': '240deg',
      '--s': '50%',
      '--l': '75%'
    });

    expect(input).to.be.equal('hsl(240deg 50% 75%)');
  });

  it('should handle dynamic variables with computed adjustments in HSL function', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });

    const e = getEval({ hsl, rgb });

    const input = e('hsl(calc(var(--h) * 0.5) calc(var(--s) * 0.5) calc(var(--l) * 0.5))', {
      '--h': '240deg',
      '--s': '50%',
      '--l': '100%'
    });

    expect(input).to.be.equal('hsl(120deg 25% 50%)');
  });

  it('should handle computed adjustments and dynamic variables in RGB function with mixed operations', () => {
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ rgb, hsl });

    const input = e('rgb(from hsl(calc(var(--h) + 30deg) calc(var(--s) * 0.5) calc(var(--l) * 0.5)) calc(var(--r) * 0.5) calc(var(--g) * 0.5) calc(var(--b) * 0.5))', {
      '--h': 180,
      '--s': 1,
      '--l': 0.5,
      '--r': 255,
      '--g': 255,
      '--b': 0
    });

    expect(input).to.be.equal('rgb(127.5 127.5 0)');
  });

  xit('should handle computed components with CSS variables in HSL function and include identifiers', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb', { ...rgbConversions });

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(calc(var(--r) * 0.5) calc(var(--g) * 0.5) calc(var(--b) * 0.5)) calc(var(--h) * 1) calc(var(--s) * 1) calc(var(--l) * 0.5))', {
      '--r': 255,
      '--g': 0,
      '--b': 255,
      '--h': 240,
      '--s': 0.5,
      '--l': 0.5
    });

    expect(input).to.be.equal('hsl(240deg 50% 25%)');
  });




  
});
