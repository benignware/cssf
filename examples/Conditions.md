# Conditions

Conditions can be achieved by arithemtic operation. So, it does only work for numerical values.


### Example: Conditional variables

A common use-case is to toggle font-sizes for devices based a variable: 

<!-- Example -->
```html
<style id="example1-style"></style>
<h2>Hello World</h2>
```

```mjs
import { cssf } from 'cssf';

const css = cssf`
  :root {
    --is-big: 0;
  }
  
  @media only screen and (min-width: 768px) {
    :root {
      --is-big: 1;
    }
  }

  h2 {
    font-size: ifelse(var(--is-big), 3rem, 1.4rem);
  }
`;

const style = document.querySelector('#example1-style');

style.textContent = css;
```

## Hiding elements based on a condition

Since we can only use arithmetic expressions for this purpose, most of the ways how elements could be hidden via css are off the table. For string-based properties, e.g. `display: none`, `visibility: hidden`, it's obvious. With numeric-based properties, e.g. `opacity` or moving off the view by `position`, `transform`, `clip-path`, the element would still take up space, which is not suitable for hiding an element from its parent flow. Using `width: 0` and `height: 0` also doesn't work since `width: auto` isn't numeric. So, we're left with `max-width` and `max-height`. Also, we need to take care of `margin`, `paddimg`, `border` for zero space-consumption. Collapsing margins needs to be considered as well. Please note that the original paddings etc needs to be set in the exact same place and condition, so you may want to have that as variables as well.

<!-- Example -->
```html
<style id="example-hide-style"></style>
<div class="">
  <h1>Hello World</h1>
  <div class="box">Box with padding</div>
  <p>Lorem ipsum</p>
</div>
```

```mjs
import { cssf } from 'cssf';

const css = cssf`
  :root {
    --is-mobile: 1;
    --box-padding: 2rem;
    --box-margin-y: 1rem;
    --hide-box-on-mobile: 1;

    @media only screen and (min-width: 768px) {
      --is-mobile: 0;
    }
  }

  h1 {
    margin: 0 0 1rem 0;
  }

  .box {
    --is-box-hidden: and(
      var(--is-mobile), var(--hide-box-on-mobile) /* Both conditions need to be true */
    );
    background: hotpink;
    color: black;
    min-width: 0;
    min-height: 0;
    max-width: ifelse(var(--is-box-hidden), 0px, 2000px);
    max-height: ifelse(var(--is-box-hidden), 0px, 2000px);
    padding: ifelse(var(--is-box-hidden), 0rem, var(--box-padding));
    margin: 0;
    margin-top: ifelse(
      var(--is-box-hidden),
      (var(--box-margin-y) / 2 * -1), /* Collapsing margins */
      var(--box-margin-y)
    );
    margin-bottom: ifelse(
      var(--is-box-hidden),
      (var(--box-margin-y) / 2 * -1), /* Collapsong margins */
      var(--box-margin-y)
    );
    overflow: hidden;
    order: ifelse(var(--is-box-hidden), 1000, 0);
  }
`;

const style = document.querySelector('#example-hide-style');

style.textContent = css;
```
