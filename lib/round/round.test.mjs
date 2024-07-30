import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import round from './round.mjs';

describe('round', () => {
  it('rounds value up', () => {
    const x = 0.53137254901960786;

    assert.strictEqual(evaluate(round(x)), Math.round(x));
  });

  it('rounds value down', () => {
    const x = 0.43137254901960786;

    assert.strictEqual(evaluate(round(x)), Math.round(x));
  });

  it('rounds to next smaller integer', () => {
    const a = 3.1111;

    assert.strictEqual(evaluate(round('down', a)), Math.floor(a));
  });

  xit('rounds to next smaller integer', () => {
    const a = 3.1111;

    assert.strictEqual(evaluate(round('down', a)), Math.floor(a));
  });

  xit('rounds to next smaller integer (zero-safe)', () => {
    const a = 2.66;

    assert.strictEqual(evaluate(round('down', a)), Math.floor(a));
  });

  it('rounds negative value to next smaller integer', () => {
    const a = -2.99999;

    assert.strictEqual(evaluate(round('down', a)), Math.floor(a));
  });

  xit('rounds negative value to next smaller integer', () => {
    const a = -3.1111;

    assert.strictEqual(evaluate(round('down', a)), Math.floor(a));
  });

  it('rounds to next larger integer', () => {
    const a = 2.99999;

    assert.strictEqual(evaluate(round('up', a)), Math.ceil(a));
  });

  it('rounds to next larger integer (zero-safe)', () => {
    const a = 2.66;

    assert.strictEqual(evaluate(round('up', a)), Math.ceil(a));
  });

  xit('rounds value to next larger integer', () => {
    const a = 3.1111;

    assert.strictEqual(evaluate(round('up', a)), Math.ceil(a));
  });

  xit('rounds negative value to next larger integer', () => {
    const a = -3.1111;

    assert.strictEqual(evaluate(round('up', a)), Math.ceil(a));
  });

  it('rounds negative value to next larger integer', () => {
    const a = -2.99999;

    assert.strictEqual(evaluate(round('up', a)), Math.ceil(a));
  });
});

export {};
