import { strict as assert } from 'assert';
import {

rgbToHsl,
hslToRgb,
rgbToHwb,
hwbToRgb,
rgbToLab,
labToRgb,
rgbToXyz,
xyzToRgb,
hslToLab,
labToHsl,
hwbToLab,
labToHwb,
labToLch,
lchToLab,
labToXyz,
xyzToLab
} from './colorConversions.mjs';

describe('Color Conversion Functions', function() {
it('should correctly convert RGB to HSL', function() {
    const rgb = { r: 255, g: 0, b: 0 };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    assert.deepEqual(hsl, { h: 0, s: 100, l: 50 });
});

it('should correctly convert HSL to RGB', function() {
    const hsl = { h: 0, s: 100, l: 50 }; // Red
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    assert.deepEqual(rgb, { r: 255, g: 0, b: 0 });
});

it('should correctly convert RGB to HWB', function() {
    const rgb = { r: 120, g: 200, b: 255 };
    const hwb = rgbToHwb(rgb.r, rgb.g, rgb.b);
    assert.deepEqual(hwb, {
        "h": 204,
        "w": 47,
        "b": 0
    });
});


it('should correctly convert HWB to RGB', function() {
    const hwb = { h: 204, w: 0.47, b: 0 };
    const rgb = hwbToRgb(hwb.h, hwb.w, hwb.b);
    assert.deepEqual(rgb, { r: 120, g: 200, b: 255 });
});

return;
it('should correctly convert RGB to LAB', function() {
    const rgb = { r: 255, g: 0, b: 0 };
    const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
    assert.deepEqual(lab, { l: 53.2408, a: 80.0925, b: 67.203 });
});

it('should correctly convert LAB to RGB', function() {
    const lab = { l: 53.2408, a: 80.0925, b: 67.203 };
    const rgb = labToRgb(lab.l, lab.a, lab.b);
    assert.deepEqual(rgb, { r: 255, g: 0, b: 0 });
});

it('should correctly convert RGB to XYZ', function() {
    const rgb = { r: 255, g: 0, b: 0 };
    const xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
    assert.deepEqual(xyz, { x: 41.24, y: 21.26, z: 1.93 });
});

it('should correctly convert XYZ to RGB', function() {
    const xyz = { x: 41.24, y: 21.26, z: 1.93 };
    const rgb = xyzToRgb(xyz.x, xyz.y, xyz.z);
    assert.deepEqual(rgb, { r: 255, g: 0, b: 0 });
});

it('should correctly convert HSL to LAB', function() {
    const hsl = { h: 0, s: 100, l: 50 }; // Red
    const lab = hslToLab(hsl.h, hsl.s, hsl.l);
    assert.deepEqual(lab, { l: 53.2408, a: 80.0925, b: 67.203 });
});

it('should correctly convert LAB to HSL', function() {
    const lab = { l: 53.2408, a: 80.0925, b: 67.203 };
    const hsl = labToHsl(lab.l, lab.a, lab.b);
    assert.deepEqual(hsl, { h: 0, s: 100, l: 50 });
});

it('should correctly convert HWB to LAB', function() {
    const hwb = { h: 0, w: 0, b: 100 }; // Red with blackness 100%
    const lab = hwbToLab(hwb.h, hwb.w, hwb.b);
    assert.deepEqual(lab, { l: 53.2408, a: 80.0925, b: 67.203 });
});

it('should correctly convert LAB to HWB', function() {
    const lab = { l: 53.2408, a: 80.0925, b: 67.203 };
    const hwb = labToHwb(lab.l, lab.a, lab.b);
    assert.deepEqual(hwb, { h: 0, w: 0, b: 100 });
});

it('should correctly convert LAB to XYZ', function() {
    const lab = { l: 53.2408, a: 80.0925, b: 67.203 };
    const xyz = labToXyz(lab.l, lab.a, lab.b);
    assert.deepEqual(xyz, { x: 41.24, y: 21.26, z: 1.93 });
});

it('should correctly convert XYZ to LAB', function() {
    const xyz = { x: 41.24, y: 21.26, z: 1.93 };
    const lab = xyzToLab(xyz.x, xyz.y, xyz.z);
    assert.deepEqual(lab, { l: 53.2408, a: 80.0925, b: 67.203 });
});

it('should correctly convert LAB to LCH', function() {
    const lab = { l: 53.2408, a: 80.0925, b: 67.203 };
    const lch = labToLch(lab.l, lab.a, lab.b);
    assert.deepEqual(lch, { l: 53.2408, c: 103.536, h: 39.999 });
});

it('should correctly convert LCH to LAB', function() {
    const lch = { l: 53.2408, c: 103.536, h: 39.999 };
    const lab = lchToLab(lch.l, lch.c, lch.h);
    assert.deepEqual(lab, { l: 53.2408, a: 80.0925, b: 67.203 });
});
});
