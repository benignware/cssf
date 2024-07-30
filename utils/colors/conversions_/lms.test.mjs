
import { assert, expect } from 'chai';
import { lmsToRgb, rgbToLms } from './lms.mjs';

xdescribe('Color Conversion Functions', () => {
  describe('RGB to LMS', () => {
    it('should convert RGB to LMS (Red)', () => {
      expect(rgbToLms(1, 0, 0)).to.deepCloseTo([0.31399022, 0.15537241, 0.01775239]);
    });

    it('should convert RGB to LMS (Green)', () => {
      expect(rgbToLms(0, 1, 0)).to.deepCloseTo([0.63951294, 0.75789446, 0.10944209]);
    });

    it('should convert RGB to LMS (Blue)', () => {
      expect(rgbToLms(0, 0, 1)).to.deepCloseTo([0.04649755, 0.08670142, 0.87256922]);
    });

    it('should convert RGB to LMS (White)', () => {
      expect(rgbToLms(1, 1, 1)).to.deepCloseTo([0.31399022 + 0.63951294 + 0.04649755, 0.15537241 + 0.75789446 + 0.08670142, 0.01775239 + 0.10944209 + 0.87256922]);
    });

    it ('should convert RGB to LMS (Black)', () => {
      expect(rgbToLms(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  xdescribe('LMS to RGB', () => {
    it('should convert LMS to RGB (Red)', () => {
      expect(lmsToRgb(0.31399022, 0.15537241, 0.01775239)).to.deepCloseTo([1, 0, 0]);
    });

    it('should convert LMS to RGB (Green)', () => {
      expect(lmsToRgb(0.63951294, 0.75789446, 0.10944209)).to.deepCloseTo([0, 1, 0]);
    });

    it('should convert LMS to RGB (Blue)', () => {
      expect(lmsToRgb(0.04649755, 0.08670142, 0.87256922)).to.deepCloseTo([0, 0, 1]);
    });

    it('should convert LMS to RGB (White)', () => {
      expect(lmsToRgb(0.31399022 + 0.63951294 + 0.04649755, 0.15537241 + 0.75789446 + 0.08670142, 0.01775239 + 0.10944209 + 0.87256922)).to.deepCloseTo([1, 1, 1]);
    });

    it ('should convert LMS to RGB (Black)', () => {
      expect(lmsToRgb(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });
});

