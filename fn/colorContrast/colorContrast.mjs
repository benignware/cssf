import { parseArgs } from '../../utils/ast/parseArgs.mjs';
import { ifelse } from '../ifelse/ifelse.mjs';
import { abs } from '../abs/abs.mjs';
import { gte } from '../gte/gte.mjs';
// import { gt } from '../gt/gt.mjs';
import { parseFn } from '../../utils/ast/parseFn.mjs';
import { getEval } from '../../utils/eval/getEval.mjs';
import { unwrap } from '../../utils/calc/unwrap.mjs';
import { stripCalc } from '../../lib/utils.mjs';
import { getColorArgs } from '../../utils/colors/getColorArgs.mjs';

const colorBrightness = (color, evaluate = false) => {
  const [f, ...rgb] = parseFn(color) || [];
  const [r, g, b] = getColorArgs(rgb.join(', '));

  if (evaluate && !f.startsWith('rgb')) {
    const ev = getEval();
    const x = ev(color);

    if (x) {
      return colorBrightness(x, true);
    }
  }
  
  let result = null;
  
  if (f && f.startsWith('rgb') && (
    r !== undefined &&
    g !== undefined &&
    b !== undefined
  )) {
    result = `calc(
      (
        (
          (
            ${r} * 299
          ) +
          (
            ${g} * 587
          ) +
          (
            ${b} * 114
          )
        ) / 1000
      )
    )`;
  }
  

  if (!result) {
    // throw new Error(`colorBrightness: invalid color ${color}`);
    return null;
  }


  return result;
}


const hasLegacyColorVars = (color) => 
  /var\(--[\w-]+-(r|g|b|a)(?:, [^)]+)?\)/.test(color);


/**
 * Returns a contrast color
 * @param {string} color A color, optionally followed by token 'vs' and another color
 * @param {...string} colorList - A list of colors to check against
 * @returns {string} The resulting contrast color
 */
export function colorContrast(color, color1 = '#000000', color2 = '#ffffff') {
  let colorList = [color1, color2].filter((color) => color);
  const args = parseArgs(`${color}${colorList.length ? ', ': ''}${colorList.join(', ')}`, { tokens: true })
    .filter((arg) => arg !== 'vs');

  color = args[0]?.trim();
  colorList = args.slice(1);

  const legacyVars = hasLegacyColorVars(color);

  const e = getEval();
  const brightness = colorBrightness(color, legacyVars);
  // const computedBrightness = brightness === null ? Number.NaN : parseFloat(e(brightness));

  // console.log('color contrast: ', color, colorList, brightness);
  
  if (
    hasLegacyColorVars(color)
    && brightness !== null
    // || !isNaN(computedBrightness)
  ) {
    // const b = !isNaN(computedBrightness) ? computedBrightness : brightness;
    const b = brightness;

    const bw = `calc(${ifelse(gte(b, 128), 0, 255)})`;
    const result = `rgb(${bw}, ${bw}, ${bw})`;

    return result;
  }

  // const [r, g, b] = [green(color), red(color), blue(color)];
  // console.log('r:', r, evaluate(r));
  // console.log('g:', g, evaluate(g));
  // console.log('b:', b, evaluate(b));


  
  // const luminance = `(r * .299 + g * .587 + b * .114)`;

  // const bwContrast = `calc(
  //   clamp(
  //     0,
  //     ${luminance} > 128 ? 0 : 255
  // )`;
  // const bwContrast = `calc(
  //   ${ifelse(gte(luminance, 128), 0, 255)}
  // )`;

  // const bwContrast = `calc(
  //   clamp(
  //     0,
  //     (
  //       (
  //         (
  //           (r * 299) +
  //           (g * 587) +
  //           (b * 114)
  //         ) / 1000
  //       ) - 128
  //     ) * 1000 * -1,
  //     255
  //   )
  // )`;


  const rbw = `calc(
    clamp(
      0,
      (
        (
          (
            (r * 299) +
            (g * 587) +
            (b * 114)
          ) / 1000
        ) - 128
      ) * 1000 * -1,
      255
    )
  )`;

  const from = `rgb(from ${color} ${rbw} ${rbw} ${rbw})`;

  return from;

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
