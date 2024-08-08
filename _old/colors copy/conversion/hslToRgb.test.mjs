import { expect } from 'chai';
import getEval from "../../../lib/eval/getEval.mjs";
import { hslToRgb } from './hslToRgb.mjs';

describe('hslToRgb', () => {
  beforeEach(() => {
    global.e = getEval();
  });

  it('should convert hsl to rgb', () => {
    expect(hslToRgb(180, 0.5, 0.5).map(c => e(`calc(${c})`))).to.deepCloseTo([64, 191, 191], 0.5);
  });
});