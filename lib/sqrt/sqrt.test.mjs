import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import sqrt from './sqrt.mjs';
import { toPrecision } from '../utils.mjs';

xdescribe('sqrt', () => {
  it('evaluates square root function up to 2 digits correctly', () => {
    assert.strictEqual(toPrecision(evaluate(sqrt(16))), 4);
  });
});