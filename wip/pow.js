function pow(base, exponent) {
  const int = Math.floor(exponent);
  const remainder = exponent - int;
  console.log('pow: ', base, exponent);

  let product = 1;

  for (let i = 0; i < int; i++) {
    product = product * base;
  }

  if (remainder > 0) {
    // product = product + pow(base / 10, Math.floor(remainder * 10));
    console.log('REMAINDER: ', remainder);
    product = product + (base / product * remainder);
  }

  return product;
}

// function power(x, y) {
//   if (y == 0) return 1;
//   else if (y % 2 == 0)
//     return power(x, parseInt(y / 2, 10)) * power(x, parseInt(y / 2, 10));
//   else return x * power(x, parseInt(y / 2, 10)) * power(x, parseInt(y / 2, 10));
// }

const b = 23;
const e = 2.1;

const p = pow(b, e);

console.log('ACTUAL: ', p);
console.log('EXPECTED: ', Math.pow(b, e));
