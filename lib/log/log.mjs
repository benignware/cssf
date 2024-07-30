import lte from '../lte/lte.mjs';
import eq from '../eq/eq.mjs';
import ifelse from '../ifelse/ifelse.mjs';
import pow from '../pow/pow.mjs';
import abs from '../abs/abs.mjs';

function naturalLog(y, precision = 1e-10) {
    let sum = 0;
    let term;
    let numerator = (y - 1);
    let denominator = (y + 1);
    let z = numerator / denominator;
    let z2 = z * z;
    let k = 0;

    do {
        term = (2 / (2 * k + 1)) * pow(z, 2 * k + 1);
        sum += term;
        k++;
    } while (Math.abs(term) > precision);

    return 2 * sum;
}

function log(x, base = Math.E, precision = 1e-10) {
    // return Math.log(x) / Math.log(base);
    // x = `min(${x}, 0)`;

    if (x <= 0) {
        throw new Error("The argument x must be greater than 0.");
    }

    if (base <= 0 || base === 1) {
        throw new Error("The base must be greater than 0 and not equal to 1.");
    }

    // Base case: log_base(1) = 0
    if (x === 1) {
        return 0;
    }

    // Calculate the natural logarithm of x and base
    let lnX = naturalLog(x, precision);
    let lnBase = naturalLog(base, precision);

    // Apply the change of base formula
    return `${lnX} / ${lnBase}`;
}

// Examples of usage
// console.log(log(10, 10));    // Expected output: 1
// console.log(log(Math.E));    // Expected output: 1 (ln(e))
// console.log(log(16, 2));     // Expected output: 4 (log2(16))
// console.log(log(10));        // Expected output: ~2.3026 (ln(10))

export default log;