import { number } from '../../calc/number.mjs';
import { max } from './env2022.mjs';

export * from './env2024.mjs';

export const abs = x => max(x, -1 * x);

export const sign = x => isNaN(number(x)) ? 'NaN' : Math.sign(number(x));