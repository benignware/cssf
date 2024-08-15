import assert from 'assert';
import { getEval } from '../../utils/eval/getEval.mjs';
import { ifelse } from './ifelse.mjs';

const e = getEval();

describe('ifelse', () => {
  it('es truthy condition', () => {
    assert.strictEqual(e(`calc(${ifelse(1, 1, 0)})`), 1);
  });

  it('es falsy condition', () => {
    assert.strictEqual(e(`calc(${ifelse(0, 1, 0)})`), 0);
  });

  xit('es truthy condition with infinity', () => {
    assert.strictEqual(e(`calc(${ifelse('1 / infinity', 1, 0)})`), 1);
  });

  it('es a falsy condition with negative infinity', () => {
    assert.strictEqual(e(`calc(${ifelse('1 / -infinity', 0, 0)})`), 0);
  });

  it('resolves a condition to zero', () => {
    assert.strictEqual(e(`calc(${ifelse(1, 0, 1)})`), 0);
  });

  xit('resolves a condition to negative zero', () => {
    assert.strictEqual(e(`calc(${ifelse(1, -0, 1)})`), -0);
  });
});
