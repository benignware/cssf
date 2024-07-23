import assert from 'assert';
import chroma from 'chroma-js';
import evaluate from '../eval/eval.mjs';
import { ifelse, gt, divide, add, rgba, hsla } from '../index.mjs';
import luminance from './luminance.mjs';
import { toPrecision, parseFn } from '../utils.mjs';

// Brightness
// function getContrastYIQ(hexcolor){

//   var r = parseInt(hexcolor.substr(1,2),16);
//   var g = parseInt(hexcolor.substr(3,2),16);
//   var b = parseInt(hexcolor.substr(5,2),16);
//   var yiq = ((r*299)+(g*587)+(b*114))/1000;

//   return (yiq >= 128) ? 'dark-color' : 'light-color';   }

export function contrastRatio(rgb1, rgb2) {
  const lum1 = luminance(rgb1);
  const lum2 = luminance(rgb2);
  const ratio = ifelse(
    gt(lum1, lum2),
    divide(add(lum1, 0.05), add(lum2, 0.05)),
    divide(add(lum2, 0.05), add(lum1, 0.05))
  );

  return ratio;
}

export function contrastColor(background, light, dark) {
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

describe('luminance', () => {
  it('retrieves luminance of rgb color', () => {
    const rgb = 'rgb(25, 255, 255)';
    const color = chroma(rgb);

    const lum = luminance(rgb);

    assert.strictEqual(
      toPrecision(evaluate(lum)),
      toPrecision(color.luminance())
    );
  });

  it('retrieves luminance of rgb dynamically', () => {
    const rgb = 'rgb(255, 255, 255)';
    const color = chroma(rgb);
    const [r, g, b] = color.rgb();

    const lum = luminance(`rgb(var(--r), var(--g), var(--b))`);

    const actual = evaluate(lum, {
      '--r': r,
      '--g': g,
      '--b': b,
    });

    assert.strictEqual(actual.toFixed(3), color.luminance().toFixed(3));
  });

  it('can be derived a contrast ratio between colors by their luminance', () => {
    const rgb1 = 'rgb(25, 255, 255)';
    const rgb2 = 'rgb(255, 55, 200)';

    const expected = chroma.contrast(rgb1, rgb2);

    const ratio = contrastRatio(rgb1, rgb2);

    assert.strictEqual(evaluate(ratio).toFixed(3), expected.toFixed(3));
  });

  it('can be derived a contrast ratio between colors by their luminance dynamically', () => {
    const rgb1 = 'rgb(25, 255, 255)';
    const rgb2 = 'rgb(255, 55, 200)';

    const expected = chroma.contrast(rgb1, rgb2);

    const [r, g, b] = chroma(rgb1).rgb();
    const ratio = contrastRatio(`rgb(var(--r), var(--g), var(--b))`, rgb2);

    assert.strictEqual(
      evaluate(ratio, {
        '--r': r,
        '--g': g,
        '--b': b,
      }).toFixed(3),
      expected.toFixed(3)
    );
  });

  it('can be derived a contrast color from contrast ratio based on luminance', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb1 = 'rgb(25, 12, 32)';

    assert.strictEqual(evaluate(contrastColor(rgb1, light, dark)), light);

    const rgb2 = 'rgb(245, 188, 178)';

    assert.strictEqual(evaluate(contrastColor(rgb2, light, dark)), dark);
  });

  xit('can be derived a contrast color from contrast ratio based on luminance dynamically', () => {
    const light = 'rgba(255, 255, 255, 1)';
    const dark = 'rgba(0, 0, 0, 1)';

    const rgb = 'rgb(25, 12, 32)';
    const [r, g, b] = chroma(rgb).rgb();

    assert.strictEqual(
      evaluate(
        contrastColor(`rgb(var(--r), var(--g), var(--b))`, light, dark),
        {
          '--r': r,
          '--g': g,
          '--b': b,
        }
      ),
      light
    );
  });
});
