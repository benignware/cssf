import { hypot } from './hypot.mjs';
import { getEval } from '../../utils/eval/getEval.mjs';
import { expect } from 'chai';

const e = getEval();

xdescribe('hypot', () => {
  it('evaluates hypot function', () => {
    expect(e(`calc(${hypot(3, 4)})`)).to.be.closeTo(5, 0.01);
  });

  it('evaluates hypot function', () => {
    expect(e(`calc(${hypot('3px', '4px')})`)).to.equal('5px');
  });

  return;

  it('evaluates hypot function', () => {
    expect(e(hypot('3px', '4px'))).to.be.closeToUnit('5px');
  });

  it('evaluates hypot function with multiple values', () => {
    expect(e(hypot('3px', '4px', '5px'))).to.be.closeToUnit('7.0710678118654755px');
  });

  it('computes hypot function float result correctly up to two digits', () => {
    expect(e(hypot('3.1px', '4.1px'))).to.be.closeToUnit('5.3px');
  });

  xit('throws error when hypot function is passed values with different units', () => {
    expect(() => e(hypot('3px', '4em'))).to.throw('All values must have the same unit');
  });
});