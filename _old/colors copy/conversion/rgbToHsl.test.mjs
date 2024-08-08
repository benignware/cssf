import { expect } from 'chai';
import getEval from "../../../lib/eval/getEval.mjs";
import { rgbToHsl } from './rgbToHsl.mjs';

describe('rgbToHsl', () => {
  beforeEach(() => {
    global.e = getEval();
  });

  it('should convert rgb to hsl', () => {
    it('should convert hsl to rgb', () => {
      expect(rgbToHsl(64, 191, 191).map(c => e(`calc(${c})`))).to.deepCloseTo([180, 0.5, 0.5], 0.01);
    });
  });
});