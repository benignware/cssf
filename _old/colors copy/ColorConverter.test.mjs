
// ColorConverter.test.mjs

import { expect } from 'chai';
import { ColorConverter } from './ColorConverter.mjs';
import { rgbToXyz } from './conversions/rgbToXyz.mjs';
import { xyzToRgb } from './conversions/xyzToRgb.mjs';
import {
  srgbToXyz, xyzToSrgb,
  srgbLinearToXyz, xyzToSrgbLinear,
  displayP3ToXyz, xyzToDisplayP3,
  a98RgbToXyz, xyzToA98Rgb,
  proPhotoRgbToXyz, xyzToProPhotoRgb,
  rec2020ToXyz, xyzToRec2020
} from './colorConversion.mjs';

// Whitepoints
const D50 = [96.422, 100.000, 82.521];
const D65 = [95.047, 100.000, 108.883];

describe('ColorConverter Full Functionality', () => {
  let converter;

  beforeEach(() => {
    converter = new ColorConverter();

    // Register color spaces with conversion functions
    converter.registerColorSpace('xyz', {
      toRgb: xyzToRgb,
      fromRgb: rgbToXyz
    });

    converter.registerColorSpace('xyz-d65', 'xyz');

    converter.registerColorSpace('xyz-d50', 'xyz', {
      toRgb: (x, y, z) => xyzToRgb(x, y, z, D65, D50),
      fromRgb: (r, g, b) => rgbToXyz(r, g, b, D50)
    });

    converter.registerColorSpace('srgb', {
      toXyz: srgbToXyz,
      fromXyz: xyzToSrgb
    });

    converter.registerColorSpace('srgb-linear', {
      toXyz: srgbLinearToXyz,
      fromXyz: xyzToSrgbLinear
    });

    converter.registerColorSpace('display-p3', {
      toXyz: displayP3ToXyz,
      fromXyz: xyzToDisplayP3
    });

    converter.registerColorSpace('a98-rgb', {
      toXyz: a98RgbToXyz,
      fromXyz: xyzToA98Rgb
    });

    converter.registerColorSpace('prophoto-rgb', {
      toXyz: proPhotoRgbToXyz,
      fromXyz: xyzToProPhotoRgb
    });

    converter.registerColorSpace('rec2020', {
      toXyz: rec2020ToXyz,
      fromXyz: xyzToRec2020
    });
  });

  // Tests for RGB to XYZ conversions
  describe("RGB to XYZ", () => {
    it('should convert RGB to XYZ with D65 whitepoint correctly', () => {
      expect(converter.convertColor('rgb', 'xyz-d65', 255, 0, 0))
        .to.be.deepCloseTo([0.4124564, 0.2126729, 0.0193339], 1e-6);
    });

    it('should convert RGB to XYZ-d50 correctly', () => {
      expect(converter.convertColor('rgb', 'xyz-d50', 255, 0, 0))
        .to.be.deepCloseTo([0.4360747, 0.2225045, 0.0139322], 0.05);
    });
  });

  describe("XYZ to RGB", () => {
    it('should convert XYZ to RGB with D65 whitepoint correctly', () => {
      expect(converter.convertColor('xyz-d65', 'rgb', 0.4124564, 0.2126729, 0.0193339))
        .to.be.deepCloseTo([255, 0, 0], 1);
    });

    it('should convert XYZ-d50 to RGB correctly', () => {
      expect(converter.convertColor('xyz-d50', 'rgb', 0.41842321168264124, 0.2126729, 0.014652909654399677))
        .to.be.deepCloseTo([255, 0, 0]);
    });
  });

  // Test for sRGB to XYZ conversion
  describe('sRGB to XYZ', () => {
    it('should convert sRGB to XYZ correctly', () => {
      expect(converter.convertColor('srgb', 'xyz', 255, 0, 0))
        .to.be.deepCloseTo([0.4124564, 0.2126729, 0.0193339]);
    });

    it('should convert green sRGB to XYZ correctly', () => {
      expect(converter.convertColor('srgb', 'xyz', 0, 255, 0))
        .to.be.deepCloseTo([0.3575761, 0.7151522, 0.1191920]);
    });

    it('should convert blue sRGB to XYZ correctly', () => {
      expect(converter.convertColor('srgb', 'xyz', 0, 0, 255))
        .to.be.deepCloseTo([0.1804375, 0.0721750, 0.9503041]);
    });
  });

  describe('XYZ to sRGB', () => {
    it('should convert XYZ to sRGB correctly', () => {
      expect(converter.convertColor('xyz', 'srgb', 0.4124564, 0.2126729, 0.0193339))
        .to.be.deepCloseTo([255, 0, 0]);
    });

    it('should convert green XYZ to sRGB correctly', () => {
      expect(converter.convertColor('xyz', 'srgb', 0.3575761, 0.7151522, 0.1191920))
        .to.be.deepCloseTo([0, 255, 0]);
    });

    it('should convert blue XYZ to sRGB correctly', () => {
      expect(converter.convertColor('xyz', 'srgb', 0.1804375, 0.0721750, 0.9503041))
        .to.be.deepCloseTo([0, 0, 255]);
    });
  });

  // Test for sRGB Linear to XYZ Conversion
  describe('sRGB Linear to XYZ', () => {
    it('should convert sRGB Linear red to XYZ correctly', () => {
      expect(converter.convertColor('srgb-linear', 'xyz', 1, 0, 0))
        .to.be.deepCloseTo([0.4124564, 0.2126729, 0.0193339], 0.0001);
    });

    it('should convert sRGB Linear green to XYZ correctly', () => {
      expect(converter.convertColor('srgb-linear', 'xyz', 0, 1, 0))
        .to.be.deepCloseTo([0.3575761, 0.7151522, 0.1191920], 0.0001);
    });

    it('should convert sRGB Linear blue to XYZ correctly', () => {
      expect(converter.convertColor('srgb-linear', 'xyz', 0, 0, 1))
        .to.be.deepCloseTo([0.1804375, 0.0721750, 0.9503041], 0.0001);
    });

    it('should convert sRGB Linear white to XYZ correctly', () => {
      expect(converter.convertColor('srgb-linear', 'xyz', 1, 1, 1))
        .to.be.deepCloseTo([0.95047, 1.00000, 1.08883], 0.0001);
    });
  });

  describe('XYZ to sRGB Linear', () => {
    it('should convert XYZ to sRGB Linear red correctly', () => {
      expect(converter.convertColor('xyz', 'srgb-linear', 0.4124564, 0.2126729, 0.0193339))
        .to.be.deepCloseTo([1, 0, 0], 0.0001);
    });

    it('should convert XYZ to sRGB Linear green correctly', () => {
      expect(converter.convertColor('xyz', 'srgb-linear', 0.3575761, 0.7151522, 0.1191920))
        .to.be.deepCloseTo([0, 1, 0], 0.0001);
    });

    it('should convert XYZ to sRGB Linear blue correctly', () => {
      expect(converter.convertColor('xyz', 'srgb-linear', 0.1804375, 0.0721750, 0.9503041))
        .to.be.deepCloseTo([0, 0, 1], 0.0001);
    });

    it('should convert XYZ to sRGB Linear white correctly', () => {
      expect(converter.convertColor('xyz', 'srgb-linear', 0.95047, 1.00000, 1.08883))
        .to.be.deepCloseTo([1, 1, 1], 0.0001);
    });
  });

  describe('Rec.2020 to XYZ', () => {
    it('should convert Rec.2020 red to XYZ correctly', () => {
      expect(converter.convertColor('rec2020', 'xyz', 255, 0, 0))
        .to.be.deepCloseTo([0.636958, 0.2627, 0]);
    });
  
    it('should convert Rec.2020 green to XYZ correctly', () => {
      expect(converter.convertColor('rec2020', 'xyz', 0, 255, 0))
        .to.be.deepCloseTo([0.144617, 0.677998, 0.028072]);
    });
  
    it('should convert Rec.2020 blue to XYZ correctly', () => {
      expect(converter.convertColor('rec2020', 'xyz', 0, 0, 255))
        .to.be.deepCloseTo([0.168880, 0.059303, 1.060985]);
    });
  });

  describe('XYZ to Rec.2020', () => {
    it('should convert XYZ to Rec.2020 red correctly', () => {
      expect(converter.convertColor('xyz', 'rec2020', 0.636958, 0.2627, 0))
        .to.be.deepCloseTo([255, 0, 0]);
    });
  
    it('should convert XYZ to Rec.2020 green correctly', () => {
      expect(converter.convertColor('xyz', 'rec2020', 0.144617, 0.677998, 0.028072))
        .to.be.deepCloseTo([0, 255, 0]);
    });
  
    it('should convert XYZ to Rec.2020 blue correctly', () => {
      expect(converter.convertColor('xyz', 'rec2020', 0.168880, 0.059303, 1.060985))
        .to.be.deepCloseTo([0, 0, 255]);
    });
  });
    

  // Test for A98-RGB to XYZ conversion
  describe('A98-RGB to XYZ', () => {
    it('should convert A98-RGB red to XYZ correctly', () => {
      expect(converter.convertColor('a98-rgb', 'xyz', 255, 0, 0))
        .to.be.deepCloseTo([0.5767309, 0.2973769, 0.0270343], 0.1);
    });

    it('should convert A98-RGB green to XYZ correctly', () => {
      expect(converter.convertColor('a98-rgb', 'xyz', 0, 255, 0))
        .to.deepCloseTo([0.1855540, 0.6273491, 0.0706872], 0.1);
    });

    it('should convert A98-RGB blue to XYZ correctly', () => {
      expect(converter.convertColor('a98-rgb', 'xyz', 0, 0, 255))
        .to.deepCloseTo([0.1881852, 0.0752741, 0.9911085], 0.1);
    });
  });

  // Test for XYZ to A98-RGB conversion
  xdescribe('XYZ to A98-RGB', () => {
    it('should convert XYZ to A98-RGB red correctly', () => {
      expect(converter.convertColor('xyz', 'a98-rgb', 0.5767309, 0.2973769, 0.0270343))
        .to.be.deepCloseTo([255, 0, 0], 1);
    });

    it('should convert XYZ to A98-RGB green correctly', () => {
      expect(converter.convertColor('xyz', 'a98-rgb', 0.1855540, 0.6273491, 0.070687))
        .to.be.deepCloseTo([0, 255, 0], 1);
    });

    it('should convert XYZ to A98-RGB blue correctly', () => {
      expect(converter.convertColor('xyz', 'a98-rgb', 0.1881852, 0.0752741, 0.9911085))
        .to.be.deepCloseTo([0, 0, 255], 1);
    });
  });

  xdescribe('Display-P3 to XYZ', () => {
    it('should convert Display-P3 red to XYZ correctly', () => {
      expect(converter.convertColor('display-p3', 'xyz', 255, 0, 0))
        .to.be.deepCloseTo([0.673, 0.303, 0.000], 0.15);
    });
  
    it('should convert Display-P3 green to XYZ correctly', () => {
      expect(converter.convertColor('display-p3', 'xyz', 0, 255, 0))
        .to.be.deepCloseTo([0.265, 0.692, 0.048], 0.15);
    });
  
    it('should convert Display-P3 blue to XYZ correctly', () => {
      expect(converter.convertColor('display-p3', 'xyz', 0, 0, 255))
        .to.be.deepCloseTo([0.156, 0.075, 0.814], 0.15);
    });
  });

  xdescribe('XYZ to Display-P3', () => {
    it('should convert XYZ to Display-P3 red correctly', () => {
      expect(converter.convertColor('xyz', 'display-p3', 0.673, 0.303, 0.000))
        .to.be.deepCloseTo([255, 0, 0], 1);
    });
  
    it('should convert XYZ to Display-P3 green correctly', () => {
      expect(converter.convertColor('xyz', 'display-p3', 0.265, 0.692, 0.048))
        .to.be.deepCloseTo([0, 255, 0], 1);
    });
  
    it('should convert XYZ to Display-P3 blue correctly', () => {
      expect(converter.convertColor('xyz', 'display-p3', 0.156, 0.075, 0.814))
        .to.be.deepCloseTo([0, 0, 255], 1);
    });
  });

  describe('ProPhoto RGB to XYZ', () => {
    it('should convert ProPhoto RGB red to XYZ correctly', () => {
      expect(converter.convertColor('prophoto-rgb', 'xyz', 255, 0, 0))
        .to.be.deepCloseTo([0.687, 0.288, 0.000], 0.15);
    });
  
    it('should convert ProPhoto RGB green to XYZ correctly', () => {
      expect(converter.convertColor('prophoto-rgb', 'xyz', 0, 255, 0))
        .to.be.deepCloseTo([0.213, 0.793, 0.024], 0.1);
    });
  
    it('should convert ProPhoto RGB blue to XYZ correctly', () => {
      expect(converter.convertColor('prophoto-rgb', 'xyz', 0, 0, 255))
        .to.be.deepCloseTo([0.143, 0.066, 0.797], 0.15);
    });
  });

  xdescribe('XYZ to ProPhoto RGB', () => {
    it('should convert XYZ to ProPhoto RGB red correctly', () => {
      expect(converter.convertColor('xyz', 'prophoto-rgb', 0.687, 0.288, 0.000))
        .to.be.deepCloseTo([255, 0, 0]);
    });
  
    it('should convert XYZ to ProPhoto RGB green correctly', () => {
      expect(converter.convertColor('xyz', 'prophoto-rgb', 0.213, 0.793, 0.024))
        .to.be.deepCloseTo([0, 255, 0]);
    });
  
    it('should convert XYZ to ProPhoto RGB blue correctly', () => {
      expect(converter.convertColor('xyz', 'prophoto-rgb', 0.143, 0.066, 0.797))
        .to.be.deepCloseTo([0, 0, 255]);
    });
  });
});
