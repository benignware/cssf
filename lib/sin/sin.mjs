function sin(x) {
  // Normalize x to the range [0, 2π)
  x = x % (2 * Math.PI);
  if (x < 0) x += 2 * Math.PI;

  // Taylor series expansion for sin(x) up to x^15 term
  const x2 = x * x;
  const x3 = x * x2;
  const x5 = x3 * x2;
  const x7 = x5 * x2;
  const x9 = x7 * x2;
  const x11 = x9 * x2;
  const x13 = x11 * x2;
  const x15 = x13 * x2;

  // Taylor series for sin(x): x - x^3/3! + x^5/5! - x^7/7! + x^9/9! - x^11/11! + x^13/13! - x^15/15!
  return x 
       - x3 / 6 
       + x5 / 120 
       - x7 / 5040 
       + x9 / 362880 
       - x11 / 39916800 
       + x13 / 479001600 
       - x15 / 87178291200;
}


export default sin;