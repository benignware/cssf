# Legacy Color Vars


<!--
  Example: Legacy Color Vars

  viewer: iframe
-->

```css
h2 {
  color: yellow;
}

.example {
  /* --primary-r: 250;
  --primary-g: 120;
  --primary-b: 117;
  --primary: rgb(var(--primary-r), var(--primary-g), var(--primary-b)); */
  --primary: rgb(255, 230, 130);
}

.btn {
  background-color: var(--btn-bg);
  border-color: var(--btn-bg);
  color: var(--btn-color);
  border-radius: 5px;
  padding: 0.25rem 0.4rem;
  cursor: pointer;
}
```

```html
<h2>Hello World</h2>
<div id="example" class="example">
  <button class="btn btn-primary">Primary Button</button>
  <div>
    <label for="btnColorPicker">
    <input
      type="color"
      id="btnColorPicker"
      oninput="example.style.setProperty('--primary', event.target.value)"
    />
  </div>
</div>
<script>
  const rgbToHex = (rgb) => {
    const rgbValues = rgb.match(/\d+/g);
    return `#${((1 << 24) + (parseInt(rgbValues[0]) << 16) + (parseInt(rgbValues[1]) << 8) + parseInt(rgbValues[2])).toString(16).slice(1).toUpperCase()}`;
  }

  const example = document.querySelector('.example');
  const rgbValue = window.getComputedStyle(example).getPropertyValue('--primary').trim();
  const hexValue = rgbToHex(rgbValue);

  btnColorPicker.value = hexValue;
</script>

<style id="legacy-color-vars-example-1-style"></style>
<script src="./legacy-color-vars-runtime.js"> </script>
```


```mjs
import { cssf } from 'cssf';
import { LegacyColorVarsPlugin } from 'cssf/addons';

// background-color: rgba(var(--primary-r), var(--primary-g), var(--primary-b));
// 
    // border-color: var(--primary);
    // color: color-contrast(var(--primary));

// Inject plugin to transform variables at compilation time
cssf.use(new LegacyColorVarsPlugin({
  identifiers: [
    '--primary',
  ]
}));

const css = cssf`
  .btn-primary {
    border-color: var(--primary);
    background-color: var(--primary);
    color: color-contrast(var(--primary));
    border-radius: 5px;
    padding: 0.25rem 0.45rem;
  }
`;

document.querySelector('#legacy-color-vars-example-1-style')
  .textContent = css;
```
