# Colors

Since [`color-mix`](https://caniuse.com/?search=color-mix) is now fully supported by user-agents, there's no longer need to calc it. Still, cssf comes in handy by emulating the derivative functions, such as `darken` etc.



## Color contrast

<!-- Example -->
```html
<style id="example-color-contrast-style"></style>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
```

```css
:root {
  --primary-r: 255;
  --primary-g: 255;
  --primary-b: 0;
  --primary: rgba(var(--primary-r), var(--primary-g), var(--primary-b));
  --secondary-r: 100;
  --secondary-g: 100;
  --secondary-b: 100;
  --secondary: rgba(var(--secondary-r), var(--secondary-g), var(--secondary-b));

  --btn-mix-weight: 0.5;
  --btn-padding-x: 1rem;
  --btn-padding-y: 0.5rem;
  --btn-border-radius: 5px;
}

.btn-primary {
  --btn-bg-r: var(--primary-r);
  --btn-bg-g: var(--primary-g);
  --btn-bg-b: var(--primary-b);
}

.btn-secondary {
  --btn-bg-r: var(--secondary-r);
  --btn-bg-g: var(--secondary-g);
  --btn-bg-b: var(--secondary-b);
}

.btn {
  --btn-bg: rgb(var(--btn-bg-r), var(--btn-bg-g), var(--btn-bg-b));
  appearance: none;
  background-color: var(--btn-bg);
  border-color: var(--btn-bg);
  border-radius: var(--btn-border-radius);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  cursor: pointer;
  transition: all 0.4s ease;
}

```

```mjs
import { cssf } from 'cssf';

// const btnMixWeight = `calc(var(--btn-mix-weight) * 100%)`:
const btnMixWeight = 'var(--btn-mix-weight)';
// const btnMixWeight = '25%';
const btnBg = 'rgba(var(--btn-bg-r), var(--btn-bg-g), var(--btn-bg-b))';
const btnBgColorContrast = 'color-contrast(rgba(var(--btn-bg-r), var(--btn-bg-g), var(--btn-bg-b)) vs #fff, #000)';
const btnColor = btnBgColorContrast;
const btnHoverBg = `color-mix(in srgb, ${btnBgColorContrast} ${btnMixWeight}, ${btnBg})`;
const btnHoverColor = `color-contrast(${btnHoverBg} vs #fff, #000)`;

const css = cssf`
  .btn {
    color: var(--btn-color, ${btnColor});
  }

  .btn:hover {
    background-color: var(--btn-hover-bg, ${btnHoverBg});
    border-color: var(--btn-hover-border-color, ${btnHoverBg});
    color: var(--btn-hover-color, ${btnHoverColor});
  }
`;

const style = document.querySelector('#example-color-contrast-style');

style.textContent = css;
```
