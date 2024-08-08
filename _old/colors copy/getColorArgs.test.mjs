import { expect } from "chai";
import { getColorArgs } from "./getColorArgs.mjs";

describe('getColorArgs', () => {
  it('should extract arguments from an absolute color', () => {
    expect(getColorArgs('1 0 0 / 1')).to.deep.equal({ c1: 1, c2: 0, c3: 0, a: 1 });
  });

  it('should extract arguments from an absolute color with defined colorspace', () => {
    expect(getColorArgs('srgb 1 0 0 / 1')).to.deep.equal({ c1: 1, c2: 0, c3: 0, a: 1, colorspace: 'srgb' });
  });

  it('should extract arguments from a relative color', () => {
    expect(getColorArgs('from rgba(255 0 0) 1 0 0 / 1')).to.deep.equal({
      from: 'rgba(255 0 0)',
      c1: 1,
      c2: 0,
      c3: 0,
      a: 1, 
    });
  });

  it('should generate array from color components', () => {
    expect([...getColorArgs('1 0 0 / 1')]).to.deep.equal([1, 0, 0, 1]);
  });
});