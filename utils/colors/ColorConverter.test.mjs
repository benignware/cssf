import { expect } from 'chai';
import { ColorConverter } from './ColorConverter.mjs';

describe('ColorConverter', function() {
  let converter;

  beforeEach(() => {
    converter = new ColorConverter();
  });

  describe('addConversion()', function() {
    it('should add a new conversion method', function() {
      const func = (r, g, b) => [r / 2, g / 2, b / 2];
      converter.addConversion('rgb', 'zzz', func);

      const conversions = converter.getConversions();
      expect(conversions).to.have.property('rgbToZzz').that.is.a('function');
      expect(conversions.rgbToZzz(100, 150, 200)).to.deep.equal([50, 75, 100]);
    });

    it('should throw an error if neither fromSpace nor toSpace is provided with a function', function() {
      expect(() => converter.addConversion(null, () => {})).to.throw('Invalid parameters: Both fromSpace and toSpace must be provided with a function.');
    });

    it('should throw an error if parameters are invalid', function() {
      expect(() => converter.addConversion()).to.throw('Invalid parameters: Both fromSpace and toSpace must be provided with a function.');
      expect(() => converter.addConversion('rgb')).to.throw('Invalid parameters: Both fromSpace and toSpace must be provided with a function.');
    });
  });

  describe('addConversions()', function() {
    it('should add multiple conversions from an array of arrays', function() {
      const conversions = [
        ['rgb', 'zzz', (r, g, b) => [r / 2, g / 2, b / 2]],
        ['zzz', 'hsv', (r, g, b) => [r, g, b, 'converted']]
      ];
      converter.addConversions(conversions);

      const result = converter.getConversions();
      expect(result).to.have.property('rgbToZzz').that.is.a('function');
      expect(result).to.have.property('zzzToHsv').that.is.a('function');
    });

    it('should add multiple conversions from an object with color spaces as keys', function() {
      const conversions = {
        'rgb': {
          fromZzz: (r, g, b) => [r * 2, g * 2, b * 2],
          toZzz: (r, g, b) => [r / 2, g / 2, b / 2]
        },
        'zzz': {
          toHsv: (r, g, b) => [r, g, b, 'converted']
        }
      };
      converter.addConversions(conversions);

      const result = converter.getConversions();
      expect(result).to.have.property('rgbToZzz').that.is.a('function');
      expect(result).to.have.property('zzzToHsv').that.is.a('function');
    });

    it('should add multiple conversions from an object with conversion keys and functions', function() {
      const conversions = {
        'rgbToZzz': (r, g, b) => [r / 2, g / 2, b / 2],
        'zzzToHsv': (r, g, b) => [r, g, b, 'converted']
      };
      converter.addConversions(conversions);

      const result = converter.getConversions();
      expect(result).to.have.property('rgbToZzz').that.is.a('function');
      expect(result).to.have.property('zzzToHsv').that.is.a('function');
    });

    it('should throw an error for invalid array format in addConversions', function() {
      expect(() => converter.addConversions([['rgb', 'zzz', 'notAFunction']])).to.throw('Conversion functions must be provided.');
    });

    xit('should throw an error for invalid object format in addConversions', function() {
      expect(() => converter.addConversions({'rgb': 'notAnObject'})).to.throw('Color space conversions must be provided as an object.');
    });
  });

  describe('addColorSpace()', function() {
    it('should add multiple conversions for a single color space', function() {
      const conversions = {
        fromZzz: (r, g, b) => [r * 2, g * 2, b * 2],
        toHsv: (r, g, b) => [r, g, b, 'converted']
      };
      converter.addColorSpace('rgb', conversions);

      const result = converter.getConversions();
      expect(result).to.have.property('rgbToHsv').that.is.a('function');
    });

    it('should throw an error for invalid object format in addColorSpace', function() {
      expect(() => converter.addColorSpace('rgb', 'notAnObject')).to.throw('Color space conversions must be provided as an object.');
    });
  });

  describe('convertColor()', function() {
    it('should convert color values using the pipeline', function() {
      const func1 = (r, g, b) => [r / 2, g / 2, b / 2];
      const func2 = (r, g, b) => [r, g, b, 'converted'];
      converter.addConversion('rgb', 'zzz', func1);
      converter.addConversion('zzz', 'hsv', func2);

      const result = converter.convertColor('rgb', 'hsv', 100, 150, 200);
      expect(result).to.deep.equal([50, 75, 100, 'converted']);
    });

    it('should return input values if source and target spaces are the same', function() {
      const result = converter.convertColor('rgb', 'rgb', 100, 150, 200);
      expect(result).to.deep.equal([100, 150, 200]);
    });

    it('should throw an error if no conversion path is found', function() {
      expect(() => converter.convertColor('rgb', 'nonexistent', 100, 150, 200)).to.throw('Conversion path from rgb to nonexistent not found.');
    });
  });

  describe('hasConversion()', function() {
    it('should check if a conversion exists between two spaces', function() {
      const func = (r, g, b) => [r / 2, g / 2, b / 2];
      converter.addConversion('rgb', 'zzz', func);

      expect(converter.hasConversion('rgb', 'zzz')).to.be.true;
      expect(converter.hasConversion('zzz', 'rgb')).to.be.false;
    });

    it('should check if a conversion exists using a key', function() {
      const func = (r, g, b) => [r / 2, g / 2, b / 2];
      converter.addConversion('rgb', 'zzz', func);

      expect(converter.hasConversion('rgbToZzz')).to.be.true;
      expect(converter.hasConversion('zzzToRgb')).to.be.false;
    });
  });

  describe('getColorSpaces()', function() {
    it('should return an empty array if no conversions are added', function() {
      expect(converter.getColorSpaces()).to.deep.equal([]);
    });

    it('should return all color spaces covered by conversions', function() {
      const func = (r, g, b) => [r / 2, g / 2, b / 2];
      converter.addConversion('rgb', 'zzz', func);
      converter.addConversion('zzz', 'hsv', func);

      expect(converter.getColorSpaces()).to.be.deep.equal(['rgb', 'zzz', 'hsv']);
    });

    it('should return only fully covered color spaces', function() {
      const func = (r, g, b) => [r / 2, g / 2, b / 2];
      converter.addConversion('rgb', 'zzz', func);
      converter.addConversion('zzz', 'hsv', func);
      converter.addConversion('hsv', 'xyz', func);

      expect(converter.getColorSpaces()).to.be.deep.equal(['rgb', 'zzz', 'hsv', 'xyz']);
    });
  });

  describe('getConversionPath()', function() {
    it('should return a direct conversion path', function() {
      const func = (r, g, b) => [r / 2, g / 2, b / 2];
      converter.addConversion('rgb', 'zzz', func);

      const path = converter.getConversionPath('rgb', 'zzz');
      expect(path).to.deep.equal(['rgb', 'zzz']);
    });

    it('should return an indirect conversion path with multiple steps', function() {
      const func1 = (r, g, b) => [r / 2, g / 2, b / 2];
      const func2 = (r, g, b) => [r * 2, g * 2, b * 2];
      converter.addConversion('rgb', 'zzz-d65', func1);
      converter.addConversion('zzz-d65', 'hsv', func2);

      const path = converter.getConversionPath('rgb', 'hsv');
      expect(path).to.deep.equal(['rgb', 'zzz-d65', 'hsv']);
    });

    it('should handle multiple paths and find the shortest one', function() {
      const func1 = (r, g, b) => [r / 2, g / 2, b / 2];
      const func2 = (r, g, b) => [r / 4, g / 4, b / 4];
      const func3 = (r, g, b) => [r * 2, g * 2, b * 2];
      converter.addConversion('rgb', 'zzz-d65', func1);
      converter.addConversion('rgb', 'zzz2-d65', func2);
      converter.addConversion('zzz-d65', 'hsv', func3);

      const path = converter.getConversionPath('rgb', 'hsv');
      expect(path).to.deep.equal(['rgb', 'zzz-d65', 'hsv']);
    });

    it('should throw an error if no conversion path exists', function() {
      expect(() => converter.getConversionPath('rgb', 'nonexistent')).to.throw('Conversion path from rgb to nonexistent not found.');
    });
  });
});
