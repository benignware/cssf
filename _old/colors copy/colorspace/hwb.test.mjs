import { expect } from 'chai';
import { hwbToRgb, rgbToHwb } from './hwb.mjs'; // Adjust the path as needed

describe('HWB to RGB Conversion', () => {
  it('should convert HWB (0, 0, 0) to RGB (255, 0, 0)', () => {
    expect(hwbToRgb(0, 0, 0)).to.be.deepCloseTo([255, 0, 0], 1);
  });

  it('should convert HWB (120, 0, 0) to RGB (0, 255, 0)', () => {
    expect(hwbToRgb(120, 0, 0)).to.be.deepCloseTo([0, 255, 0], 1);
  });

  it('should convert HWB (240, 0, 0) to RGB (0, 0, 255)', () => {
    expect(hwbToRgb(240, 0, 0)).to.be.deepCloseTo([0, 0, 255], 1);
  });

  it('should convert HWB (0, 0.5, 0.5) to RGB (128, 128, 128)', () => {
    expect(hwbToRgb(0, 0.5, 0.5)).to.be.deepCloseTo([128, 128, 128], 1);
  });

  it('should convert HWB (180, 0.25, 0.25) to RGB (64, 191, 191)', () => {
    expect(hwbToRgb(180, 0.25, 0.25)).to.be.deepCloseTo([64, 191, 191], 1);
  });
});

describe('RGB to HWB Conversion', () => {
  it('should convert RGB (255, 0, 0) to HWB (0, 0, 0)', () => {
    expect(rgbToHwb(255, 0, 0)).to.be.deepCloseTo([0, 0, 0], 0.01);
  });

  it('should convert RGB (0, 255, 0) to HWB (120, 0, 0)', () => {
    expect(rgbToHwb(0, 255, 0)).to.be.deepCloseTo([120, 0, 0], 0.01);
  });

  it('should convert RGB (0, 0, 255) to HWB (240, 0, 0)', () => {
    expect(rgbToHwb(0, 0, 255)).to.be.deepCloseTo([240, 0, 0], 0.01);
  });

  it('should convert RGB (128, 128, 128) to HWB (0, 0.5, 0.5)', () => {
    expect(rgbToHwb(128, 128, 128)).to.be.deepCloseTo([0, 0.5, 0.5], 0.01);
  });

  it('should convert RGB (64, 191, 191) to HWB (180, 0.25, 0.25)', () => {
    expect(rgbToHwb(64, 191, 191)).to.be.deepCloseTo([180, 0.25, 0.25], 0.01);
  });
});
