import assert from 'assert';

import { toRelativeColor, toAbsoluteColor } from './convertColorComponents.mjs';


// test/colorConversion.test.js// test/colorConversion.test.js
xdescribe('Color Conversion Functions', function() {
    describe('toRelativeColor', function() {
        it('should convert RGB absolute to relative', function() {
            const input = { r: '255', g: '128', b: '64' };
            const expected = { r: 1, g: 0.5019607843137255, b: 0.25098039215686274 };
            const result = toRelativeColor(input, 'rgb');
            assert.deepStrictEqual(result, expected);
        });

        it('should convert HSL absolute to relative', function() {
            const input = { h: '240', s: '100%', l: '50%' };
            const expected = { h: 240 / 360, s: 1, l: 0.5 };
            const result = toRelativeColor(input, 'hsl');
            assert.deepStrictEqual(result, expected);
        });

        it('should convert HWB absolute to relative', function() {
            const input = { h: '120', w: '50%', b: '50%' };
            const expected = { h: 120 / 360, w: 0.5, b: 0.5 };
            const result = toRelativeColor(input, 'hwb');
            assert.deepStrictEqual(result, expected);
        });

        it('should convert Lab absolute to relative', function() {
            const input = { l: '100', a: '0', b: '0' };
            const expected = { l: 1, a: 0, b: 0 };
            const result = toRelativeColor(input, 'lab');
            assert.deepStrictEqual(result, expected);
        });

        it('should convert LCH absolute to relative', function() {
            const input = { l: '100', c: '50', h: '360' };
            const expected = { l: 1, c: 0.5, h: 1 };
            const result = toRelativeColor(input, 'lch');
            assert.deepStrictEqual(result, expected);
        });

        it('should convert XYZ absolute to relative', function() {
            const input = { x: '0.95', y: '1', z: '1.05' };
            const expected = { x: 0.95, y: 1, z: 1.05 };
            const result = toRelativeColor(input, 'xyz');
            assert.deepStrictEqual(result, expected);
        });
    });

    describe('toAbsoluteColor', function() {
        it('should convert RGB relative to absolute', function() {
          const input = { r: '1', g: '0.5', b: '0.25' };
          const expected = { r: 255, g: 127.5, b: 63.75 };
          const result = toAbsoluteColor(input, 'rgb');
          assert.deepStrictEqual(result, expected);
        });

        
      it('should convert HSL relative to absolute', function() {
        const input = { h: '0.5', s: '0.75', l: '0.25' };
        const expected = { h: 180, s: 75, l: 25 };
        const result = toAbsoluteColor(input, 'hsl');
        assert.deepStrictEqual(result, expected);
      });

      it('should convert HWB relative to absolute', function() {
        const input = { h: '0.5', w: '0.5', b: '0.25' };
        const expected = { h: 180, w: 50, b: 25 };
        const result = toAbsoluteColor(input, 'hwb');
        assert.deepStrictEqual(result, expected);
      });

        it('should convert Lab relative to absolute', function() {
            const input = { l: '1', a: '0', b: '0' };
            const expected = { l: 100, a: 0, b: 0 };
            const result = toAbsoluteColor(input, 'lab');
            assert.deepStrictEqual(result, expected);
        });

        it('should convert LCH relative to absolute', function() {
            const input = { l: '1', c: '0.5', h: '1' };
            const expected = { l: 100, c: 50, h: 360 };
            const result = toAbsoluteColor(input, 'lch');
            assert.deepStrictEqual(result, expected);
        });

        it('should convert XYZ relative to absolute', function() {
            const input = { x: '0.95', y: '1', z: '1.05' };
            const expected = { x: 95, y: 100, z: 105 };
            const result = toAbsoluteColor(input, 'xyz');
            assert.deepStrictEqual(result, expected);
        });
    });
});
