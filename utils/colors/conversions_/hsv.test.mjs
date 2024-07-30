import { expect } from 'chai';
import { hsvToHsl, hslToHsv } from './hsv.mjs';

describe('Color Conversion Functions', () => {
  describe('HSV to HSL', () => {
    it('should convert HSV to HSL (Red)', () => {
      expect(hsvToHsl(0, 1, 1)).to.deepCloseTo([0, 1, 0.5]);
    });

    it('should convert HSV to HSL (Green)', () => {
      expect(hsvToHsl(120 / 360, 1, 1)).to.deepCloseTo([120 / 360, 1, 0.5]);
    });

    it('should convert HSV to HSL (Blue)', () => {
      expect(hsvToHsl(240 / 360, 1, 1)).to.deepCloseTo([240 / 360, 1, 0.5]);
    });

    it('should convert HSV to HSL (White)', () => {
      expect(hsvToHsl(0, 0, 1)).to.deepCloseTo([0, 0, 1]);
    });

    it ('should convert HSV to HSL (Black)', () => {
      expect(hsvToHsl(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  describe('HSL to HSV', () => {
    it('should convert HSL to HSV (Red)', () => {
      expect(hslToHsv(0, 1, 0.5)).to.deepCloseTo([0, 1, 1]);
    });

    it('should convert HSL to HSV (Green)', () => {
      expect(hslToHsv(120 / 360, 1, 0.5)).to.deepCloseTo([120 / 360, 1, 1]);
    });

    it('should convert HSL to HSV (Blue)', () => {
      expect(hslToHsv(240 / 360, 1, 0.5)).to.deepCloseTo([240 / 360, 1, 1]);
    });

    it('should convert HSL to HSV (White)', () => {
      expect(hslToHsv(0, 0, 1)).to.deepCloseTo([0, 0, 1]);
    });

    it ('should convert HSL to HSV (Black)', () => {
      expect(hslToHsv(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });
});
