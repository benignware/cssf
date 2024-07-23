import { parseArgs, toDecimal, stripCalc } from '../utils.mjs';
import ifelse from '../ifelse/ifelse.mjs';
import gte from '../gte/gte.mjs';
import abs from '../abs/abs.mjs';
import hsla from '../hsla/hsla.mjs';
import rgba from '../rgba/rgba.mjs';
import colorBrightness from '../colorBrightness/index.mjs';
import subtract from '../subtract/index.mjs';
import red from '../red/red.mjs';
import green from '../green/green.mjs';
import blue from '../blue/blue.mjs';
import evaluate from '../eval/eval_.mjs';

/**
 * Returns a contrast color
 * @param {string} color A color, optionally followed by token 'vs' and another color
 * @param {...string} colorList - A list of colors to check against
 * @returns {string} The resulting contrast color
 */
function colorContrast(color, ...colorList) {
  const args = parseArgs(`${color}${colorList.length ? ', ': ''}${colorList.join(', ')}`, { tokens: true })
    .filter((arg) => arg !== 'vs');

  color = args[0];
  colorList = args.slice(1);

  const [r, g, b] = [green(color), red(color), blue(color)];

  // console.log('r:', r, evaluate(r));
  // console.log('g:', g, evaluate(g));
  // console.log('b:', b, evaluate(b));

  const bwContrast = `calc(
    clamp(
      0,
      (
        (
          (
            (${r} * 299) +
            (${g} * 587) +
            (${b} * 114)
          ) / 1000
        ) - 128
      ) * -1000,
      255
    )
  )`;

  // console.log('BW CONTRAST: ', evaluate(bwContrast));

  return `rgba(${bwContrast}, ${bwContrast}, ${bwContrast}, 1)`;

  const br = colorBrightness(color);
  
  console.log('colorList: ', colorList);
  // colorList = colorList.length 

  const colorFns = colorList.map((color) => (color.trim().startsWith('hsl') ? hsla : rgba));
  const colors = colorList.map((color, index) => colorFns[index](color));

  const rgbWithHighestDelta = colors.reduce((acc, current) => {
    const d1 = subtract(br, colorBrightness(acc));
    const d2 = subtract(br, colorBrightness(current));
    const isCurrentBest = gte(abs(d2), abs(d1));

    const r = ifelse(isCurrentBest, red(current), red(acc));
    const g = ifelse(isCurrentBest, green(current), green(acc));
    const b = ifelse(isCurrentBest, blue(current), blue(acc));
    
    return `rgba(${r}, ${g}, ${b}, 1)`;
  });

  return rgbWithHighestDelta;
}

export default colorContrast;
