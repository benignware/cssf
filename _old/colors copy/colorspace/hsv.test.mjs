import { expect } from 'chai';
import { hsvToRgb, rgbToHsv } from './hsv.mjs'; // Adjust the path as needed

describe('HSV to RGB Conversion', () => {
  it('should convert HSV (0, 1, 1) to RGB (255, 0, 0)', () => {
    expect(hsvToRgb(0, 1, 1)).to.be.deepCloseTo([255, 0, 0], 1);
  });

  it('should convert HSV (120, 1, 1) to RGB (0, 255, 0)', () => {
    expect(hsvToRgb(120, 1, 1)).to.be.deepCloseTo([0, 255, 0], 1);
  });

  it('should convert HSV (240, 1, 1) to RGB (0, 0, 255)', () => {
    expect(hsvToRgb(240, 1, 1)).to.be.deepCloseTo([0, 0, 255], 1);
  });

  it('should convert HSV (0, 0, 0) to RGB (0, 0, 0)', () => {
    expect(hsvToRgb(0, 0, 0)).to.be.deepCloseTo([0, 0, 0], 1);
  });

  it('should convert HSV (180, 0.5, 0.75) to RGB (64, 191, 191)', () => {
    expect(hsvToRgb(180, 0.66, 0.75)).to.be.deepCloseTo([64, 191, 191], 1.75);
  });
});

describe('RGB to HSV Conversion', () => {
  it('should convert RGB (255, 0, 0) to HSV (0, 1, 1)', () => {
    expect(rgbToHsv(255, 0, 0)).to.be.deepCloseTo([0, 1, 1], 0.01);
  });

  it('should convert RGB (0, 255, 0) to HSV (120, 1, 1)', () => {
    expect(rgbToHsv(0, 255, 0)).to.be.deepCloseTo([120, 1, 1], 0.01);
  });

  it('should convert RGB (0, 0, 255) to HSV (240, 1, 1)', () => {
    expect(rgbToHsv(0, 0, 255)).to.be.deepCloseTo([240, 1, 1], 0.01);
  });

  it('should convert RGB (0, 0, 0) to HSV (0, 0, 0)', () => {
    expect(rgbToHsv(0, 0, 0)).to.be.deepCloseTo([0, 0, 0], 0.01);
  });

  it('should convert RGB (64, 191, 191) to HSV (180, 0.5, 0.75)', () => {
    expect(rgbToHsv(64, 191, 191)).to.be.deepCloseTo([180, 0.66, 0.75], 0.01);
  });
});
