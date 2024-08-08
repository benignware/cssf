import { expect } from 'chai';
import {
  srgbToXyz, xyzToSrgb,
  displayP3ToXyz, xyzToDisplayP3,
  a98RgbToXyz, xyzToA98Rgb,
  proPhotoRgbToXyz, xyzToProPhotoRgb,
  rec2020ToXyz, xyzToRec2020,
  srgbToRgbLinear, rgbLinearToSrgb
} from './rgb.mjs';

// Test for srgbToXyz
describe("sRGB to XYZ Conversion", () => {
  it('should convert sRGB to XYZ correctly', () => {
    const sRGB = [255, 0, 0]; // Red
    const expectedXYZ = [0.4124564, 0.2126729, 0.0193339];
    expect(srgbToXyz(...sRGB)).to.be.deepCloseTo(expectedXYZ, 1e-7);
  });
});

// Test for xyzToSrgb
describe("XYZ to sRGB Conversion", () => {
  it('should convert XYZ to sRGB correctly', () => {
    const XYZ = [0.4124564, 0.2126729, 0.0193339];
    const expectedRGB = [255, 0, 0]; // Red
    expect(xyzToSrgb(...XYZ)).to.be.deepCloseTo(expectedRGB, 1);
  });
});

// Test for srgbToRgbLinear
describe("sRGB to Linear RGB Conversion", () => {
  it('should convert sRGB to Linear RGB correctly', () => {
    const sRGB = [255, 0, 0]; // Red
    const expectedRgbLinear = [1, 0, 0]; // Linear RGB
    expect(srgbToRgbLinear(...sRGB)).to.be.deepCloseTo(expectedRgbLinear, 1e-6);
  });
});

// Test for rgbLinearToSrgb
describe("Linear RGB to sRGB Conversion", () => {
  it('should convert Linear RGB to sRGB correctly', () => {
    const rgbLinear = [1, 0, 0]; // Linear RGB
    const expectedSrgb = [255, 0, 0]; // Red
    expect(rgbLinearToSrgb(...rgbLinear)).to.be.deepCloseTo(expectedSrgb, 1);
  });
});

// Test for displayP3ToXyz
xdescribe("Display P3 to XYZ Conversion", () => {
  it('should convert Display P3 to XYZ correctly', () => {
    const displayP3 = [255, 0, 0]; // Red
    const expectedXYZ = [0.4002, 0.7075, 0.0000];
    expect(displayP3ToXyz(...displayP3)).to.be.deepCloseTo(expectedXYZ, 1e-4);
  });
});

// Test for xyzToDisplayP3
xdescribe("XYZ to Display P3 Conversion", () => {
  it('should convert XYZ to Display P3 correctly', () => {
    const XYZ = [0.4002, 0.7075, 0.0000];
    const expectedDisplayP3 = [255, 0, 0]; // Red
    expect(xyzToDisplayP3(...XYZ)).to.be.deepCloseTo(expectedDisplayP3, 1);
  });
});

// Test for a98RgbToXyz
describe("A98-RGB to XYZ Conversion", () => {
  it('should convert A98-RGB to XYZ correctly', () => {
    const a98Rgb = [255, 0, 0]; // Red
    const expectedXYZ = [0.5767309, 0.2973769, 0.0270343];
    expect(a98RgbToXyz(...a98Rgb)).to.be.deepCloseTo(expectedXYZ, 1e-7);
  });
});

// Test for xyzToA98Rgb
xdescribe("XYZ to A98-RGB Conversion", () => {
  it('should convert XYZ to A98-RGB correctly', () => {
    const XYZ = [0.5767309, 0.2973769, 0.0270343];
    const expectedA98Rgb = [255, 0, 0]; // Red
    expect(xyzToA98Rgb(...XYZ)).to.be.deepCloseTo(expectedA98Rgb, 2);
  });
});

// Test for proPhotoRgbToXyz
xdescribe("ProPhoto RGB to XYZ Conversion", () => {
  it('should convert ProPhoto RGB to XYZ correctly', () => {
    const proPhotoRgb = [255, 0, 0]; // Red
    const expectedXYZ = [0.797674, 0.135191, 0.031353];
    expect(proPhotoRgbToXyz(...proPhotoRgb)).to.be.deepCloseTo(expectedXYZ, 1e-6);
  });
});

// Test for xyzToProPhotoRgb
xdescribe("XYZ to ProPhoto RGB Conversion", () => {
  it('should convert XYZ to ProPhoto RGB correctly', () => {
    const XYZ = [0.797674, 0.135191, 0.031353];
    const expectedProPhotoRgb = [255, 0, 0]; // Red
    expect(xyzToProPhotoRgb(...XYZ)).to.be.deepCloseTo(expectedProPhotoRgb, 1);
  });
});

// Test for rec2020ToXyz
describe("Rec. 2020 RGB to XYZ Conversion", () => {
  it('should convert Rec. 2020 RGB to XYZ correctly', () => {
    const rec2020 = [255, 0, 0]; // Red
    const expectedXYZ = [0.636958, 0.2627, 0];
    expect(rec2020ToXyz(...rec2020)).to.be.deepCloseTo(expectedXYZ, 1e-6);
  });
});

// Test for xyzToRec2020
describe("XYZ to Rec. 2020 RGB Conversion", () => {
  it('should convert XYZ to Rec. 2020 RGB correctly', () => {
    const XYZ = [0.636958, 0.2627, 0];
    const expectedRec2020 = [255, 0, 0]; // Red
    expect(xyzToRec2020(...XYZ)).to.be.deepCloseTo(expectedRec2020, 1);
  });
});
