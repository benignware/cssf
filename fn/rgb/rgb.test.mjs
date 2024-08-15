import { expect } from "chai";
import { getEval } from "../../utils/eval/getEval.mjs";
import { rgb } from "./rgb.mjs";

const e = getEval({ rgb });

describe('rgb', () => {
  it('should resolve rgb color from hex', () => {
    expect(e(`calc(${rgb('from #ff0000 r g b')})`)).to.equal('rgb(255, 0, 0)');
  });

  it('should resolve rgb color from keyword', () => {
    expect(e(`calc(${rgb('from blue r g b')})`)).to.equal('rgb(0, 0, 255)');
  });

  it('should resolve rgb color from rgb', () => {
    expect(e(`calc(${rgb('from rgb(0, 0, 255) r g b')})`)).to.equal('rgb(0, 0, 255)');
  });

  it('should resolve rgb color from dynamic rgb', () => {
    expect(e(`calc(${rgb('from rgb(var(--r), var(--g), var(--b)) r g b')})`, {
      '--r': 0,
      '--g': 0,
      '--b': 255,
    })).to.equal('rgb(0, 0, 255)');
  });
});