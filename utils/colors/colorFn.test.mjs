import { expect } from "chai";
import { colorFn } from "./colorFn.mjs";
import getEval from "../../lib/eval/getEval.mjs";

describe('getColorFn', () => {
  beforeEach(() => {
    global.evaluate = getEval();
  });

  it('should return a color function', () => {
    const colorFn = getColorFn('rgb');
    expect(colorFn).to.be.a('function');
  });

  it('should return a color function with specified name', () => {
    const colorFn = getColorFn('rgb');
    expect(colorFn.name).to.equal('rgb');
  });

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

  it('should convert color from hex to hsl', () => {
    const hsl = getColorFn('hsl', {
      colorspace: 'srgb/hsl'
    });
    expect(hsl('from #ff0000')).to.equal('hsl(255 0 0)');
  });

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