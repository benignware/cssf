import assert from 'assert';
import { convertColor } from './convertColor.mjs'; // Adjust the path accordingly
import { toPrecision } from '../utils.mjs'; // Assuming this function is imported from this path

const ROUND_TO_DECIMALS = 2; // Number of decimal places to round to

const assertColorEqual = (actual, expected, decimals) => {
  for (const key in expected) {
    if (expected.hasOwnProperty(key)) {
      const actualValue = actual[key];
      const expectedValue = expected[key];

      if (actualValue === undefined || expectedValue === undefined) {
        assert.strictEqual(actualValue, expectedValue, `Expected ${key}: ${expectedValue}, but got: ${actualValue}`);
      } else {
        assert.strictEqual(
          toPrecision(actualValue, decimals),
          toPrecision(expectedValue, decimals),
          `Expected ${key}: ${expectedValue}, but got: ${actualValue}`
        );
      }
    }
  }
};

xdescribe('convertColor', () => {
  it('should convert RGB to HSL correctly', () => {
    const rgb = { r: 255, g: 0, b: 0 }; // Red
    const expectedHsl = { h: 0, s: 100, l: 50 };
    const result = convertColor(rgb, 'rgb', 'hsl', false, true);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedHsl, ROUND_TO_DECIMALS);
  });

  it('should convert HSL to RGB correctly', () => {
    const hsl = { h: 0, s: 100, l: 50 }; // Red
    const expectedRgb = { r: 255, g: 0, b: 0 };
    const result = convertColor(hsl, 'hsl', 'rgb', true, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedRgb, ROUND_TO_DECIMALS);
  });

  it('should convert RGB to HWB correctly', () => {
    const rgb = { r: 255, g: 0, b: 0 }; // Red
    const expectedHwb = { h: 0, w: 0, b: 100 };
    const result = convertColor(rgb, 'rgb', 'hwb', false, true);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedHwb, ROUND_TO_DECIMALS);
  });

  it('should convert HWB to RGB correctly', () => {
    const hwb = { h: 0, w: 0, b: 100 }; // Red
    const expectedRgb = { r: 255, g: 0, b: 0 };
    const result = convertColor(hwb, 'hwb', 'rgb', true, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedRgb, ROUND_TO_DECIMALS);
  });

  it('should convert RGB to Lab correctly', () => {
    const rgb = { r: 255, g: 0, b: 0 }; // Red
    const expectedLab = { l: 53.23, a: 80.11, b: 67.22 };
    const result = convertColor(rgb, 'rgb', 'lab', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedLab, ROUND_TO_DECIMALS);
  });

  it('should convert Lab to RGB correctly', () => {
    const lab = { l: 53.23, a: 80.11, b: 67.22 }; // Red
    const expectedRgb = { r: 255, g: 0, b: 0 };
    const result = convertColor(lab, 'lab', 'rgb', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedRgb, ROUND_TO_DECIMALS);
  });

  it('should convert LCH to Lab correctly', () => {
    const lch = { l: 50, c: 100, h: 0 }; // Red
    const expectedLab = { l: 50, a: 100, b: 0 };
    const result = convertColor(lch, 'lch', 'lab', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedLab, ROUND_TO_DECIMALS);
  });

  it('should convert Lab to LCH correctly', () => {
    const lab = { l: 50, a: 100, b: 0 }; // Red
    const expectedLch = { l: 50, c: 100, h: 0 };
    const result = convertColor(lab, 'lab', 'lch', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedLch, ROUND_TO_DECIMALS);
  });

  it('should convert XYZ to RGB correctly', () => {
    const xyz = { x: 41.24, y: 21.26, z: 1.93 }; // Red
    const expectedRgb = { r: 255, g: 0, b: 0 };
    const result = convertColor(xyz, 'xyz', 'rgb', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedRgb, ROUND_TO_DECIMALS);
  });

  it('should convert RGB to XYZ correctly', () => {
    const rgb = { r: 255, g: 0, b: 0 }; // Red
    const expectedXyz = { x: 41.24, y: 21.26, z: 1.93 };
    const result = convertColor(rgb, 'rgb', 'xyz', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedXyz, ROUND_TO_DECIMALS);
  });

  it('should convert Lab to XYZ correctly', () => {
    const lab = { l: 53.23, a: 80.11, b: 67.22 }; // Red
    const expectedXyz = { x: 41.24, y: 21.26, z: 1.93 };
    const result = convertColor(lab, 'lab', 'xyz', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedXyz, ROUND_TO_DECIMALS);
  });

  it('should convert XYZ to Lab correctly', () => {
    const xyz = { x: 41.24, y: 21.26, z: 1.93 }; // Red
    const expectedLab = { l: 53.23, a: 80.11, b: 67.22 };
    const result = convertColor(xyz, 'xyz', 'lab', false, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedLab, ROUND_TO_DECIMALS);
  });

  it('should handle relative to absolute conversion correctly', () => {
    const rgb = { r: 0.00392156862745098, g: 0, b: 0 }; // Approx. red in relative values
    const expectedRgb = { r: 255, g: 0, b: 0 }; // Red in absolute values
    const result = convertColor(rgb, 'rgb', 'rgb', true, false);

    console.log('Converted Color Components:', result);
    assertColorEqual(result, expectedRgb, ROUND_TO_DECIMALS);
  });
});
