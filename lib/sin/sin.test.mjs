import assert from 'assert';
import sin from './sin.mjs';
import evaluate from '../eval/eval.mjs';
import { toPrecision } from '../utils.mjs';

describe('sin', () => {
  it('should return 0 when the input is 0', () => {
    assert.strictEqual(evaluate(`sin(0)`), 0);
  });

  it('should return 1 when the input is π/2', () => {
    assert.strictEqual(evaluate(`sin(pi / 2)`), 1);
  });

  it('should return 0 when the input is π', () => {
    assert.strictEqual(evaluate(`sin(pi / 2)`), Math.sin(Math.PI / 2));
  });

  it('should return -1 when the input is 3π/2', () => {
    assert.strictEqual(evaluate(`sin(3 * pi / 2)`), -1);
  });

  it('should return sine for dynamic input', () => {
    assert.strictEqual(evaluate(`sin(var(--x)`, {
      '--x': Math.PI / 2
    }), 1);
  });
});