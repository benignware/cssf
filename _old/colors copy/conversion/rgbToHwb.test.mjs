import { expect } from 'chai';
import getEval from "../../../lib/eval/getEval.mjs";
import { rgbToHwb } from './rgbToHwb.mjs';

describe('rgbToHwb', () => {
  beforeEach(() => {
    global.e = getEval();
  });

  it('should convert rgb to hwb', () => {
    it('should convert rgb to hwb', () => {
      expect(rgbToHwb(64, 191, 191).map(c => e(`calc(${c})`))).to.deepCloseTo([180, 0.5, 0.25], 0.01);
    });
  });
});