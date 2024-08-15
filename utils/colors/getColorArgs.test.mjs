import { expect } from "chai";
import { getEval } from "../eval/getEval.mjs";
import { getColorArgs } from "./getColorArgs.mjs";

const e = getEval();

describe('getColorArgs', () => {
  it('should extract arguments from an absolute color', () => {
    expect(getColorArgs('1 0 0 / 1')).to.deep.equal({ c1: 1, c2: 0, c3: 0, a: 1 });
  });


  it('should extract arguments from an absolute color in legacy syntax', () => {
    expect(getColorArgs('255, 0, 0, 0.5')).to.deep.equal({ c1: 255, c2: 0, c3: 0, a: 0.5 });
  });

  it('should parse legacy syntax without whitespace', () => {
    expect(getColorArgs('255,0,0,0.5')).to.deep.equal({ c1: 255, c2: 0, c3: 0, a: 0.5 });
  });

  it('should extract arguments from an absolute color with defined colorspace', () => {
    expect(getColorArgs('srgb 1 0 0 / 1')).to.deep.equal({ c1: 1, c2: 0, c3: 0, a: 1, colorSpace: 'srgb' });
  });

  it('should generate array from color components', () => {
    expect([...getColorArgs('1 0 0 / 1')]).to.deep.equal([1, 0, 0, 1]);
  });

  it('should generate array from color components in legacy syntax', () => {
    expect([...getColorArgs('0,0,0')]).to.deep.equal([0, 0, 0]);
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

  it('should extract a relative color with colorspace arg', () => {
    expect(getColorArgs('from color(srgb 1 0 0) 1 0 0 / 1')).to.deep.equal({
      from: 'color(srgb 1 0 0)',
      c1: 1,
      c2: 0,
      c3: 0,
      a: 1, 
    });
  });

  it('should extract args with relative color and colorspace arg', () => {
    expect(getColorArgs('from color(srgb 1 0 0) xyz 1 0 0 / 1')).to.deep.equal({
      from: 'color(srgb 1 0 0)',
      colorSpace: 'xyz',
      c1: 1,
      c2: 0,
      c3: 0,
      a: 1, 
    });
  });

  it('should extract args with relative color and colorspace identifier with number', () => {
    expect(getColorArgs('from color(srgb 1 0 0) xyz-d50 x y z')).to.deep.equal({
      from: 'color(srgb 1 0 0)',
      colorSpace: 'xyz-d50',
      c1: 'x',
      c2: 'y',
      c3: 'z'
    });
  });

  return;

  it('should extract arguments with a relative hsl color', () => {
    expect(getColorArgs('from hsl(240deg 100% 50%) h s l / a')).to.deep.equal({
      from: 'hsl(240deg 100% 50%)',
      c1: 'h',
      c2: 's',
      c3: 'l',
      a: 'a',
    });
  });

  it('should extract arguments with units from an absolute color', () => {
    expect(getColorArgs('240deg 100% 50%')).to.deep.equal({
      c1: '240deg',
      c2: '100%',
      c3: '50%'
    });
  });

  return;

  it('should correctly extract origin color with variables', () => {
    expect(getColorArgs('from rgba(var(--r) var(--g) var(--b)) 1 0 0 / 1')).to.deep.equal({
      from: 'rgba(var(--r) var(--g) var(--b))',
      c1: 1,
      c2: 0,
      c3: 0,
      a: 1, 
    });
  });
});