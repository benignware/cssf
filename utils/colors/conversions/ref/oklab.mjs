import { matrixMultiply } from './utils.mjs';

const OklabToXyzMatrix = [
  [0.4002, 0.7075, -0.0808],
  [-0.2263, 1.1653, 0.0457],
  [0.0000, 0.0000, 0.0000]
];

const XyzToOklabMatrix = [
  [0.4002, -0.2263, 0.0000],
  [0.7075, 1.1653, 0.0000],
  [-0.0808, 0.0457, 0.0000]
];

export function oklabToXYZ(L, a, b) {
  const result = matrixMultiply(OklabToXyzMatrix, [L, a, b]);
  return result;
}

export function xyzToOKLab(X, Y, Z) {
  const result = matrixMultiply(XyzToOklabMatrix, [X, Y, Z]);
  return result;
}
