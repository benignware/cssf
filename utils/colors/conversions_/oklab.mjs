import { rgbToXyz, xyzToRgb } from './xyz.mjs';

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function denormalize(value, min, max) {
  return value * (max - min) + min;
}

function oklabToXyz(l, a, b) {
  const epsilon = 0.008856;
  const kappa = 903.3;

  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = fx ** 3 > epsilon ? fx ** 3 : (116 * fx - 16) / kappa;
  const yr = l > kappa * epsilon ? ((l + 16) / 116) ** 3 : l / kappa;
  const zr = fz ** 3 > epsilon ? fz ** 3 : (116 * fz - 16) / kappa;

  const x = xr * 0.96422;
  const y = yr * 1.0;
  const z = zr * 0.82521;

  return [normalize(x, 0, 0.96422), normalize(y, 0, 1), normalize(z, 0, 0.82521)];
}

function xyzToOklab(x, y, z) {
  const epsilon = 0.008856;
  const kappa = 903.3;

  const xr = denormalize(x, 0, 0.96422);
  const yr = denormalize(y, 0, 1);
  const zr = denormalize(z, 0, 0.82521);

  const fx = xr > epsilon ? xr ** (1 / 3) : (kappa * xr + 16) / 116;
  const fy = yr > epsilon ? yr ** (1 / 3) : (kappa * yr + 16) / 116;
  const fz = zr > epsilon ? zr ** (1 / 3) : (kappa * zr + 16) / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return [normalize(l, 0, 100), a, b];
}

function oklabToRgb(l, a, b) {
  return xyzToRgb(...oklabToXyz(l, a, b));
}

function rgbToOklab(r, g, b) {
  return xyzToOklab(...rgbToXyz(r, g, b));
}

export { oklabToRgb, oklabToXyz, rgbToOklab, xyzToOklab };
