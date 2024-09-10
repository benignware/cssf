// getColorFn.test.mjs
import { expect } from "chai";
import { getColorFn } from "./getColorFn.mjs";
import { getEval, ENV_2022 } from "../eval/getEval.mjs";

import * as hslConversions from "./conversions/ref/hsl.mjs";
import * as hsvConversions from "./conversions/ref/hsv.mjs";
import * as rgbConversions from "./conversions/ref/rgb.mjs";
import * as xyzConversions from "./conversions/ref/xyz.mjs";

import * as hslCalcConversions from "./conversions/calc/hsl.mjs";
import * as hsvCalcConversions from "./conversions/calc/hsv.mjs";

import { describe as describeFn } from "../meta/describe.mjs";

describe('getColorFn', () => {
  beforeEach(() => {
    global.e = getEval({}, ENV_2022);
  });

  it('should create a color function with parseable signature', () => {
    const rgb = getColorFn('rgb', 'rgb');
    const info = describeFn(rgb);

    expect(info).to.be.deep.equal({
      name: 'rgb',
      params: [
        { name: 'r' },
        { name: 'g' },
        { name: 'b' }
      ]
    })
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

  it('should return an HSV color function based on hsl', () => {
    const hsl = getColorFn('hsl', 'hsl', {}, { units: ['deg', '%', '%'] });
    const hsv = getColorFn('hsv', 'hsv', { ...hsvConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ hsl, hsv }, ENV_2022);

    const input = e('hsv(from hsl(240deg 100% 50%) h s v)');
    expect(input).to.be.equal('hsv(240deg 100% 100%)');

    const input2 = e('hsl(from hsv(0deg 100% 100%) h s l)');
    expect(input2).to.be.equal('hsl(0deg 100% 50%)');
  });

  it('should return an HSV color function that converts to rgb', () => {
    const rgb = getColorFn('rgb', 'rgb');
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    const hsv = getColorFn('hsv', 'hsv', { ...hsvConversions }, { units: ['deg', '%', '%'] });
    
    const e = getEval({ rgb, hsl, hsv }, ENV_2022);

    const input = e('hsv(from rgb(255 0 0) h s v)');
    expect(input).to.be.equal('hsv(0deg 100% 100%)');

    const input2 = e('rgb(from hsv(240deg 100% 100%) r g b)');
    expect(input2).to.be.equal('rgb(0 0 255)');
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
    const nonStandardColor = getColorFn('nonStandardColor', 'rgb', {}, { identifiers: ['c1', 'c2', 'c3'] });

    const e = getEval({ nonStandardColor });

    const input = e('nonStandardColor(from rgb(255 0 0) c1 c2 c3)');
    expect(input).to.be.equal('nonStandardColor(255 0 0)');
  });

  xit('should handle empty or missing parameters gracefully', () => {
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

    const input = e('hsl(from rgb(255 0 255) calc(h * 0.5) calc(s * 0.5) calc(l * 0.5))');
    
    expect(input).to.be.equal('hsl(150deg 50% 25%)');
  });

  it('should handle calc-based adjustments in nested HSL function', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslCalcConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ hsl });

    const c1 = 'rgb(255 0 255)';
    // const c1 =  'hsl(300deg 100% 50%)';
    const c2 = `hsl(
      from ${c1}
      calc(h * 0.5)
      calc(s * 0.5)
      calc(l * 0.5)
    )`;
    const c3 = `hsl(from ${c2} calc(h * 2) calc(s * 2) calc(l * 2))`;
    const input = e(c3);
    
    expect(input).to.be.equal('hsl(300deg 100% 50%)');
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
    const hsl = getColorFn('hsl', 'hsl', { ...hslCalcConversions }, { units: ['deg', '%', '%'] });

    const e = getEval({ hsl, rgb });

    const input = e('hsl(from rgb(255 0 255) calc(var(--x) * 0.5) var(--y) var(--z))', {
      '--x': '90deg',
      '--y': '100%',
      '--z': '50%'
    });

    expect(input).to.be.closeToUnit('hsl(45deg 100% 50%)');
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
    const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, {
      units: ['deg', '%', '%']
    });
    const rgb = getColorFn('rgb', 'rgb');

    const e = getEval({
      hsv,
      // hsl,
      rgb
    });

    // const input = e('hsv(from rgb(255 0 0) h s v)');
    const input = e('hsv(from hsl(0deg 100% 50%) h s v)');

    expect(input).to.be.closeToUnit('hsl(0deg 100% 50%)');
  });

  it('should accept a conversion space by input option', () => {
    const hsx = getColorFn('hsx', 'hsx', {
      hslToHsx: (h, s, l) => {
        const x = `calc(${s} * 0 + ${l} / clamp(0, calc(2 * 0.5), 2))`;
  
        return [h, s, x];
      },
      hsxToHsl: (h, s, x) => {
        const l = `calc(${x} * clamp(0, calc(2 * 0.5), 2))`;
  
        return [h, s, l];
      }
    }, {
      identifiers: ['h', 's', 'x'],
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

    const input = hsx('from rgb(255 0 255) h s x');
    
    const e = getEval();

    const evaluated = e(input);

    expect(evaluated).to.be.equal('hsl(300deg 100% 50%)');
  });

  xit('should emulate hsv conversion space by input option', () => {
    const hsv = getColorFn('hsv', 'hsv', hsvCalcConversions, {
      identifiers: ['h', 's', 'v'],
      input: {
        colorSpace: 'hsl',
        funcName: 'hsl',
        identifiers: ['h', 's', 'l'],
        units: ['deg', '%', '%']
      },
      output: {
        colorSpace: 'hsl',
        units: ['deg', '%', '%']
      },
      units: ['deg', '%', '%']
    });

    const input = hsv('from rgb(255 0 255) h s v');

    console.log('RESULT', input);
    
    const e = getEval();

    const evaluated = e(input);

    expect(evaluated).to.be.equal('hsl(300deg 100% 50%)');
  });

  it('resolves complex relative color', () => {
    const hsl = getColorFn('hsl', 'hsl', { ...hslCalcConversions }, { units: ['deg', '%', '%'] });

    const input = `hsl(
      from hsl(
        from rgb(255 0 255)
        h
        0%
        calc(s * var(--sx) + l * var(--lx))
      )
      calc(h * var(--hx))
      s
      l
    )`;

    const e = getEval({ hsl });

    const result = e(input, {
      '--sx': 0.5,
      '--lx': 0.5,
      '--hx': 0.5
    });

    expect(result).to.be.equal('hsl(150deg 0% 75%)');
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
    // const result = hsv('from rgb(var(--r) var(--g) var(--b)) h s v');
    const result = hsv('from rgb(255 0 255) h s v');

    // console.log();
    // console.log();
    // console.log('LOCAL RESULT');
    // console.log(result);

    // console.log();
    // console.log();

    // return;
    
    // const evaluated = e22(result);
    // // Intermediate generated color: hsl(from rgb(255 0 0) calc(h + ...) calc(s + ...) calc(l + ...))
    // console.log('********* evaluated', evaluated);
     

    // Target environment knows about color functions
    const e23 = getEval({
      rgb,
      hsl,
      // hsv,
    });

    const evaluated2 = e23(result, {
      '--r': 255,
      '--g': 0,
      '--b': 0
    }, {
      // evalResult: true
    });

    console.log();
    console.log();
    console.log('TARGET RESULT');
    console.log(evaluated2);

    expect(result).to.be.equal('hsl(0deg 100% 50%)');
  });
});
