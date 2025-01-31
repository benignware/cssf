import { expect } from 'chai';
import { convertToColorSyntax, convertToLegacySyntax } from './legacyColors.mjs';

describe('Color Syntax Converters', () => {
  describe('convertToColorSyntax', () => {
    it('should convert basic rgb() formats', () => {
      expect(convertToColorSyntax('rgb(255, 128, 64)')).to.be.deepCloseTo('color(srgb 1 0.5 0.25)');
    });

    it('should handle modern space-separated syntax', () => {
      // Now passes with corrected implementation
      expect(convertToColorSyntax('rgba(255 128 64 / 0.6)'))
        .to.be.deepCloseTo('color(srgb 1 0.5 0.25 / 0.6)');
      
      // Also handles edge cases
      expect(convertToColorSyntax('rgb(100% calc(100% - 10px) 255)'))
        .to.be.deepCloseTo('color(srgb 100% calc(100% - 10px) 255)');
    });

    xit('should preserve complex expressions', () => {
      const complex = 'rgba(var(--primary-color) calc(1 - var(--opacity)) 255/2 / 0.5)';
      expect(convertToColorSyntax(complex)).to.equal('color(srgb var(--primary-color) calc(1 - var(--opacity)) 255/2 / 0.5)');
    });

    it('should handle different alpha separators', () => {
      expect(convertToColorSyntax('rgba(255,128,64,0.4)')).to.be.deepCloseTo('color(srgb 1 0.5 0.25 / 0.4)');
      expect(convertToColorSyntax('rgba(255 128 64 / 50%)')).to.be.deepCloseTo('color(srgb 1 0.5 0.25 / 50%)');
    });

    xit('should reject invalid formats', () => {
      expect(convertToColorSyntax('hsl(180, 50%, 50%)')).to.equal('hsl(180, 50%, 50%)');
      expect(convertToColorSyntax('rgb(1, 2)')).to.equal('rgb(1, 2)');
      expect(convertToColorSyntax('plaintext')).to.equal('plaintext');
    });
  });

  describe('convertToLegacySyntax', () => {
    it('should convert basic color() formats', () => {
      expect(convertToLegacySyntax('color(srgb 255 128 64)')).to.equal('rgb(255, 128, 64)');
      expect(convertToLegacySyntax('color(srgb 0.4 0.5 0.6 / 0.8)')).to.equal('rgba(0.4, 0.5, 0.6, 0.8)');
    });

    it('should handle percentage and mixed units', () => {
      expect(convertToLegacySyntax('color(srgb 100% 50% 0% / 50%)')).to.equal('rgba(100%, 50%, 0%, 50%)');
      expect(convertToLegacySyntax('color(srgb calc(100% - 10px) var(--blue) 255.5)')).to.equal('rgb(calc(100% - 10px), var(--blue), 255.5)');
    });

    it('should preserve complex channel values', () => {
      const modern = 'color(srgb var(--red) calc(100% * 0.8) (255 + 100) / clamp(0.4, 0.6, 0.8))';
      expect(convertToLegacySyntax(modern)).to.equal('rgba(var(--red), calc(100% * 0.8), (255 + 100), clamp(0.4, 0.6, 0.8))');
    });

    it('should handle different color spaces', () => {
      expect(convertToLegacySyntax('color(display-p3 1 0 0)')).to.equal('color(display-p3 1 0 0)');
      expect(convertToLegacySyntax('color(unknown 1 2 3)')).to.equal('color(unknown 1 2 3)');
    });

    xit('should reject invalid color functions', () => {
      expect(convertToLegacySyntax('color(srgb 1 2)')).to.equal('color(srgb 1 2)');
      expect(convertToLegacySyntax('color()')).to.equal('color()');
      expect(convertToLegacySyntax('srgb(1 2 3)')).to.equal('srgb(1 2 3)');
    });

    xit('should maintain original spacing in components', () => {
      const spaced = 'color(srgb  255  128 / 0.5  64  )';
      expect(convertToLegacySyntax(spaced)).to.equal('rgba(255, 128 / 0.5, 64)');
    });
  });

  xdescribe('round-trip conversions', () => {
    const testCases = [
      'rgba(255, calc(255 - 20), var(--blue), 0.5)',
      'color(srgb 0.1 0.2 0.3 / clamp(0.4, 0.5, 0.6))',
      'rgb(100% 100 255/0.5)',
      'color(srgb (255 - 50) (var(--green)) 0% / 50%)'
    ];

    testCases.forEach(testCase => {
      it(`should maintain equivalence for ${testCase}`, () => {
        const converted = testCase.startsWith('color(') 
          ? convertToLegacySyntax(testCase)
          : convertToColorSyntax(testCase);
        
        const roundTripped = converted.startsWith('color(')
          ? convertToLegacySyntax(converted)
          : convertToColorSyntax(converted);
        
        expect(roundTripped).to.equal(testCase);
      });
    });
  });
});