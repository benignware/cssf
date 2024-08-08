// lab.mjs

import { xyzD65ToXyzD50, xyzD50ToXyzD65 } from './xyz.mjs';



// Conversion from Lab D50 to XYZ D50
export function labD50ToXyzD50(l, a, b) {
    const Xn = 0.9642;
    const Yn = 1.0000;
    const Zn = 0.8252;

    const epsilon = 0.008856;
    const kappa = 903.3;

    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const fx_ = Math.pow(fx, 3) > epsilon ? Math.pow(fx, 3) : (fx - 16 / 116) / (kappa / 116);
    const fy_ = Math.pow(fy, 3) > epsilon ? Math.pow(fy, 3) : (fy - 16 / 116) / (kappa / 116);
    const fz_ = Math.pow(fz, 3) > epsilon ? Math.pow(fz, 3) : (fz - 16 / 116) / (kappa / 116);

    const X = fx_ * Xn;
    const Y = fy_ * Yn;
    const Z = fz_ * Zn;

    return [X, Y, Z];
}

// Conversion from XYZ D50 to Lab D50
export function xyzD50ToLabD50(x, y, z) {
    const Xn = 0.9642;
    const Yn = 1.0000;
    const Zn = 0.8252;

    const epsilon = 0.008856;
    const kappa = 903.3;

    const fx = x / Xn;
    const fy = y / Yn;
    const fz = z / Zn;

    const fx_ = fx > epsilon ? Math.cbrt(fx) : (fx * kappa + 16) / 116;
    const fy_ = fy > epsilon ? Math.cbrt(fy) : (fy * kappa + 16) / 116;
    const fz_ = fz > epsilon ? Math.cbrt(fz) : (fz * kappa + 16) / 116;

    const L = 116 * fy_ - 16;
    const a = 500 * (fx_ - fy_);
    const b = 200 * (fy_ - fz_);

    return [L, a, b];
}

// Conversion from Lab D65 to XYZ D65
export function labD65ToXyzD65(l, a, b) {
    const Xn = 0.95047;
    const Yn = 1.00000;
    const Zn = 1.08883;

    const epsilon = 0.008856;
    const kappa = 903.3;

    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const fx_ = Math.pow(fx, 3) > epsilon ? Math.pow(fx, 3) : (fx - 16 / 116) / (kappa / 116);
    const fy_ = Math.pow(fy, 3) > epsilon ? Math.pow(fy, 3) : (fy - 16 / 116) / (kappa / 116);
    const fz_ = Math.pow(fz, 3) > epsilon ? Math.pow(fz, 3) : (fz - 16 / 116) / (kappa / 116);

    const X = fx_ * Xn;
    const Y = fy_ * Yn;
    const Z = fz_ * Zn;

    return [X, Y, Z];
}

// Conversion from XYZ D65 to Lab D65
export function xyzD65ToLabD65(x, y, z) {
    const Xn = 0.95047;
    const Yn = 1.00000;
    const Zn = 1.08883;

    const epsilon = 0.008856;
    const kappa = 903.3;

    const fx = x / Xn;
    const fy = y / Yn;
    const fz = z / Zn;

    const fx_ = fx > epsilon ? Math.cbrt(fx) : (fx * kappa + 16) / 116;
    const fy_ = fy > epsilon ? Math.cbrt(fy) : (fy * kappa + 16) / 116;
    const fz_ = fz > epsilon ? Math.cbrt(fz) : (fz * kappa + 16) / 116;

    const L = 116 * fy_ - 16;
    const a = 500 * (fx_ - fy_);
    const b = 200 * (fy_ - fz_);

    return [L, a, b];
}

// Conversion from Lab D50 to Lab D65
export function labD50ToLabD65(l, a, b) {
  const [X, Y, Z] = labD50ToXyzD50(l, a, b);
  const [X_d65, Y_d65, Z_d65] = xyzD50ToXyzD65(X, Y, Z);
  return xyzD65ToLabD65(X_d65, Y_d65, Z_d65);
}

// Conversion from Lab D65 to Lab D50
export function labD65ToLabD50(l, a, b) {
    const [X, Y, Z] = labD65ToXyzD65(l, a, b);
    const [X_d50, Y_d50, Z_d50] = xyzD65ToXyzD50(X, Y, Z);
    return xyzD50ToLabD50(X_d50, Y_d50, Z_d50);
}
