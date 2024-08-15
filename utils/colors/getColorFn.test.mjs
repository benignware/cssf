// getColorFn.test.mjs
import { expect } from "chai";
import { getColorFn } from "./getColorFn.mjs";
import { getEval, ENV_2022 } from "../eval/getEval.mjs";
import * as hslConversions from "./conversions/ref/hsl.mjs";
import * as hslCalcConversions from "./conversions/calc/hsl.mjs";
import * as rgbConversions from "./conversions/ref/rgb.mjs";
import * as xyzConversions from "./conversions/ref/xyz.mjs";

import { eq } from '../../fn/eq/eq.mjs';
import { abs } from '../../fn/abs/abs.mjs';
import { ifelse } from '../../fn/ifelse/ifelse.mjs';
import { or } from '../../fn/or/or.mjs';

// Define custom HSV conversions for testing
const hsvConversions = {
  hsvToHsl: (h, s, v) => {
    // console.log('!!!!!! HSV TO HSL', h, s, v);
    
    const l = (2 - s) * v / 2;
    const sHsl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

    return [h, sHsl, l];
  },

  hslToHsv: (h, s, l) => {
    // console.log('!!!!!! HSL TO HSV', h, s, l);
    const v = l + s * (1 - Math.abs(2 * l - 1)) / 2;
    const sHsv = v === 0 ? 0 : 2 * (1 - l / v);

    return [h, sHsv, v];
  }
};

const hsvCalcConversions = {
  hsvToHsl: (h, s, v) => {
    // console.log('!!!!!! CALC HSV TO HSL', h, s, v);
    const l = `(2 - ${s}) * ${v} / 2`;
    const sl = `(${v} - ${l}) / min(${l}, 1 - ${l})`;
    const c1 = eq(l, 0);
    const c2 = eq(l, 1);
    const c = or(c1, c2);
    const sHsl = ifelse(c, 0, sl);

    return [h, sHsl, l];
  },

  hslToHsv: (h, s, l) => {
    // console.log('!!!!!! CALC HSL TO HSV', h, s, l);
    const delta = `(1 - max(2 * (${l}) - 1, 0))`;
    const v = `(${l} + ${s} * ${delta} / 2) * 1`; // For some reason, we need to multiply by 1 to get the correct value
    const c = eq(v, 0);
    const ss = `2 * (1 - ${l} / ${v})`;
    const sve = ifelse(c, 0, ss);

    return [h, sve, v];
  }
};

describe('getColorFn', () => {
  beforeEach(() => {
    global.e = getEval({}, ENV_2022);
  });

  it('should resolve a color from hex', () => {
    const rgb = getColorFn('rgb', 'rgb');

    expect(e(rgb('from #ff00ff r g b'))).to.be.equal('rgb(255 0 255)');
  });

  it('should resolve a color from keyword', () => {
    const rgb = getColorFn('rgb', 'rgb');

    expect(e(rgb('from blue r g b'))).to.be.equal('rgb(0 0 255)');
  });

  it('should return a hsl color from hex', () => {
    const rgb = getColorFn('rgb', 'rgb'); 
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    
    const e = getEval({ rgb, hsl });
    
    const input = e('hsl(from #ff0000 h s l)');

    expect(input).to.be.equal('hsl(0deg 100% 50%)');
  });

  it('should return a color function with legacy format', () => {
    const rgb = getColorFn('rgb', 'rgb', {}, { legacyFormat: true });
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'], legacyFormat: true });
  
    const e = getEval({ rgb, hsl }, ENV_2022);
  
    const input = e('hsl(from rgb(255 0 0) h,s,l)');
    expect(input).to.be.equal('hsl(0deg, 100%, 50%)');
  
    const input2 = e('rgb(from hsl(0deg 100% 50%) r,g,b)');
    expect(input2).to.be.equal('rgb(255, 0, 0)');
  });

  it('should return an HSL color function based on calc conversions', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslCalcConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsl, rgb });

    const input1 = e('hsl(from hsl(240deg 100% 50%) h s l)');
    expect(input1).to.be.equal('hsl(240deg 100% 50%)');

    const input2 = e('hsl(from rgb(0 0 255) h s l)');
    expect(input2).to.be.equal('hsl(240deg 100% 50%)');

    const input3 = e('rgb(from hsl(240deg 100% 50%) r g b)');
    expect(input3).to.be.equal('rgb(0 0 255)');
  });

  it('should return an HSV color function', () => {
    const rgb = getColorFn('rgb', 'rgb');
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const hsv = getColorFn('hsv', 'hsv', { ...hsvConversions }, { units: ['deg', '%', '%'] });
    
    const e = getEval({ rgb, hsl, hsv }, ENV_2022);

    const input = e('hsv(from rgb(255 0 0) h s v)');
    expect(input).to.be.equal('hsv(0deg 100% 100%)');

    const input2 = e('rgb(from hsv(240deg 100% 100%) r g b)');
    expect(input2).to.be.equal('rgb(0 0 255)');
  });

  it('should return an HSV color function that converts to hsl', () => {
    const hsl = getColorFn('hsl', 'hsl', {}, { units: ['deg', '%', '%'] });
    const hsv = getColorFn('hsv', 'hsv', { ...hsvConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ hsl, hsv }, ENV_2022);

    const input = e('hsv(from hsl(240deg 100% 50%) h s v)');
    expect(input).to.be.equal('hsv(240deg 100% 100%)');

    const input2 = e('hsl(from hsv(0deg 100% 100%) h s l)');
    expect(input2).to.be.equal('hsl(0deg 100% 50%)');
  });

  it('should return an HSV color function that converts to hsl based on calc conversions', () => {
    const hsl = getColorFn('hsl', 'hsl', {}, { units: ['deg', '%', '%'] });
    const hsv = getColorFn('hsv', 'hsv', { ...hsvCalcConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ hsl, hsv }, ENV_2022);

    const input = e('hsv(from hsl(240deg 100% 50%) h s v)');
    expect(input).to.be.equal('hsv(240deg 100% 100%)');

    const input2 = e('hsl(from hsv(0deg 100% 100%) h s l)');
    expect(input2).to.be.equal('hsl(0deg 100% 50%)');
  });

  it('should return a multispace color function', () => {
    const color = getColorFn('color', ['srgb', 'xyz'], {
      ...rgbConversions,
      ...xyzConversions
    });

    const e = getEval({
      color
    }, ENV_2022);

    const input = e('color(from color(srgb 1 0 0) xyz x y z)');

    expect(input).to.be.equal('color(xyz 0.4124564 0.2126729 0.0193339)');
  });

  it('should return a multispace color function with custom identifiers', () => {
    const color = getColorFn('color', ['xyz', 'xyz-d65', 'xyz-d50'], {
      ...xyzConversions
    }, {
      identifiers: {
        'xyz': 'xyz',
        'xyz-d65': 'xyz',
        'xyz-d50': 'xyz'
      }
    });

    const e = getEval({
      color
    }, ENV_2022);

    const input = e('color(from color(xyz-d50 0.436066,0.222488,0.013916) xyz x y z)');

    expect(input).to.be.closeToUnit('color(xyz 0.4124564 0.2126729 0.0193339)');
  });

  it('should convert from single to multispace', () => {
    const rgb = getColorFn('rgb', 'rgb');
    const color = getColorFn('color', ['xyz'], {
      ...xyzConversions
    });

    const e = getEval({
      rgb,
      color
    }, ENV_2022);

    const input = e('color(from rgb(255, 0, 0) xyz x y z)');

    expect(input).to.be.equal('color(xyz 0.4124564 0.2126729 0.0193339)');
  });

  it('should return an HSL color function', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsl, rgb }, ENV_2022);

    const input = e('hsl(from rgb(0 0 255) h s l)');
    expect(input).to.be.equal('hsl(240deg 100% 50%)');

    const input2 = e('rgb(from hsl(240deg 100% 50%) r g b)');
    expect(input2).to.be.equal('rgb(0 0 255)');
  });

  it('should return an HSL color function based on calc conversions', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslCalcConversions }, { units: ['deg', '%', '%'] });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(0 0 255) h s l)');
    expect(input).to.be.equal('hsl(240deg 100% 50%)');

    const input2 = e('rgb(from hsl(240deg 100% 50%) r g b)');
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

    const e = getEval({ invalidColor }, ENV_2022);

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
    const rgb = getColorFn('rgb', 'rgb', {});
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(255 0 255) calc(var(--x) / 180 * pi) calc(var(--y) * 0.5) calc(var(--z) * 0.5))', {
      '--x': 90,
      '--y': 1,
      '--z': 0.5
    });

    expect(input).to.be.closeToUnit('hsl(90deg 50% 25%)');
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
  
  it('should format output by options for absolute color', () => {
    const hsv = getColorFn('hsv', 'hsv', { ...hsvConversions }, {
      output: {
        colorSpace: 'hsl',
        format: ([h, s, l]) => `hsl(${h} ${s} ${l})`,
        units: ['deg', '%', '%']
      },
      units: ['deg', '%', '%']
    });
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, {
      units: ['deg', '%', '%']
    });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({
      hsv,
      // hsl,
      // rgb
    }, ENV_2022);

    const input = e('hsv(0deg 100% 100%)');
    expect(input).to.be.equal('hsl(0deg 100% 50%)');
  });

  it('should format output by options for relative color', () => {
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

    expect(input).to.be.closeToUnit('hsl(0deg 100% 50%)');
  });

  // Test for the new requirement:
  xit('should accept a conversion space by input option', () => {
    const hsv = getColorFn('hsv', 'hsv', { ...hsvCalcConversions }, {
      input: {
        colorSpace: 'hsl',
        funcName: 'hsl',
        identifiers: ['h', 's', 'l'],
        units: ['deg', '%', '%']
      },
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

    // Source environment knows nothing about color functions, but assumes the target environment does
    const e22 = getEval({
      // rgb,
      // hsl,
      hsv,
    }, ENV_2022);

    // const input = e22('hsv(from rgb(var(--r) var(--g) var(--b)) h s v)');
    const input = e22('hsv(from rgb(var(--r) var(--g) var(--b)) h s v)', {}, {
      evalResult: false
    });
    // Intermediate generated color: hsl(from rgb(255 0 0) calc(h + ...) calc(s + ...) calc(l + ...))
    console.log('********* INPUT', input);

    // Target environment knows about color functions
    const e23 = getEval({
      rgb,
      hsl,
      // hsv,
    });

    const result = e23(input, {
      '--r': 255,
      '--g': 0,
      '--b': 0
    }, {
      evalResult: true
    });

    console.log('********* RESULT', result);

    expect(result).to.be.equal('hsl(0deg 100% 50%)');
  });
});
