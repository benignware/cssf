# CSSF

Use today's css now. CSS pre-processor ecosystem with focus on runtime computation

CSSF enhances css by a set of functions that take care of your dynamic values at run-time, such as color shade or contrast and lots more. Did you even know that you can actually use conditions in calc? CSSF breaks it down to arithmetics. 

## Conditions

<!-- Example -->
```html
<style id="example1-style"></style>
<h2>Hello World</h2>
```

```mjs
import { cssf } from 'cssf';

const css = cssf`
  h2 {
    --is-big: 0;
    color: red;
    font-size: calc(ifelse(var(--is-big), 70px, 10px));
  }
`;

const style = document.querySelector('#example1-style');

style.textContent = css;
```

## Color contrast

<!-- Example -->
```html
<style id="example2-style"></style>
<h2 class="text-bg-light">Light Background</h2>
<h2 class="text-bg-dark">Dark Background</h2>
```

```mjs
import { cssf } from 'cssf';

const css = cssf`
  [class*="text-bg-"] {
    background-color: rgb(var(--bg-r), var(--bg-g), var(--bg-b));
    color: color-contrast(rgb(var(--bg-r), var(--bg-g), var(--bg-b)) vs #fff, #000);
    -webkit-transform: translateZ(0);
  }

`;

const style = document.querySelector('#example2-style');

style.textContent = css;
```

```css
.text-bg-light {
  --bg-r: 255;
  --bg-g: 255;
  --bg-b: 128;
}

.text-bg-dark {
  --bg-r: 0;
  --bg-g: 128;
  --bg-b: 0;
}
```

----




<!-- Example -->
```html
<h2>Supports color-mix?</h2>
```

```css
@supports (color: color-mix(in srgb, #000, #fff)) {
  h2 {
    color: green;
  }
}

@supports not (color: color-mix(in srgb, #000, #fff)) {
  h2 {
    color: red;
  }
}
```

<!-- Example -->
```html
<style id="example-color-mix-style"></style>
<h2 class="bg-primary">Primary</h2>
<h2 class="bg-primary light">Primary Light</h2>
```
```mjs
import { cssf } from 'cssf';
// color: colorMix(in srgb, rgba(var(--bg-primary-r), var(--bg-primary-g), var(--bg-primary-b)) 50%, rgba(255, 255, 255, 1));
const css = cssf`
  .bg-primary {
    --bg-primary-r: 255;
    --bg-primary-g: 0;
    --bg-primary-b: 0;
    --bg-primary: rgba(var(--bg-primary-r), var(--bg-primary-g), var(--bg-primary-b));
    background-color: var(--bg-primary);
  }

  .bg-primary.light {
    --bg-primary-light--w: 0.5;
    background-color: color-mix(
      in srgb,
      rgba(var(--bg-primary-r), var(--bg-primary-g), var(--bg-primary-b)) var(--bg-primary-light--w),
      rgba(255, 255, 255, 1)
    );
    /*background-color: mix(rgba(var(--bg-primary-r), var(--bg-primary-g), var(--bg-primary-b)), rgba(255, 255, 255, 1), 0.5);*/
    /*background-color: rgba(127.5, 127.5, 127.5, 1);*/
  }
`;

const style = document.querySelector('#example-color-mix-style');

console.log('css: ', css);

style.textContent = css;
```




## TODO:

* Context-aware unit computations, e.g. width: 100%;
* @support rule integration





Have a look at the code and the tests.
We want to add a new requirement to the code. It is defined in the very first test which is failing, because the input option isn't processed yet by the code. So, this is going to be a challenge. Let me explain... So, have a look at the output option. The output option allows us to output a color based on some knowledge about the environment rather than having actually registered the corresponding color functions. So, for instance, we want to define a hsv function to extend the native environment for which we assume it has a hsl color function which is capable of all we need. Since we have the hsvToHsl and hslToHsv conversions, we can return a computable color, based on this conversion. 
Now, we want to do a similar thing to the input of the relative color by adding an input option which should allow us to effectively emulate a color-space respectively color-function. 

Some steps have been done, but it's not quite working.

Make sure, you do not break it. You may refine the last test case, but don't touch the others.
Please note the comments in the test file.
Full code of getColorFn.mjs, please. Do not only provide the changed exoported function.




## References

https://css-tricks.com/a-complete-guide-to-calc-in-css/

https://css-tricks.com/using-absolute-value-sign-rounding-and-modulo-in-css-today/

https://css-tricks.com/css-variables-calc-rgb-enforcing-high-contrast-colors/

https://css-tricks.com/how-supports-works/

https://supportscss.dev/

https://medium.com/hypersphere-codes/randomness-in-css-b55a0845c8dd

https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl

https://www.smashingmagazine.com/2023/08/oklch-color-spaces-gamuts-css/

https://www.doozytools.com/color-tools/color-converter

https://www.easyrgb.com/en/convert.php#inputFORM

https://oklch.com/#70,0.1,14,100

https://colordesigner.io/convert/hsvtohsl




/** 
 * Recursively interate through tree and change append name to each var function's identifier, 
 * e.g. var(--color-primary) => var(--color-primary-r), var(--color-primary-g), var(--color-primary-b), var(--color-primary-a)
 * handle default values recursively, e.g. var(--color-primary, rgba(0, 0, 0, 1)) => rgba(var(--color-primary-r, 0), var(--color-primary-g, 0), var(--color-primary-b, 0), var(--color-primary-a, 1))
 * handle nested var functions, e.g. var(--color-primary, var(--color-secondary, rgba(0, 0, 0, 1))) => rgba(var(--color-primary-r, var(--color-secondary-r, 0)), var(--color-primary-g, var(--color-secondary-g, 0)), var(--color-primary-b, var(--color-secondary-b, 0)), var(--color-primary-a, var(--color-secondary-a, 1)))
 * resolve hex and named colors, e.g. var(--color-primary, red) => rgba(var(--color-primary-r, 255), var(--color-primary-g, 0), var(--color-primary-b, 0), var(--color-primary-a, 1))
 */