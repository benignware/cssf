// test/hwbToHsl.test.mjs

import { strict as assert } from 'assert';
import { hwbToHsl } from './hwbToHsl.mjs';
import { toPrecision } from '../../utils.mjs';

describe('hwbToHsl', () => {
  describe('Conversion of HWB to HSL with example values', () => {
    it('should convert HWB (0, 0, 0) to HSL (0, 1, 0.5)', () => {
      const result = hwbToHsl(0, 0, 0);
      const expected = { h: 0, s: 1, l: 0.5 };
      assert.deepStrictEqual(toPrecision(result, 6), toPrecision(expected, 6));
    });

    it('should convert HWB (0, 0.5, 0.5) to HSL (0, 0, 0.5)', () => {
      const result = hwbToHsl(0, 0.5, 0.5);
      const expected = { h: 0, s: 0, l: 0.5 };
      assert.deepStrictEqual(toPrecision(result, 6), toPrecision(expected, 6));
    });

    it('should convert HWB (0.5, 0, 0.5) to HSL (0.5, 0, 0.25)', () => {
      const result = hwbToHsl(0.5, 0, 0.5);
      const expected = { h: 0.5, s: 0, l: 0.25 };
      assert.deepStrictEqual(toPrecision(result, 6), toPrecision(expected, 6));
    });

    it('should convert HWB (0.5, 0.5, 0) to HSL (0.5, 1, 0.75)', () => {
      const result = hwbToHsl(0.5, 0.5, 0);
      const expected = { h: 0.5, s: 1, l: 0.75 };
      assert.deepStrictEqual(toPrecision(result, 6), toPrecision(expected, 6));
    });

    it('should throw an error when Whiteness + Blackness > 1', () => {
      assert.throws(() => hwbToHsl(0.5, 0.6, 0.6), /Whiteness and Blackness cannot sum to more than 1/);
    });
  });

  describe('Handling edge cases', () => {
    it('should handle edge case with hue wrap-around (1.1, 0.5, 0.5)', () => {
      const result = hwbToHsl(1.1 % 1, 0.5, 0.5); // Normalize hue
      const expected = { h: 0.1, s: 0, l: 0.5 };
      assert.deepStrictEqual(toPrecision(result, 6), toPrecision(expected, 6));
    });

    it('should handle edge case with hue normalization (-0.5, 0.5, 0.5)', () => {
      const result = hwbToHsl((0.5 % 1 + 1) % 1, 0.5, 0.5); // Normalize hue
      const expected = { h: 0.5, s: 0, l: 0.25 };
      assert.deepStrictEqual(toPrecision(result, 6), toPrecision(expected, 6));
    });
  });
});
