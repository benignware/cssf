import assert from 'assert';
import hypot from './hypot.mjs';
import evaluate from '../eval/eval.mjs';
import { toPrecision } from '../utils.mjs';

describe('hypot', () => {
  it('evaluates hypot function', () => {
    assert.strictEqual(toPrecision(evaluate(hypot('3px', '4px'))), '5px');
  });

  it('evaluates hypot function with multiple values', () => {
    assert.strictEqual(toPrecision(evaluate(hypot('3em', '4em'))), '5em');
  });

  it('computes hypot function float result correctly up to two dogits', () => {
    assert.strictEqual(toPrecision(evaluate(hypot('3px', '4px', '5px'))), '7.07px');
  });

  xit('throws error when hypot function is passed values with different units', () => {
    assert.throws(() => {
      evaluate(hypot('3px', '4em'));
    }, /All values must have the same units/);
  });
});