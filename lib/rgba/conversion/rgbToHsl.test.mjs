import assert from 'assert';
import { rgbToHsl } from './rgbToHsl.mjs'; // Adjust the path as needed

describe('Color Conversion Tests', function() {
    describe('rgbToHsl', function() {
        it('should convert RGB (0.5, 0.5, 0.5) to HSL (0, 0, 0.5)', function() {
            const result = rgbToHsl(0.5, 0.5, 0.5);
            assert.deepStrictEqual(result, { h: 0, s: 0, l: 0.5 });
        });

        it('should convert RGB (1, 0, 0) to HSL (0, 1, 0.5)', function() {
            const result = rgbToHsl(1, 0, 0);
            assert.deepStrictEqual(result, { h: 0, s: 1, l: 0.5 });
        });

        it('should convert RGB (0, 1, 0) to HSL (1/3, 1, 0.5)', function() {
            const result = rgbToHsl(0, 1, 0);
            assert.deepStrictEqual(result, { h: 1 / 3, s: 1, l: 0.5 });
        });

        it('should convert RGB (0, 0, 1) to HSL (2/3, 1, 0.5)', function() {
            const result = rgbToHsl(0, 0, 1);
            assert.deepStrictEqual(result, { h: 2 / 3, s: 1, l: 0.5 });
        });

        it('should convert RGB (1, 1, 1) to HSL (0, 0, 1)', function() {
            const result = rgbToHsl(1, 1, 1);
            assert.deepStrictEqual(result, { h: 0, s: 0, l: 1 });
        });

        it('should convert RGB (0, 0, 0) to HSL (0, 0, 0)', function() {
            const result = rgbToHsl(0, 0, 0);
            assert.deepStrictEqual(result, { h: 0, s: 0, l: 0 });
        });
    });
});
