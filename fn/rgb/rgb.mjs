import { getColorFn } from "../../utils/colors/getColorFn.mjs";

export const rgb = getColorFn("rgb", 'rgb', {}, { legacyFormat: 'auto' });
export const rgba = rgb;