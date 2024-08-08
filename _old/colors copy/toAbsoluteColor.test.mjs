import { expect } from "chai";
import { toAbsoluteColor } from "./toAbsoluteColor.mjs";

describe("Color Normalizations Functions", () => {
  describe('toAbsoluteColor', () => {
    it("should denormalize RGB values", () => {
      expect(toAbsoluteColor("rgb", 1, 0, 0)).to.deep.equal([255, 0, 0]);
    });

    it("should denormalize HSL values", () => {
      expect(toAbsoluteColor("hsl", 0, 1, 0.5)).to.deep.equal([0, 100, 50]);
    });

    it("should denormalize HSV values", () => {
      expect(toAbsoluteColor("hsv", 0, 1, 1)).to.deep.equal([0, 100, 100]);
    });

    it("should denormalize XYZ values", () => {
      expect(toAbsoluteColor("xyz", 0.4339537281555441, 0.21267, 0.017753000927601188)).to.deep.equal([41.246, 21.267, 1.933]);
    });

    it("should denormalize LAB values", () => {
      expect(toAbsoluteColor("lab", 0.5, 0.6, 0.35)).to.deep.equal([50, 20, -30]);
    });

    it('should denormalize LCH values', () => {
      expect(toAbsoluteColor("lch", 0.7, 0.5, 0.3333333333333333)).to.deep.equal([70, 50, 120]);
    });

    it('should denormalize HWB values', () => {
      expect(toAbsoluteColor("hwb", 0.5, 0.5, 0.25)).to.deep.equal([180, 50, 25]);
    });

    it('should denormalize LMS values', () => {
      expect(toAbsoluteColor("lms", 0.7, 0.5, 0.3)).to.deep.equal([70, 50, 30]);
    });

    it('should denormalize OKLab values', () => {
      expect(toAbsoluteColor("oklab", 0.5, 0.5, 0.5)).to.deep.equal([50, 0.0, 0.0]);
    });

    it('should denormalize OKLCH values', () => {
      expect(toAbsoluteColor("oklch", 0.5, 0.5, 0.5)).to.deep.equal([50, 50, 180]);
    });

    it('should denormalize CMYK values', () => {
      expect(toAbsoluteColor("cmyk", 0.5, 0.4, 0.3, 0.2)).to.deep.equal([50, 40, 30, 20]);
    });

    it('should denormalize YUV values', () => {
      expect(toAbsoluteColor("yuv", 0.5, 0.5, 0.5)).to.deep.equal([0.5, 0, 0]);
    });
  });
});
