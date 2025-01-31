import { expect } from 'chai';
import { getEval, ENV_NEXT } from "../../../eval/getEval.mjs";
import { hslToRgb, rgbToHsl } from './hsl.mjs';

describe('HSL Calc Conversions', () => {
  beforeEach(() => {
    global.e = getEval(ENV_NEXT);
  });

  it('should convert hsl to rgb for color red', () => {
    expect(hslToRgb(0, 1, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([255, 0, 0], 0.5);
  });

  it('should convert rgb to hsl for color red', () => {
    expect(rgbToHsl(255, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 1, 0.5], 0.01);
  });

  it('should convert hsl to rgb for color blue', () => {
    expect(hslToRgb(240, 1, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 255], 0.5);
  });

  it('should convert rgb to hsl for color blue', () => {
    expect(rgbToHsl(0, 0, 255).map(c => e(`calc(${c})`))).to.deepCloseTo([240, 1, 0.5], 0.01);
  });

  it('should convert hsl to rgb for color green', () => {
    expect(hslToRgb(120, 1, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 255, 0], 0.5);
  });

  it('should convert rgb to hsl for color green', () => {
    expect(rgbToHsl(0, 255, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([120, 1, 0.5], 0.01);
  });

  xit('should convert hsl to rgb for color black', () => {
    expect(hslToRgb(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.5);
  });

  xit('should convert rgb to hsl for color black', () => {
    expect(rgbToHsl(0, 0, 0).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0], 0.01);
  });

  xit('should convert hsl to rgb for color white', () => {
    expect(hslToRgb(0, 0, 1).map(c => e(`calc(${c})`))).to.deepCloseTo([255, 255, 255], 0.5);
  });

  xit('should convert rgb to hsl for color white', () => {
    expect(rgbToHsl(255, 255, 255).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 1], 0.01);
  });

  it('should convert hsl to rgb for color gray', () => {
    expect(hslToRgb(0, 0, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([128, 128, 128], 0.5);
  });

  xit('should convert rgb to hsl for color gray', () => {
    expect(rgbToHsl(128, 128, 128).map(c => e(`calc(${c})`))).to.deepCloseTo([0, 0, 0.5], 0.01);
  });
});
