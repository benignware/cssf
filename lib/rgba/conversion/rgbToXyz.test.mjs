// rgbToXyz.test.mjs
import { strict as assert } from 'assert';
import { rgbToXyz } from './rgbToXyz.mjs';
import { toPrecision } from '../../utils.mjs';

describe('rgbToXyz', () => {
  describe('Conversion of RGB to XYZ', () => {
    it('should convert RGB (1, 1, 1) to XYZ (0.95047, 1.00000, 1.08883)', () => {
      const result = rgbToXyz(1, 1, 1);
      const expected = { x: 0.95047, y: 1.00000, z: 1.08883 };
      assert.deepStrictEqual(toPrecision(result, 5), toPrecision(expected, 5));
    });

    it('should convert RGB (0.5, 0.5, 0.5) to XYZ (0.32168, 0.33629, 0.33204)', () => {
      const result = rgbToXyz(0.5, 0.5, 0.5);
      const expected = { x: 0.32168, y: 0.33629, z: 0.33204 };
      assert.deepStrictEqual(toPrecision(result, 5), toPrecision(expected, 5));
    });

    it('should convert RGB (1, 0, 0) to XYZ (0.41246, 0.21267, 0.01933)', () => {
      const result = rgbToXyz(1, 0, 0);
      const expected = { x: 0.41246, y: 0.21267, z: 0.01933 };
      assert.deepStrictEqual(toPrecision(result, 5), toPrecision(expected, 5));
    });
  });
});
