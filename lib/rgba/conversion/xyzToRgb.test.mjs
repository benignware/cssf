// xyzToRgb.test.mjs
import { strict as assert } from 'assert';
import { xyzToRgb } from './xyzToRgb.mjs';
import { toPrecision } from '../../utils.mjs';

describe('xyzToRgb', () => {
  describe('Conversion of XYZ to RGB', () => {
    it('should convert XYZ (0.32168, 0.33629, 0.33204) to RGB (0.5, 0.5, 0.5)', () => {
      const result = xyzToRgb(0.32168, 0.33629, 0.33204);
      assert.deepStrictEqual(toPrecision(result, 3), { r: 0.634, g: 0.612, b: 0.584 });
    });

    it('should convert XYZ (0.4124564, 0.2126729, 0.0193339) to RGB (1, 0, 0)', () => {
      const result = xyzToRgb(0.4124564, 0.2126729, 0.0193339);
      assert.deepStrictEqual(toPrecision(result), { r: 1, g: 0, b: 0 });
    });
  });
});
