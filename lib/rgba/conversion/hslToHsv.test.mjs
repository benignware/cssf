import { strict as assert } from 'assert';
import { hslToHsv } from './hslToHsv.mjs';
import { toPrecision } from '../../utils.mjs';

describe('hslToHsv', () => {
  describe('Conversion of HSL to HSV with example values', () => {
    it('should convert HSL (0, 0, 0.5) to HSV (0, 0, 0.5)', () => {
      const result = hslToHsv(0, 0, 0.5);
      assert.deepStrictEqual(result, { h: 0, s: 0, v: 0.5 });
    });

    it('should convert HSL (0.5, 0.7, 0.3) to HSV (0.5, 0.823529, 0.51)', () => {
      const result = hslToHsv(0.5, 0.7, 0.3);
      assert.deepStrictEqual(toPrecision(result, 6), { h: 0.5, s: 0.823529, v: 0.51 });
    });
  });

  describe('Handling specific cases', () => {
    it('should handle HSL with no saturation (0.2, 0, 0.5)', () => {
      const result = hslToHsv(0.2, 0, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0.2, s: 0, v: 0.5 });
    });

    it('should handle HSL with full saturation and lightness (0.75, 1, 0.5)', () => {
      const result = hslToHsv(0.75, 1, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0.75, s: 1, v: 1 });
    });

    it('should handle HSL with no lightness (0.1, 0.5, 0)', () => {
      const result = hslToHsv(0.1, 0.5, 0);
      assert.deepStrictEqual(toPrecision(result), { h: 0.1, s: 0, v: 0 });
    });

    it('should handle HSL with full saturation and lightness (0.5, 1, 1)', () => {
      const result = hslToHsv(0.5, 1, 1);
      assert.deepStrictEqual(toPrecision(result), { h: 0.5, s: 0, v: 1 });
    });
  });

  describe('Handling edge cases', () => {
    it('should handle edge case with hue wrap-around (1.1, 0.5, 0.5)', () => {
      const result = hslToHsv(1.1, 0.5, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0.1, s: 0.67, v: 0.75 });
    });

    it('should handle edge case with hue normalization (-0.5, 0.5, 0.5)', () => {
      const result = hslToHsv(-0.5, 0.5, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0.5, s: 0.67, v: 0.75 });
    });
  });
});
