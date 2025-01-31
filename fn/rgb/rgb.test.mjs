import { expect } from "chai";
import { getEval } from "../../utils/eval/getEval.mjs";
import { rgb, rgba } from "./rgb.mjs";

const e = getEval({ rgb, rgba });

describe('rgb', () => {
  it('should resolve rgb color from hex', () => {
    expect(e(rgb('from #ff0000 r g b'))).to.be.closeToUnit('rgb(255, 0, 0)');
  });

  it('should resolve rgba color from hex', () => {
    expect(e(rgb('from #ff0000 r g b / 0.5'))).to.be.closeToUnit('rgb(255, 0, 0, 0.5)');
  });

  it('should resolve rgb color from keyword', () => {
    expect(e(rgb('from blue r g b'))).to.be.closeToUnit('rgb(0, 0, 255)');
  });

  it('should resolve rgba color from keyword', () => {
    expect(e(rgb('from blue r g b / 0.5'))).to.be.closeToUnit('rgb(0, 0, 255, 0.5)');
  });

  it('should resolve rgb color from rgb', () => {
    expect(e(rgb('from rgb(0, 0, 255) r g b'))).to.be.closeToUnit('rgb(0, 0, 255)');
  });

  it('should resolve rgba color from rgb', () => {
    expect(e(rgba('from rgb(0, 0, 255) r g b / 0.5'))).to.be.closeToUnit('rgba(0, 0, 255, 0.5)');
  });

  xit('should resolve rgba color from rgba', () => {
    expect(e(rgba('from rgba(0, 0, 255, 0.5) r g b / a'))).to.be.closeToUnit('rgba(0, 0, 255, 0.5)');
  });

  it('should resolve rgb color from dynamic rgb', () => {
    expect(e(rgb('from rgb(var(--r), var(--g), var(--b)) r g b'), {
      '--r': 0,
      '--g': 0,
      '--b': 255,
    })).to.be.closeToUnit('rgb(0, 0, 255)');
  });
});