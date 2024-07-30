import { expect } from 'chai';
import { oklabToXyz, xyzToOklab, rgbToOklab } from './oklab.mjs';

xdescribe('Color Conversion Functions', () => {
  describe('OKLAB to XYZ', () => {
    it('should convert OKLAB to XYZ (Red)', () => {
      expect(oklabToXyz(0.532, 0.214, 0.119)).to.deepCloseTo([0.4124564, 0.2126729, 0.0193339]);
    });

    it('should convert OKLAB to XYZ (Green)', () => {
      expect(oklabToXyz(0.916, -0.895, 0.117)).to.deepCloseTo([0.3575761, 0.7151522, 0.1191920]);
    });

    it('should convert OKLAB to XYZ (Blue)', () => {
      expect(oklabToXyz(0.290, 0.060, -0.973)).to.deepCloseTo([0.1804375, 0.0721750, 0.9503041]);
    });

    it('should convert OKLAB to XYZ (White)', () => {
      expect(oklabToXyz(0.865, 0.080, 0.317)).to.deepCloseTo([0.4124564 + 0.3575761 + 0.1804375, 0.2126729 + 0.7151522 + 0.0721750, 0.0193339 + 0.1191920 + 0.9503041]);
    });

    it ('should convert OKLAB to XYZ (Black)', () => {
      expect(oklabToXyz(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  xdescribe('XYZ to OKLAB', () => {
    it('should convert XYZ to OKLAB (Red)', () => {
      expect(xyzToOklab(0.4124564, 0.2126729, 0.0193339)).to.deepCloseTo([0.532, 0.214, 0.119]);
    });

    it('should convert XYZ to OKLAB (Green)', () => {
      expect(xyzToOklab(0.3575761, 0.7151522, 0.1191920)).to.deepCloseTo([0.916, -0.895, 0.117]);
    });

    it('should convert XYZ to OKLAB (Blue)', () => {
      expect(xyzToOklab(0.1804375, 0.0721750, 0.9503041)).to.deepCloseTo([0.290, 0.060, -0.973]);
    });

    it('should convert XYZ to OKLAB (White)', () => {
      expect(xyzToOklab(0.4124564 + 0.3575761 + 0.1804375, 0.2126729 + 0.7151522 + 0.0721750, 0.0193339 + 0.1191920 + 0.9503041)).to.deepCloseTo([0.865, 0.080, 0.317]);
    });

    it ('should convert XYZ to OKLAB (Black)', () => {
      expect(xyzToOklab(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });

  xdescribe('RGB to OKLAB', () => {
    it('should convert RGB to OKLAB (Red)', () => {
      expect(rgbToOklab(1, 0, 0)).to.deepCloseTo([0.532, 0.214, 0.119]);
    });

    it('should convert RGB to OKLAB (Green)', () => {
      expect(rgbToOklab(0, 1, 0)).to.deepCloseTo([0.916, -0.895, 0.117]);
    });

    it('should convert RGB to OKLAB (Blue)', () => {
      expect(rgbToOklab(0, 0, 1)).to.deepCloseTo([0.290, 0.060, -0.973]);
    });

    it('should convert RGB to OKLAB (White)', () => {
      expect(rgbToOklab(1, 1, 1)).to.deepCloseTo([0.865, 0.080, 0.317]);
    });

    it ('should convert RGB to OKLAB (Black)', () => {
      expect(rgbToOklab(0, 0, 0)).to.deepCloseTo([0, 0, 0]);
    });
  });
});