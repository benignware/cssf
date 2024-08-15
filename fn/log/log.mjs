import { lte } from '../lte/lte.mjs';
import { eq } from '../eq/eq.mjs';
import { ifelse } from '../ifelse/ifelse.mjs';
import { pow } from '../pow/pow.mjs';
import { abs } from '../abs/abs.mjs';
import { compute } from '../../utils/calc/compute.mjs';
import { or } from '../or/or.mjs';
import { hasVars } from '../../utils/calc/vars.mjs';

const add = compute('+');
const subtract = compute('-');
const multiply = compute('*');
const divide = compute('/');

// Simplified natural logarithm function with a fixed number of iterations
function naturalLog(y, precision = 1e-5, maxIter = 20) {
    // Handle edge cases directly
    
    
    const numTerms = maxIter; // Fixed number of iterations
    const numerator = subtract(y, 1);
    const denominator = add(y, 1);
    const z = divide(numerator, denominator);
    let sum = 0;

    for (let k = 0; k < numTerms; k++) {
        const term = divide(2, add(multiply(2, k), 1)) * pow(z, add(multiply(2, k), 1));
        sum = add(sum, term);
    }
    
    return multiply(2, sum);
}

// Predefined function to compute logarithm based on the fixed-length natural log calculation
function computeLog(x, base, precision) {
    let lnX = naturalLog(x, precision);
    let lnBase = naturalLog(base, precision);
    return divide(lnX, lnBase);
}

export function log(x, base = Math.E, precision = 1e-5) {
    // if (hasVars(x) || hasVars(base)) {
    //     return `log(${x}, ${base})`;
    // }
    return ifelse(
        eq(x, 1),
        0,
        ifelse(
            lte(x, 0),
            0,
            ifelse(
                or(lte(base, 0), eq(base, 1)),
                0,
                computeLog(x, base, precision) // Call the predefined function
            )
        )
    );
}
