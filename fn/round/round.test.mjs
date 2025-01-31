import { expect } from 'chai';
import { getEval } from '../../utils/eval/getEval.mjs';
import { round } from './round.mjs';

const e = getEval();

xdescribe('round', () => {
  it('rounds to nearest integer when input is lt .5 (round)', () => {
    expect(e(round(3.45))).to.equal(Math.round(3));
  });

  it('rounds to nearest integer when input is gte .5 (round)', () => {
    expect(e(round(3.65))).to.equal(Math.round(4));
  });

  it('rounds down to next smaller integer when input is lt .5 (floor)', () => {
    expect(e(round('down', 3.1))).to.equal(Math.floor(3));
  });

  it('rounds down to next smaller integer when input is gte .5 (floor)', () => {
    expect(e(round('down', 3.6))).to.equal(Math.floor(3));
  });

  it('rounds up to next larger integer when input is lt .5 (ceil)', () => {
    expect(e(round('up', 2.1))).to.equal(Math.ceil(3));
  });

  it('rounds up to next larger integer when input is gte .5 (ceil)', () => {
    expect(e(round('up', 2.99999))).to.equal(Math.ceil(3));
  });

  return;

  it('rounds up to next larger integer (ceil)', () => {
    const a = 3.1111;

    expect(e(round('up', a))).to.equal(Math.ceil(a));
  });

  it('rounds to next smaller integer (zero-safe, floor)', () => {
    const a = 2.66;

    expect(e(round('down', a))).to.equal(Math.floor(a));
  });

  it('rounds to next larger integer (zero-safe, ceil)', () => {
    const a = 2.66;

    expect(e(round('up', a))).to.equal(Math.ceil(a));
  });

  it('rounds negative value to next smaller integer (floor)', () => {
    const a = -2.99999;

    expect(e(round('down', a))).to.equal(Math.floor(a));
  });

  it('rounds negative value to next smaller integer (zero-safe, floor)', () => {
    const a = -3.1111;

    expect(e(round('down', a))).to.equal(Math.floor(a));
  });

  it('rounds negative value to next larger integer (ceil)', () => {
    const a = -3.1111;

    expect(e(round('up', a))).to.equal(Math.ceil(a));
  });

  it('rounds negative value to next larger integer (zero-safe)', () => {
    const a = -2.99999;

    expect(e(round('up', a))).to.equal(Math.ceil(a));
  });

  it('rounds small value to nearest integer', () => {
    const x = 0.53137254901960786;

    expect(e(round('up', x))).to.equal(Math.ceil(x));
  });

  it('rounds small value up (ceil)', () => {
    const x = 0.53137254901960786;

    expect(e(round('up', x))).to.equal(Math.ceil(x));
  });

  it('rounds small value down (floor)', () => {
    const x = 0.43137254901960786;

    expect(e(round('down', x))).to.equal(Math.floor(x));
  });

});
