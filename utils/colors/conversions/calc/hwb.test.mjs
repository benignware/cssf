import { expect } from 'chai';
import { getEval, ENV_NEXT } from "../../../eval/getEval.mjs";
import { rgbToHwb, hwbToRgb, hslToHwb, hwbToHsl } from './hwb.mjs'; // Import the new functions

describe('HWB Conversions', () => {
  beforeEach(() => {
    global.e = getEval(ENV_NEXT);
  });

  // RGB to HWB tests
  // it('should convert rgb to hwb for color red', () => {
  //   expect(rgbToHwb(255, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.1);
  // });

  // it('should convert hwb to rgb for color red', () => {
  //   expect(hwbToRgb(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([255, 0, 0], 0.1);
  // });

  // it('should convert rgb to hwb for color blue', () => {
  //   expect(rgbToHwb(0, 0, 255).map(c => e(`calc(${c})`))).to.deepCloseTo([240, 0, 0], 0.1);
  // });

  // it('should convert hwb to rgb for color blue', () => {
  //   expect(hwbToRgb(240, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 255], 0.1);
  // });

  // it('should convert rgb to hwb for color green', () => {
  //   expect(rgbToHwb(0, 255, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([120, 0, 0], 0.1);
  // });

  // it('should convert hwb to rgb for color green', () => {
  //   expect(hwbToRgb(120, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 255, 0], 0.5);
  // });

  // it('should convert rgb to hwb for color black', () => {
  //   expect(rgbToHwb(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 1], 0.1);
  // });

  // it('should convert hwb to rgb for color black', () => {
  //   expect(hwbToRgb(0, 0, 1).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.1);
  // });

  // it('should convert rgb to hwb for color white', () => {
  //   expect(rgbToHwb(255, 255, 255).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.1);
  // });

  // it('should convert hwb to rgb for color white', () => {
  //   expect(hwbToRgb(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([255, 255, 255], 0.1);
  // });

  // it('should convert rgb to hwb for color gray', () => {
  //   expect(rgbToHwb(128, 128, 128).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0.5], 0.1);
  // });

  // it('should convert hwb to rgb for color gray', () => {
  //   expect(hwbToRgb(0, 0, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([128, 128, 128], 0.1);
  // });

  // HWB to HSL tests
  // it('should convert hwb to hsl for color red', () => {
  //   expect(hwbToHsl(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 1, 0.5], 0.1);
  // });

  // it('should convert hwb to hsl for color blue', () => {
  //   expect(hwbToHsl(240, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([240, 1, 0.5], 0.1);
  // });

  // it('should convert hwb to hsl for color green', () => {
  //   expect(hwbToHsl(120, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([120, 1, 0.5], 0.1);
  // });

  // it('should convert hwb to hsl for color black', () => {
  //   expect(hwbToHsl(0, 0, 1).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.1);
  // });

  // it('should convert hwb to hsl for color white', () => {
  //   expect(hwbToHsl(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 1], 0.1);
  // });

  // it('should convert hwb to hsl for color gray', () => {
  //   expect(hwbToHsl(0, 0, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0.5], 0.1);
  // });

  // HSL to HWB tests
});

describe('HSL to HWB Conversion', () => {
  beforeEach(() => {
    global.e = getEval();
  });

  it('should convert hsl to hwb for color red', () => {
    expect(hslToHwb(0, 1, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.1);
  });

  it('should convert hsl to hwb for color blue', () => {
    expect(hslToHwb(240, 1, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([240, 0, 0], 0.1);
  });

  it('should convert hsl to hwb for color green', () => {
    expect(hslToHwb(120, 1, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([120, 0, 0], 0.1);
  });

  it('should convert hsl to hwb for color black', () => {
    expect(hslToHwb(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 1], 0.1);
  });

  it('should convert hsl to hwb for color white', () => {
    expect(hslToHwb(0, 0, 1).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.1);
  });

  it('should convert hsl to hwb for color gray', () => {
    expect(hslToHwb(0, 0, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0.5], 0.1);
  });
});