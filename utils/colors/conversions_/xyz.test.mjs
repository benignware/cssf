import { expect } from 'chai';
import { xyzToRgb, rgbToXyz, xyzToLms, lmsToXyz } from './xyz.mjs';
import { normalizeXYZ } from './normalize.mjs';

describe('Color Conversion Functions', () => {
  describe('XYZ to RGB', () => {
    it('should convert XYZ to RGB (Red)', () => {
      expect(xyzToRgb(...normalizeXYZ(41.246, 21.267, 1.933))).to.deepCloseTo([1, 0, 0]);
    });

    it('should convert XYZ to RGB (Green)', () => {
      const xyz = normalizeXYZ(0.3575761, 0.7151522, 0.1191920);
      expect(xyzToRgb(...xyz)).to.deepCloseTo([0, 1, 0]);
    });

    it('should convert XYZ to RGB (Blue)', () => {
      const xyz = normalizeXYZ(0.1804375, 0.0721750, 0.9503041);
      expect(xyzToRgb(...xyz)).to.deepCloseTo([0, 0, 1]);
    });

    it('should convert XYZ to RGB (White)', () => {
      const xyz = normalizeXYZ(0.4124564 + 0.3575761 + 0.1804375, 0.2126729 + 0.7151522 + 0.0721750, 0.0193339 + 0.1191920 + 0.9503041);
      expect(xyzToRgb(...xyz)).to.deepCloseTo([1, 1, 1]);
    });

    it ('should convert XYZ to RGB (Black)', () => {
      expect(xyzToRgb(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  describe('RGB to XYZ', () => {
    it('should convert RGB to XYZ (Red)', () => {
      const xyz = normalizeXYZ(0.4124564, 0.2126729, 0.0193339);
      expect(rgbToXyz(1, 0, 0)).to.deepCloseTo(xyz);
    });

    it('should convert RGB to XYZ (Green)', () => {
      const xyz = normalizeXYZ(0.3575761, 0.7151522, 0.1191920);
      expect(rgbToXyz(0, 1, 0)).to.deepCloseTo(xyz);
    });

    it('should convert RGB to XYZ (Blue)', () => {
      const xyz = normalizeXYZ(0.1804375, 0.0721750, 0.9503041);
      expect(rgbToXyz(0, 0, 1)).to.deepCloseTo(xyz);
    });

    it('should convert RGB to XYZ (White)', () => {
      const xyz = normalizeXYZ(0.4124564 + 0.3575761 + 0.1804375, 0.2126729 + 0.7151522 + 0.0721750, 0.0193339 + 0.1191920 + 0.9503041);
      expect(rgbToXyz(1, 1, 1)).to.deepCloseTo(xyz);
    });

    it ('should convert RGB to XYZ (Black)', () => {
      expect(rgbToXyz(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  return;

  describe('XYZ to LMS', () => {
    it('should convert XYZ to LMS (Red)', () => {
      expect(xyzToLms(0.4124564, 0.2126729, 0.0193339)).to.deepCloseTo([0.38971, -0.22981, 0]);
    });

    it('should convert XYZ to LMS (Green)', () => {
      expect(xyzToLms(0.3575761, 0.7151522, 0.1191920)).to.deepCloseTo([0.68898, 1.18340, 0]);
    });

    it('should convert XYZ to LMS (Blue)', () => {
      expect(xyzToLms(0.1804375, 0.0721750, 0.9503041)).to.deepCloseTo([-0.07868, 0.04641, 1]);
    });

    it('should convert XYZ to LMS (White)', () => {
      expect(xyzToLms(0.4124564 + 0.3575761 + 0.1804375, 0.2126729 + 0.7151522 + 0.0721750, 0.0193339 + 0.1191920 + 0.9503041)).to.deepCloseTo([0.38971 + 0.68898 - 0.07868, -0.22981 + 1.18340 + 0.04641, 0 + 0 + 1]);
    });

    it ('should convert XYZ to LMS (Black)', () => {
      expect(xyzToLms(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  describe('LMS to XYZ', () => {
    it('should convert LMS to XYZ (Red)', () => {
      const xyz = normalizeXYZ(0.4124564, 0.2126729, 0.0193339);
      expect(lmsToXyz(0.38971, -0.22981, 0)).to.deepCloseTo(xyz);
    });

    it('should convert LMS to XYZ (Green)', () => {
      const xyz = normalizeXYZ(0.3575761, 0.7151522, 0.1191920);
      expect(lmsToXyz(0.68898, 1.18340, 0)).to.deepCloseTo(xyz);
    });

    it('should convert LMS to XYZ (Blue)', () => {
      const xyz = normalizeXYZ(0.1804375, 0.0721750, 0.9503041);
      expect(lmsToXyz(-0.07868, 0.04641, 1)).to.deepCloseTo(xyz);
    });

    it('should convert LMS to XYZ (White)', () => {
      const xyz = normalizeXYZ(0.4124564 + 0.3575761 + 0.1804375, 0.2126729 + 0.7151522 + 0.0721750, 0.0193339 + 0.1191920 + 0.9503041);
      expect(lmsToXyz(0.38971 + 0.68898 - 0.07868, -0.22981 + 1.18340 + 0.04641, 0 + 0 + 1)).to.deepCloseTo(xyz);
    });

    it ('should convert LMS to XYZ (Black)', () => {
      expect(lmsToXyz(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });
});
