import { gt } from '../gt/gt.mjs';
import { ifelse } from '../ifelse/ifelse.mjs';
import { stripCalc } from '../../utils/calc/stripCalc.mjs';

const shf = (digits = 0) => `4.9406564584124654e-${324 - digits}`;
const lhf = () => 9007199254740992;

const ROUNDIND_STRATEGIES = ['up', 'down', 'nearest', 'to-zero'];


/**
 * Returns the largest integer less than or equal to a given number.
 * @param {(number|string)} value A numerical value
 * @returns {string} A computable css expression
 */
// function floor(value) {
//   value = stripCalc(value);

//   const result = `((${value}) + ${lhf()} - ${lhf()})`;

//   return `calc(${ifelse(gt(`${value} - ${result}`, 0), result, `(${result} - 1)`)})`;
// }

// div {
//   --shf: 4.9406564584124654e-322;
//   width: calc(((100% / 11) - 9.09px) * var(--shf) / var(--shf));
// }


// const ceil = (value) => floor(`(${value}) + 1`);

const SHF = 4.9406564584124654e-324;

const _round = (value) => {
  // const digits = 0;

  value = stripCalc(value);

  return `calc(((${value}) * ${SHF} / ${SHF})`;
}

// const floor = (value) => {
//   value = stripCalc(value);

//   return _round(`(${value}) - 1`);
// }

// const ceil = (value) => {
//   value = stripCalc(value);

//   return `calc((${value}) + ${_round(`(${value})`)})`;
// }
// const floor = (value) => {
//   return `calc(((${value}) * ${SHF}) / ${SHF})`;
// }

// const ceil = (value) => floor(`(${value}) + 1`);

const floor = (value) => round(`${stripCalc(value)} - 0.5`);

const ceil = (value) => round(`${stripCalc(value)} + 0.5`);

/**
 * Returns a number that is the nearest integer to the given number.
 * 
 * Baseline 2024: https://developer.mozilla.org/en-US/docs/Web/CSS/round
 * @param {(string|number)} value A numerical expression
 * @returns {string} A css expression representing the nearest number to the given input
 */
export function round(roundingStrategy, valueToRound, roundingInterval) {
  // console.log('FN ROUND:', roundingStrategy, valueToRound, roundingInterval);
  const args =  [...arguments];

  roundingStrategy = args.find((arg) => ROUNDIND_STRATEGIES.includes(arg));
  [valueToRound, roundingInterval = 1] = roundingStrategy ? args.slice(1) : args;
  roundingStrategy = roundingStrategy || 'nearest';

  if (roundingInterval == 0) {
    throw new Error('roundingInterval cannot be 0');
  }

  if (roundingInterval != 1) {
    throw new Error(`roundingInterval ${roundingInterval} not yet supported`);
  }

  if (roundingStrategy === 'up') {
    return ceil(`(${valueToRound}) / ${roundingInterval} * ${roundingInterval}`);
  }

  if (roundingStrategy === 'down') {
    return floor(`(${valueToRound}) / ${roundingInterval} * ${roundingInterval}`);
  }

  return _round(valueToRound);
}

