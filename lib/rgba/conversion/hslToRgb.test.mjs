import assert from 'assert';
import { hslToRgb } from './hslToRgb.mjs'; // Adjust the path as needed

describe('Color Conversion Tests', function() {
    // Existing rgbToHsl and hwbToRgb tests...

    describe('hslToRgb', function() {
        it('should convert HSL (0, 0, 0.5) to RGB (0.5, 0.5, 0.5)', function() {
            const result = hslToRgb(0, 0, 0.5);
            assert.deepStrictEqual(result, { r: 0.5, g: 0.5, b: 0.5 });
        });

        it('should convert HSL (0, 1, 0.5) to RGB (1, 0, 0)', function() {
            const result = hslToRgb(0, 1, 0.5);
            assert.deepStrictEqual(result, { r: 1, g: 0, b: 0 });
        });

        it('should convert HSL (1/3, 1, 0.5) to RGB (0, 1, 0)', function() {
            const result = hslToRgb(1 / 3, 1, 0.5);
            assert.deepStrictEqual(result, { r: 0, g: 1, b: 0 });
        });

        it('should convert HSL (2/3, 1, 0.5) to RGB (0, 0, 1)', function() {
            const result = hslToRgb(2 / 3, 1, 0.5);
            assert.deepStrictEqual(result, { r: 0, g: 0, b: 1 });
        });

        it('should convert HSL (0, 0, 1) to RGB (1, 1, 1)', function() {
            const result = hslToRgb(0, 0, 1);
            assert.deepStrictEqual(result, { r: 1, g: 1, b: 1 });
        });

        it('should convert HSL (0, 0, 0) to RGB (0, 0, 0)', function() {
            const result = hslToRgb(0, 0, 0);
            assert.deepStrictEqual(result, { r: 0, g: 0, b: 0 });
        });
    });
});
