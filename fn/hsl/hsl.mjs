import { getColorFn } from "../../utils/colors/getColorFn.mjs";
import * as hslCalcConversions from "../../utils/colors/conversions/calc/hsl.mjs";

export const hsl = getColorFn("hsl", 'hsl', {
  ...hslCalcConversions
}, {
  units: ['deg', '%', '%'],
  // legacyFormat: 'auto',
});
export const hsla = hsl;