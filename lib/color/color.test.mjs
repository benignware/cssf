import assert from 'assert';
import color from './color.mjs';
import evaluate from '../eval/eval.mjs';
import chroma from 'chroma-js';

describe('color', function() {
  it('creates absolute color', function() {
    assert.equal(
      evaluate(color('srgb 1 0.5 1 / 1')),
      'color(srgb 1 0.5 1 / 1)'
    );
  });

  it('creates absolute color with legacy notation', function() {
    assert.equal(color('srgb 1, 0.5, 1 / 1'), 'color(srgb 1 0.5 1 / 1)');
  });

  it('creates relative color from rgba', function() {
    assert.equal(
      evaluate(color('from rgba(244 50 50 1) srgb r g b')),
      'color(srgb 0.9568627450980393 0.19607843137254902 0.19607843137254902)'
    );
  });
  
  it('creates relative color from rgba with legacy notation', function() {
    assert.equal(
      evaluate(color('from rgba(244, 50, 50, 1) srgb r g b')),
      'color(srgb 0.9568627450980393 0.19607843137254902 0.19607843137254902)'
    );
  });

  it('creates relative color from hex', () => {
    assert.strictEqual(evaluate(color('from #123ec7 r g b')), 'color(srgb 18 62 199)');
  });

  it('creates relative color from color name', () => {
    assert.strictEqual(evaluate(color('from red r g b')), 'color(srgb 255 0 0)');
  });

  it('creates relative color from rgb with computed values', function() {
    assert.equal(
      evaluate(color('from rgb(244, 50, 50) srgb calc(r * 0.5) calc(g * 0.5) calc(b * 0.5)')),
      'color(srgb 0.47843137254901963 0.09803921568627451 0.09803921568627451)'
    );
  });

  it('creates relative color and overrides some values', function() {
    assert.equal(
      evaluate(color('from rgba(244, 50, 50, 1) srgb 0.5 g 0.3')),
      'color(srgb 0.5 0.19607843137254902 0.3)'
    );
  });

  it('creates relative color and overrides all values', function() {
    assert.equal(
      evaluate(color('from rgba(244, 50, 50, 1) srgb 0.5 0.3 0.1 / a')),
      'color(srgb 0.5 0.3 0.1 / 1)'
    );
  });

  xit('creates relative color from hsl', function() {
    assert.equal(
      evaluate(color('from hsl(0 100% 50%) srgb r g b')),
      'color(srgb 1 0 0)'
    );
  });

  return;

  it('parses arguments when provided in space/slash notation', function() {
    assert.equal(color('rgb 255 0 0 / 1'), 'rgba(255, 0, 0, 1)');
  });

  it('parses arguments when relative color is provided in space/slash notation', function() {
    // assert.equal(color('from hsl(0 100% 50%) srgb 0.749938 0 0.609579 / 0.5'), 'rgba(255, 0, 0, 1)');
    assert.equal(color('from rgba(230, 123, 43, 0.2) srgb 0.749938 0 0.609579 / 0.5'), 'rgba(255, 0, 0, 1)');
  });
});
