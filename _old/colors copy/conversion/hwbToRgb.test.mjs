import { expect } from "chai";
import getEval from "../../../lib/eval/getEval.mjs";
import { hwbToRgb } from "./hwbToRgb.mjs";

describe("hwbToRgb", () => {
  beforeEach(() => {
    global.e = getEval();
  });

  it('should convert hwb to rgb', () => {
    expect(hwbToRgb(208, 0.14, 0.42).map(c => e(`calc(${c})`))).to.deepCloseTo([36, 97, 149], 1);
  });
});
