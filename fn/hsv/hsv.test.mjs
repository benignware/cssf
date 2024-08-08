// test/hsv.test.js
import { expect } from 'chai';
import { hsv } from './hsv.mjs';

describe('hsv Function', () => {
  it('should convert HSV to HSL correctly with alpha 1', () => {
    const h = 120;
    const s = 0.5;
    const v = 0.5;
    const expected = 'hsl(120 0.5 0.25';
    const result = hsv(h, s, v);
    expect(result).to.equal(expected);
  });

  it('should convert HSV to HSL correctly with alpha not equal to 1', () => {
    const h = 240;
    const s = 0.6;
    const v = 0.7;
    const alpha = 0.5;
    const expected = 'hsl(240 0.6 0.35 / 0.5';
    const result = hsv(h, s, v, alpha);
    expect(result).to.equal(expected);
  });

  it('should handle edge case where l is 0', () => {
    const h = 0;
    const s = 0;
    const v = 1;
    const expected = 'hsl(0 0 0';
    const result = hsv(h, s, v);
    expect(result).to.equal(expected);
  });

  it('should handle edge case where l is 1', () => {
    const h = 0;
    const s = 0;
    const v = 0;
    const expected = 'hsl(0 0 0';
    const result = hsv(h, s, v);
    expect(result).to.equal(expected);
  });

  // Add more test cases as needed
});
