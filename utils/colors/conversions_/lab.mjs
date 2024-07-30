// Convert XYZ to LAB
function xyzToLab(x, y, z) {
  // Denormalize XYZ values
  var xn = x * 95.047;
  var yn = y * 100.000;
  var zn = z * 108.883;

  // Convert to LAB
  var fx = xn > 0.008856 ? Math.cbrt(xn / 95.047) : (903.3 * xn / 95.047 + 16) / 116;
  var fy = yn > 0.008856 ? Math.cbrt(yn / 100.000) : (903.3 * yn / 100.000 + 16) / 116;
  var fz = zn > 0.008856 ? Math.cbrt(zn / 108.883) : (903.3 * zn / 108.883 + 16) / 116;

  var l = (116 * fy - 16) / 100;
  var a = (500 * (fx - fy)) / 200;
  var b = (200 * (fy - fz)) / 200;

  return { l, a, b };
}

// Convert LAB to XYZ
function labToXyz(l, a, b) {
  var fy = (l * 100 + 16) / 116;
  var fx = (a * 200) / 500 + fy;
  var fz = fy - (b * 200) / 200;

  var xn = Math.pow(fx, 3) > 0.008856 ? Math.pow(fx, 3) * 95.047 : ((116 * fx - 16) * 95.047) / 903.3;
  var yn = Math.pow(fy, 3) > 0.008856 ? Math.pow(fy, 3) * 100.000 : ((116 * fy - 16) * 100.000) / 903.3;
  var zn = Math.pow(fz, 3) > 0.008856 ? Math.pow(fz, 3) * 108.883 : ((116 * fz - 16) * 108.883) / 903.3;

  var x = xn / 95.047;
  var y = yn / 100.000;
  var z = zn / 108.883;

  return { x, y, z };
}


// Convert LAB to RGB
export function labToRgb(l, a, b) {
  // Convert LAB to XYZ
  var xyz = labToXyz(l, a, b);

  // Normalize XYZ values
  var xn = xyz.x * 95.047;
  var yn = xyz.y * 100.000;
  var zn = xyz.z * 108.883;

  // Convert XYZ to RGB
  var r = xn * 3.2406 - yn * 1.5372 - zn * 0.4986;
  var g = -xn * 0.9689 + yn * 1.8758 + zn * 0.0415;
  var b = xn * 0.0557 - yn * 0.2040 + zn * 1.0570;

  // Normalize RGB values
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  // Clamp RGB values between 0 and 1
  r = Math.max(0, Math.min(1, r));
  g = Math.max(0, Math.min(1, g));
  b = Math.max(0, Math.min(1, b));

  return { r, g, b };
}