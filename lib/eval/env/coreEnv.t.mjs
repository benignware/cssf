import assert from "assert";
import evaluate from "../eval.mjs";

describe("eval", () => {
  describe("core", () => {
    it("should evaluate the expression", () => {
      assert.strictEqual(evaluate("calc(1 + 1)"), 2);
    });
  });
  
  describe("addition", () => {
    it("should evaluate addition", () => {
      assert.strictEqual(evaluate("calc(1 + 1)"), 2);
    });
  });

  describe('sibtraction', () => {
    it('should evaluate subtraction', () => {
      assert.strictEqual(evaluate('calc(1 - 1)'), 0);
    });
  });

  describe('multiplication', () => {
    it('should evaluate multiplication', () => {
      assert.strictEqual(evaluate('calc(2 * 2)'), 4);
    });
  });

  describe('division', () => {
    it('should evaluate division', () => {
      assert.strictEqual(evaluate('calc(4 / 2)'), 2);
    });
  });

  describe('min', () => {
    it('should evaluate min', () => {
      assert.strictEqual(evaluate('min(1, 2)'), 1);
    });
  });

  describe('max', () => {
    it('should evaluate max', () => {
      assert.strictEqual(evaluate('max(1, 2)'), 2);
    });
  });

  describe('clamp', () => {
    it('should evaluate clamp', () => {
      assert.strictEqual(evaluate('clamp(1, 2, 3)'), 2);
    });
  });

  describe('round', () => {
    it('should evaluate round', () => {
      assert.strictEqual(evaluate('round(1.5)'), 2);
    });
  });

  describe('log', () => {
    it('should evaluate log', () => {
      assert.strictEqual(evaluate('log(1)'), 0);
    });
  });

  describe('atan2', () => {
    it('should evaluate atan2', () => {
      assert.strictEqual(evaluate('atan2(1, 1)'), Math.atan2(1, 1));
    });
  });

  describe('pi', () => {
    it('should evaluate pi', () => {
      assert.strictEqual(evaluate('pi'), Math.PI);
    });
  });

  describe('Nan', () => {
    it('should evaluate Nan', () => {
      assert.strictEqual(evaluate('Nan'), NaN);
    });
  });

  describe('infinity', () => {
    it('should evaluate infinity', () => {
      assert.strictEqual(evaluate('infinity'), Infinity);
    });
  });

  describe('e', () => {
    it('should evaluate e', () => {
      assert.strictEqual(evaluate('e'), Math.E);
    });
  });

  describe('sin', () => {
    it('should evaluate sin', () => {
      assert.strictEqual(evaluate('sin(0)'), 0);
    });
  });
});