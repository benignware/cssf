import assert from 'assert';
import evaluate from '../eval/eval.mjs';
import abs from './abs.mjs';

describe('abs', () => {
  it('returns positive value of a negative number', () => {
    assert.strictEqual(evaluate(`calc(${abs(-324)})`), 324);
  });

  it('returns positive value of a positive number', () => {
    assert.strictEqual(evaluate(`calc(${abs(324)})`), 324);
  });

  it('returns positive value of a negative dimension', () => {
    assert.strictEqual(evaluate(`calc(${abs('-342px')})`), '342px');
  });

  it('returns positive value of a positive dimension', () => {
    assert.strictEqual(evaluate(`calc(${abs('-342px')})`), '342px');
  });
});
