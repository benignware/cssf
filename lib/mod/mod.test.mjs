import assert from 'assert';
import getEval from '../eval/getEval.mjs';
import mod from './mod.mjs';

describe('mod', () => {
  beforeEach(() => {
    global.evaluate = getEval({
      mod
    });
  });

  it('should return the remainder of two numbers', () => {
    assert.equal(evaluate('mod(5, 2)'), 1);
  });

  xit('should return the remainder of two numbers with units', () => {
    assert.equal(evaluate('mod(5px, 2px)'), '1px');
  });
});