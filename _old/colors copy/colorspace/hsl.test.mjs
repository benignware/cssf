import { expect } from 'chai';
import { hslToRgb, rgbToHsl } from './hsl.mjs'; // Adjust the path as needed

describe('HSL to RGB Conversion', () => {
  it('should convert HSL (0, 0, 0.5) to RGB (128, 128, 128)', () => {
    expect(hslToRgb(0, 0, 0.5)).to.be.deepCloseTo([128, 128, 128], 1);
  });

  it('should convert HSL (0, 1, 0.5) to RGB (255, 0, 0)', () => {
    expect(hslToRgb(0, 1, 0.5)).to.be.deepCloseTo([255, 0, 0], 1);
  });

  it('should convert HSL (120, 1, 0.5) to RGB (0, 255, 0)', () => {
    expect(hslToRgb(120, 1, 0.5)).to.be.deepCloseTo([0, 255, 0], 1);
  });

  it('should convert HSL (240, 1, 0.5) to RGB (0, 0, 255)', () => {
    expect(hslToRgb(240, 1, 0.5)).to.be.deepCloseTo([0, 0, 255], 1);
  });

  it('should convert HSL (180, 1, 0.5) to RGB (0, 255, 255)', () => {
    expect(hslToRgb(180, 1, 0.5)).to.be.deepCloseTo([0, 255, 255], 1);
  });
});


describe('RGB to HSL Conversion', () => {
  it('should convert RGB (128, 128, 128) to HSL (0, 0, 0.5)', () => {
    expect(rgbToHsl(128, 128, 128)).to.be.deepCloseTo([0, 0, 0.5], 0.01);
  });

  it('should convert RGB (255, 0, 0) to HSL (0, 1, 0.5)', () => {
    expect(rgbToHsl(255, 0, 0)).to.be.deepCloseTo([0, 1, 0.5], 0.01);
  });

  it('should convert RGB (0, 255, 0) to HSL (120, 1, 0.5)', () => {
    expect(rgbToHsl(0, 255, 0)).to.be.deepCloseTo([120, 1, 0.5], 0.01);
  });

  it('should convert RGB (0, 0, 255) to HSL (240, 1, 0.5)', () => {
    expect(rgbToHsl(0, 0, 255)).to.be.deepCloseTo([240, 1, 0.5], 0.01);
  });

  it('should convert RGB (0, 255, 255) to HSL (180, 1, 0.5)', () => {
    expect(rgbToHsl(0, 255, 255)).to.be.deepCloseTo([180, 1, 0.5], 0.01);
  });
});
