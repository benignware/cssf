import { expect } from 'chai';
import { hslToRgb, rgbToHsl } from './rgbToHsl.mjs';

describe('Color Conversion Functions', () => {
  describe('HSL to RGB', () => {
    it('should convert HSL to RGB (Red)', () => {
      expect(hslToRgb(0, 1, 0.5)).to.deepCloseTo([1, 0, 0]);
    });

    it('should convert HSL to RGB (Green)', () => {
      expect(hslToRgb(120 / 360, 1, 0.5)).to.deepCloseTo([0, 1, 0]);
    });

    it('should convert HSL to RGB (Blue)', () => {
      expect(hslToRgb(240 / 360, 1, 0.5)).to.deepCloseTo([0, 0, 1]);
    });

    it('should convert HSL to RGB (White)', () => {
      expect(hslToRgb(0, 0, 1)).to.deepCloseTo([1, 1, 1]);
    });

    it ('should convert HSL to RGB (Black)', () => {
      expect(hslToRgb(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  describe('RGB to HSL', () => {
    it('should convert RGB to HSL (Red)', () => {
      expect(rgbToHsl(1, 0, 0)).to.deepCloseTo([0, 1, 0.5]);
    });

    it('should convert RGB to HSL (Green)', () => {
      expect(rgbToHsl(0, 1, 0)).to.deepCloseTo([120 / 360, 1, 0.5]);
    });

    it('should convert RGB to HSL (Blue)', () => {
      expect(rgbToHsl(0, 0, 1)).to.deepCloseTo([240 / 360, 1, 0.5]);
    });

    it('should convert RGB to HSL (White)', () => {
      expect(rgbToHsl(1, 1, 1)).to.deepCloseTo([0, 0, 1]);
    });

    it ('should convert RGB to HSL (Black)', () => {
      expect(rgbToHsl(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });
});
