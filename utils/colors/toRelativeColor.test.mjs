import { expect } from "chai";
import { toRelativeColor } from "./toRelativeColor.mjs";

describe("Color Normalizations Functions", () => {
  describe('toRelativeColor', () => {
    it("should normalize RGB values", () => {
      expect(toRelativeColor("rgb", 255, 0, 0)).to.deep.equal([1, 0, 0]);
    });

    it("should normalize HSL values", () => {
      expect(toRelativeColor("hsl", 360, 100, 50)).to.deep.equal([0, 1, 0.5]);
    });

    it("should normalize HSV values", () => {
      expect(toRelativeColor("hsv", 360, 100, 100)).to.deep.equal([0, 1, 1]);
    });

    it("should normalize XYZ values", () => {
      expect(toRelativeColor("xyz", 41.246, 21.267, 1.933)).to.deep.equal([0.4339537281555441, 0.21267, 0.017753000927601188]);
    });

    it("should normalize LAB values", () => {
      expect(toRelativeColor("lab", 50, 20, -30)).to.deep.equal([0.5, 0.6, 0.35]);
    });

    it('should normalize LCH values', () => {
      expect(toRelativeColor("lch", 70, 50, 120)).to.deep.equal([0.7, 0.5, 0.3333333333333333]);
    });

    it('should normalize LCH values with hue > 360', () => {
      expect(toRelativeColor("lch", 70, 50, 480)).to.deep.equal([0.7, 0.5, 0.3333333333333333]);
    });

    it('should normalize LCH values with hue < 0', () => {
      expect(toRelativeColor("lch", 70, 50, -240)).to.deep.equal([0.7, 0.5, 0.3333333333333333]);
    });

    it('should normalize HWB values', () => {
      expect(toRelativeColor("hwb", 180, 50, 25)).to.deep.equal([0.5, 0.5, 0.25]);
    });

    it('should normalize LMS values', () => {
      expect(toRelativeColor("lms", 70, 50, 30)).to.deep.equal([0.7, 0.5, 0.3]);
    });

    it('should normalize OKLab values', () => {
      expect(toRelativeColor("oklab", 50, 0.5, 0.5)).to.deep.equal([0.5, 1.0, 1.0]);
    });

    it('should normalize OKLCH values', () => {
      expect(toRelativeColor("oklch", 50, 50, 180)).to.deep.equal([0.5, 0.5, 0.5]);
    });
    
    it('should normalize CMYK values', () => {
      expect(toRelativeColor("cmyk", 50, 40, 30, 20)).to.deep.equal([0.5, 0.4, 0.3, 0.2]);
    });

    it('should normalize YUV values', () => {
      expect(toRelativeColor("yuv", 0.5, 0, 0)).to.deep.equal([0.5, 0.5, 0.5]);
    });
  });
});
