// hwbToRgb.test.mjs
import assert from 'assert';
import { hwbToRgb } from './hwbToRgb.mjs'; // Adjust the path as needed

describe('Color Conversion Tests', function() {
    describe('hwbToRgb', function() {
        
        it('should convert HWB (0, 0, 0) to RGB (1, 0, 0)', function() {
            const result = hwbToRgb(0, 0, 0);
            assert.deepStrictEqual(result, { r: 1, g: 0, b: 0 });
        });

        it('should convert HWB (0.5, 0.2, 0.2) to RGB (0.2, 0.2, 0.6)', function() {
            const result = hwbToRgb(0.5, 0.2, 0.2);
            assert.deepStrictEqual(result, { r: 0.2, g: 0.2, b: 0.6 });
        });

        it('should convert HWB (0.333, 0.5, 0.5) to RGB (0.25, 0.5, 0.5)', function() {
            const result = hwbToRgb(0.333, 0.5, 0.5);
            assert.deepStrictEqual(result, { r: 0.25, g: 0.5, b: 0.5 });
        });

        it('should convert HWB (0.666, 0.1, 0.1) to RGB (0.1, 0.1, 0.9)', function() {
            const result = hwbToRgb(0.666, 0.1, 0.1);
            assert.deepStrictEqual(result, { r: 0.1, g: 0.1, b: 0.9 });
        });

        it('should convert HWB (1, 0.5, 0.5) to RGB (0.5, 0, 0)', function() {
            const result = hwbToRgb(1, 0.5, 0.5);
            assert.deepStrictEqual(result, { r: 0.5, g: 0, b: 0 });
        });

        // Additional test cases

        it('should handle HWB values where whiteness and blackness are both 0', function() {
            const result = hwbToRgb(0.25, 0, 0);
            assert.deepStrictEqual(result, { r: 0.25, g: 0, b: 0 });
        });

        it('should handle HWB values where whiteness is 1 and blackness is 0', function() {
            const result = hwbToRgb(0.75, 1, 0);
            assert.deepStrictEqual(result, { r: 1, g: 1, b: 1 });
        });

        it('should handle HWB values where blackness is 1 and whiteness is 0', function() {
            const result = hwbToRgb(0.5, 0, 1);
            assert.deepStrictEqual(result, { r: 0, g: 0, b: 0 });
        });

        it('should handle HWB values where both whiteness and blackness are 0.5', function() {
            const result = hwbToRgb(0.5, 0.5, 0.5);
            assert.deepStrictEqual(result, { r: 0.25, g: 0.25, b: 0.75 });
        });

    });
});
