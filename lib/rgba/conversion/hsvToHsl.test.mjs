// hslToHsv.test.mjs
import { strict as assert } from 'assert';
import { hslToHsv } from './hslToHsv.mjs';

// Helper function to ensure precision
function toPrecision(value, precision = 5) {
  return {
    h: Number(value.h.toFixed(precision)),
    s: Number(value.s.toFixed(precision)),
    v: Number(value.v.toFixed(precision)),
  };
}

describe('hslToHsv', () => {
  describe('Conversion of HSL to HSV with example values', () => {
    it('should convert HSL (0, 0, 0.5) to HSV (0, 0, 0.5)', () => {
      const result = hslToHsv(0, 0, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0, s: 0, v: 0.5 });
    });

    it('should convert HSL (0.5, 0.5, 0.5) to HSV (0.5, 1, 1)', () => {
      const result = hslToHsv(0.5, 0.5, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0.5, s: 1, v: 1 });
    });

    it('should convert HSL (0.25, 0.5, 0.5) to HSV (0.25, 1, 0.75)', () => {
      const result = hslToHsv(0.25, 0.5, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0.25, s: 1, v: 0.75 });
    });

    it('should convert HSL (0.75, 0.5, 0.5) to HSV (0.75, 1, 0.75)', () => {
      const result = hslToHsv(0.75, 0.5, 0.5);
      assert.deepStrictEqual(toPrecision(result), { h: 0.75, s: 1, v: 0.75 });
    });

    it('should handle edge cases correctly', () => {
      const result1 = hslToHsv(0, 1, 1);
      assert.deepStrictEqual(toPrecision(result1), { h: 0, s: 1, v: 1 });

      const result2 = hslToHsv(0, 0, 0);
      assert.deepStrictEqual(toPrecision(result2), { h: 0, s: 0, v: 0 });
    });
  });
});
