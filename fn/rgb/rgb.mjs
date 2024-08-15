import { getColorFn } from "../../utils/colors/getColorFn.mjs";

export const rgb = getColorFn("rgb", 'rgb', {}, { legacyFormat: true });
export const rgba = rgb;