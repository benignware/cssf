import { expect } from "chai";
import { getColorFn } from "../utils/colors/getColorFn.mjs";
import { getEval } from "../utils/eval/getEval.mjs";
import * as hslConversions from "../utils/colors/conversions/ref/hsl.mjs";
import * as rgbConversions from "../utils/colors/conversions/ref/rgb.mjs";
import * as xyzConversions from "../utils/colors/conversions/ref/xyz.mjs";

describe('getColorFn', () => {
  beforeEach(() => {
    global.e = getEval();
  });

  it('should return a color function', () => {
    const color = getColorFn('color', ['srgb', 'xyz'], {
      ...rgbConversions,
      ...xyzConversions
    });

    const e = getEval({
      color
    });

    const input = e('color(from srgb(255 0 0) xyz)');

    expect(input).to.be.equal('color(0.64 0.33 0.03)');
  });

  // it('should return a color function', () => {
  //   const rgb = getColorFn('rgb', 'rgb'); 
  //   const hsl = getColorFn('hsl', 'hsl', { ...hslConversions }, { units: ['deg', '%', '%'] });
    
  //   const e = getEval({
  //     rgb,
  //     hsl
  //   });
    
  //   const input = e('hsl(from rgb(255 0 0) h s l)');

  //   expect(input).to.be.equal('hsl(0deg 100% 50%)');
  // });




  // it('should return a color function with specified name', () => {
  //   const colorFn = colorFn('rgb', 'rgb');
  //   expect(colorFn.name).to.equal('rgb');
  // });

  // it('should return a color function with implicitly specified components and predefined colorspace', () => {
  //   const rgb = getColorFn('rgb', {
  //     colorspace: 'srgb'
  //   });
  //   expect(rgb('255 0 0')).to.equal('rgb(255 0 0)');
  // });

  // it('should convert color from hex to rgb', () => {
  //   const rgb = getColorFn('rgb', {
  //     colorspace: 'srgb'
  //   });
  //   expect(rgb('from #ff0000')).to.equal('rgb(255 0 0)');
  // });

  // it('should convert color from hex to hsl', () => {
  //   const hsl = getColorFn('hsl', 'hsl');
  //   expect(hsl('from #ff0000')).to.equal('hsl(255 0 0)');
  // });

  // it('should convert color from hex to rgb with identity values', () => {
  //   const rgb = getColorFn('rgb', {
  //     colorspace: 'srgb'
  //   });
  //   expect(rgb('from #ff0000 r g b')).to.equal('rgb(255 0 0)');
  // });

  // it('should convert color from hex to rgb with computed values', () => {
  //   const rgb = getColorFn('rgb', {
  //     colorspace: 'srgb'
  //   });
  //   expect(evaluate(rgb('from #ff00ff calc(r - 200) calc(g + 55) calc(b - 200)'))).to.equal('rgb(55 55 55)');
  // });

  // it('should convert color from hex to rgb with dynamic values', () => {
  //   const rgb = getColorFn('rgb', {
  //     colorspace: 'srgb'
  //   });
  //   expect(
  //     evaluate(
  //       rgb('from #ff00ff calc(r + var(--rd)) calc(g + var(--gd)) calc(b + var(--bd))'),
  //       {
  //         '--rd': -200,
  //         '--gd': 55,
  //         '--bd': -200,
  //       }
  //     )
  //   ).to.equal('rgb(55 55 55)');
  // });

  // before(() => {
  //   global.e = getEval({
  //     rgb: getColorFn('rgb', {
  //       colorspace: 'srgb'
  //     }),
  //     hsl: getColorFn('hsl', {
  //       colorspace: 'srgb/hsl'
  //     }),
  //   });
  // });

  // it('should convert color from hsl to rgb with identity values', () => {
  //   expect(e('rgb(from hsl(180, 50%, 50%) r g b)')).to.equal('rgb(255 0 0)');
  // });
});