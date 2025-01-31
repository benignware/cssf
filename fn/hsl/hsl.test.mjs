import { expect } from "chai";
import { getEval, ENV_2022 as EVAL_ENV_2022 } from "../../utils/eval/getEval.mjs";
import { ENV_2022 } from '../../utils/render/getRender.mjs';
import { hsl } from "./hsl.mjs";

const e = getEval({
  // ...ENV_2022,
  hsl
},
   // EVAL_ENV_2022
);

describe('hsl', () => {
  it('should resolve hsl color from hex', () => {
    expect(e(hsl('from #ff0000 h s l'))).to.be.closeToUnit('hsl(0deg, 100%, 50%)');
  });

  it('should resolve hsl color from keyword', () => {
    expect(e(hsl('from blue h s l'))).to.be.closeToUnit('hsl(240deg, 100%, 50%)');
  });

  it('should resolve hsl color from hsl', () => {
    expect(e(hsl('from hsl(0, 100%, 50%) h s l'))).to.be.closeToUnit('hsl(0deg, 100%, 50%)');
  });

  it('should resolve hsl color from rgb', () => {
    expect(e(hsl('from rgb(0, 0, 255) h s l'))).to.be.closeToUnit('hsl(240deg, 100%, 50%)');
  });

  it('should resolve hsl color from dynamic rgb', () => {
    expect(e(hsl('from rgb(var(--r), var(--g), var(--b)) h s l'), {
      '--r': 0,
      '--g': 0,
      '--b': 255,
    })).to.be.closeToUnit('hsl(240deg, 100%, 50%)');
  });

  it('should resolve hsl color from rgb by computed values', () => {
    expect(e(hsl('from rgb(0, 0, 255) calc(h * 0.5) calc(s * 0.5) calc(l * 0.5)'))).to.be.closeToUnit('hsl(120deg, 50%, 25%)');
  });
});