import { rgbToHsl } from './rgbToHsl.mjs';

export function rgbToHwb(r, g, b) {
  const rn = `${r} / 255`;
  const gn = `${g} / 255`;
  const bn = `${b} / 255`;
  
  const max = `max(${rn}, ${gn}, ${bn})`;
  const min = `min(${rn}, ${gn}, ${bn})`;

  const [h] = rgbToHsl(r, g, b);

  return [h, W, B];
}