import evaluate from '../eval/eval.mjs';
import chroma from 'chroma-js';
import assert from 'assert';
import { ifelse, lt, gt, divide, add, hsla, rgba } from '../index.mjs';
import colorBrightness from './colorBrightness.mjs';
import { parseFn } from '../utils.mjs';

function contrastColorA(background, light, dark) {
  const br = colorBrightness(background);
  const colorFn =
    light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;

  light = colorFn(light);
  dark = colorFn(dark);

  const [, ...lightArgs] = parseFn(light);
  const [, ...darkArgs] = parseFn(dark);

  const args = Array.from(Array(3).keys()).map((index) =>
    ifelse(lt(br, 0.5), lightArgs[index], darkArgs[index])
  );

  return colorFn(...args);
}

function contrastColorB(background, light, dark) {
  const ratio1 = contrastRatio(background, light);
  const ratio2 = contrastRatio(background, dark);
  const colorFn =
    light.startsWith('hsl') && dark.startsWith('hsl') ? hsla : rgba;

  light = colorFn(light);
  dark = colorFn(dark);

  const [, ...lightArgs] = parseFn(light);
  const [, ...darkArgs] = parseFn(dark);

  const args = Array.from(Array(3).keys()).map((index) =>
    ifelse(gt(ratio1, ratio2), lightArgs[index], darkArgs[index])
  );

  return colorFn(...args);
}

function contrastRatio(rgb1, rgb2) {
  const lum1 = colorBrightness(rgb1);
  const lum2 = colorBrightness(rgb2);
  const ratio = ifelse(
    gt(lum1, lum2),
    divide(add(lum1, 0.05), add(lum2, 0.05)),
    divide(add(lum2, 0.05), add(lum1, 0.05))
  );

  return ratio;
}

xdescribe('colorBrightness', () => {
  it('retrieves colorBrightness for rgb color', () => {
    const rgb = `rgba(127.5, 127.5, 127.5)`;
    const br = colorBrightness(rgb);

    assert.strictEqual(evaluate(br), 0.5);
  });

  xit('can be derived a contrast color based on colorBrightness', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb1 = 'rgb(25, 12, 32)';

    assert.strictEqual(evaluate(contrastColorA(rgb1, light, dark)), light);

    const rgb2 = 'rgb(245, 188, 178)';

    assert.strictEqual(evaluate(contrastColorA(rgb2, light, dark)), dark);
  });

  xit('can be derived a contrast color from contrast ratio based on colorBrightness', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb1 = 'rgb(25, 12, 32)';

    assert.strictEqual(evaluate(contrastColorB(rgb1, light, dark)), light);

    const rgb2 = 'rgb(245, 188, 178)';

    assert.strictEqual(evaluate(contrastColorB(rgb2, light, dark)), dark);
  });

  xit('can be derived a contrast color from contrast ratio based on colorBrightness dynamically', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb1 = 'rgb(25, 12, 32)';
    const [r1, g1, b1] = chroma(rgb1).rgb();

    assert.strictEqual(
      evaluate(
        contrastColorB(`rgb(var(--r), var(--g), var(--b))`, light, dark),
        {
          r: r1,
          g: g1,
          b: b1,
        }
      ),
      light
    );

    const rgb2 = 'rgb(245, 188, 178)';
    const [r2, g2, b2] = chroma(rgb2).rgb();

    assert.strictEqual(
      evaluate(
        contrastColorB(`rgb(var(--r), var(--g), var(--b))`, light, dark),
        {
          r: r2,
          g: g2,
          b: b2,
        }
      ),
      dark
    );
  });
});
