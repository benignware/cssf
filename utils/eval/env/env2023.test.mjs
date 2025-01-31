import { expect } from 'chai';
import { getEval } from '../getEval.mjs';

const e = getEval();

describe('System Baseline 2023', () => {

  describe('colorMix', () => {
    it('should mix color', () => {
      const input = 'color-mix(in srgb, rgb(0 0 0), rgb(255 255 255) 50%)';
      const expected = 'rgb(127.5, 127.5, 127.5)';
      const actual = e(input);
      
      expect(actual).to.be.equal(expected);
    });
  });

  return;
  describe('mod', () => {
    it('should return the modulus of two numbers', () => {
      expect(e('mod(5, 2)')).to.equal(1);
    });

    it('should return the modulus of two numbers with units', () => {
      expect(e('mod(5px, 2px)')).to.equal('1px');
    });

    it('should handle modulus with zero as divisor gracefully', () => {
      expect(e('mod(5, 0)')).to.be.NaN; // Ensure it handles zero divisor gracefully
    });

    xit('should handle modulus with zero and units gracefully', () => {
      expect(e('mod(5px, 0px)')).to.be.NaN; // Ensure it handles zero divisor gracefully
    });
  });

  describe('exp', () => {
    it('should return the exponent of a number', () => {
      expect(e('exp(1)')).to.be.closeTo(Math.exp(1), 0.10);
    });

    it('should return the exponent of a number with units', () => {
      expect(e('exp(1px)')).to.be.closeTo(Math.exp(1), 0.1);
    });

    it('should handle zero as input', () => {
      expect(e('exp(0)')).to.equal(1);
    });

    it('should handle negative input', () => {
      expect(e('exp(-1)')).to.be.closeTo(Math.exp(-1), 0.10);
    });
  });

  describe('log', () => {
    it('should return 0 when the input is 1', () => {
      expect(e('log(1)')).to.equal(0);
    });

    it('should return 1 when the input is e', () => {
      expect(e('log(e)')).to.equal(1);
    });

    it('should return 2 when the input is 7.389', () => {
      expect(e('log(7.389)')).to.be.closeTo(2, 0.1);
    });

    it('should handle dynamic input', () => {
      expect(e('log(var(--x))', {
        '--x': 7.389
      })).to.be.closeTo(2, 0.1);
    });

    it('should return "200px" when the input is 7.389 and the result is multiplied by "100px"', () => {
      expect(e('calc(100px * log(7.389))')).to.be.closeToUnit('200px', 0.1);
    });

    it('should return 1 when the input is 10 and the base is 10', () => {
      expect(e('calc(log(10, 10))')).to.equal(1);
    });

    it('should return 4 when the input is 16 and the base is 2', () => {
      expect(e('calc(log(16, 2))')).to.be.closeTo(4, 0.1);
    });

    it('should return ~2.3026 when the input is 10', () => {
      expect(e('calc(log(10))')).to.be.closeTo(2.3026, 0.1);
    });

    it('should return NaN for base 1', () => {
      expect(e('log(10, 1)')).to.be.NaN;
    });

    it('should return NaN for negative numbers', () => {
      expect(e('log(-10)')).to.be.NaN;
    });
  });

  describe('sqrt', () => {
    it('should return 2 for input 4', () => {
      expect(e('sqrt(4)')).to.equal(2);
    });

    it('should return NaN for negative input', () => {
      expect(e('sqrt(-4)')).to.be.NaN;
    });

    it('should return 0 for input 0', () => {
      expect(e('sqrt(0)')).to.equal(0);
    });

    it('should handle dynamic input', () => {
      expect(e('sqrt(var(--x))', {
        '--x': 16
      })).to.equal(4);
    });
  });

  describe('constants', () => {
    it('should return the value of pi', () => {
      expect(e('pi')).to.be.closeTo(Math.PI, 0.00001);
    });

    it('should return NaN', () => {
      expect(e('NaN')).to.be.NaN;
    });

    it('should return Infinity', () => {
      expect(e('infinity')).to.equal(Infinity);
    });

    it('should return the value of e', () => {
      expect(e('e')).to.be.closeTo(Math.E, 0.00001);
    });
  });

  describe('trigonometric functions', () => {
    it('should correctly compute sine of 0 radians', () => {
      expect(e('sin(0)')).to.equal(0);
    });

    it('should correctly compute sine of π/2 radians', () => {
      expect(e('sin(90deg)')).to.be.closeTo(1, 0.01); // Assuming degrees are converted internally
    });

    it('should correctly compute sine of π radians', () => {
      expect(e('sin(180deg)')).to.be.closeTo(0, 0.01);
    });

    it('should correctly compute sine of 3π/2 radians', () => {
      expect(e('sin(270deg)')).to.be.closeTo(-1, 0.01);
    });

    it('should correctly compute sine of 2π radians', () => {
      expect(e('sin(360deg)')).to.be.closeTo(0, 0.01);
    });

    it('should handle dynamic input for sine function', () => {
      expect(e('sin(var(--angle))', {
        '--angle': '90deg'
      })).to.be.closeTo(1, 0.01);
    });

    it('should handle sine with unit', () => {
      expect(e('sin(30deg)')).to.be.closeTo(0.5, 0.01); // sin(π/6) = 0.5
    });
  });

  describe('color functions', () => {
    it('should convert RGB to HSL correctly', () => {
      const input = e('hsl(from rgb(255 0 0) h s l)');
      expect(input).to.equal('hsl(0deg 100% 50%)');
    });

    xit('should convert HSL to RGB correctly', () => {
      const input = e('rgb(from hsl(240deg 100% 50%) r g b)');
      expect(input).to.equal('rgb(0 0 255)');
    });

    it('should convert RGB to HWB correctly', () => {
      const input = e('hwb(from rgb(255 0 0) h w b)');
      expect(input).to.equal('hwb(0deg 0% 0%)'); // Adjust expected value based on actual HWB conversion
    });

    it('should convert RGB to LAB correctly', () => {
      const input = e('lab(from rgb(255 0 0) l a b)');
      expect(input).to.closeToUnit('lab(53.23 80.09 67.20)'); // Adjust based on actual LAB conversion
    });

    it('should convert between color spaces using color function', () => {
      const input = e('color(from color(srgb 1 0 0) xyz x y z)');
      expect(input).to.be.equal('color(xyz 0.4124564 0.2126729 0.0193339)');
    });

    it('should handle dynamic input for RGB color function', () => {
      const input = e('rgb(var(--r), var(--g), var(--b))', {
        '--r': 255,
        '--g': 0,
        '--b': 0
      });
      expect(input).to.equal('rgb(255 0 0)');
    });

    it('should handle dynamic input for HSL color function', () => {
      const input = e('hsl(var(--h), var(--s), var(--l))', {
        '--h': '240deg',
        '--s': '100%',
        '--l': '50%'
      });
      expect(input).to.equal('hsl(240deg 100% 50%)');
    });
  });
});