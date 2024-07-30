// conversions.mjs

// RGB to HSL conversion
export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = (max + min) / 2;
  let s = h;
  let l = h;

  if (max === min) {
      s = 0;
      h = 0; // Hue is undefined
  } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

// HSL to RGB conversion with percent inputs
export function hslToRgb(h, s, l) {
  // Ensure inputs are within the expected range
  h = Math.min(Math.max(h, 0), 360);
  s = Math.min(Math.max(s, 0), 100) / 100;
  l = Math.min(Math.max(l, 0), 100) / 100;

  // Convert HSL to RGB
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
  }

  // Adjust the RGB values and convert to 0-255 range
  return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
  ];
}


// RGB to HSV conversion
export function rgbToHsv (r, g, b) {
  let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
  rabs = r / 255;
  gabs = g / 255;
  babs = b / 255;
  v = Math.max(rabs, gabs, babs),
  diff = v - Math.min(rabs, gabs, babs);
  diffc = c => (v - c) / 6 / diff + 1 / 2;
  percentRoundFn = num => Math.round(num * 100) / 100;
  if (diff == 0) {
      h = s = 0;
  } else {
      s = diff / v;
      rr = diffc(rabs);
      gg = diffc(gabs);
      bb = diffc(babs);

      if (rabs === v) {
          h = bb - gg;
      } else if (gabs === v) {
          h = (1 / 3) + rr - bb;
      } else if (babs === v) {
          h = (2 / 3) + gg - rr;
      }
      if (h < 0) {
          h += 1;
      }else if (h > 1) {
          h -= 1;
      }
  }

  return [Math.round(h * 360), percentRoundFn(s * 100), percentRoundFn(v * 100)];
}

// HSV to RGB conversion
export function hsvToRgb(h, s, v) {
  h /= 360;
  s /= 100;
  v /= 100;
  let r, g, b, i, f, p, q, t;

  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
      case 0: r = v, g = t, b = p; break;
      case 1: r = q, g = v, b = p; break;
      case 2: r = p, g = v, b = t; break;
      case 3: r = p, g = q, b = v; break;
      case 4: r = t, g = p, b = v; break;
      case 5: r = v, g = p, b = q; break;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export function rgbToXyz(r, g, b) {
  // Normalize RGB values to the range [0, 1]
  r = r / 255;
  g = g / 255;
  b = b / 255;

  // Apply gamma correction to get linear RGB values
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using the standard D65 matrix
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  // Return XYZ values scaled by 100
  return [x * 100, y * 100, z * 100];
}

export function xyzToRgb(x, y, z) {
  // Convert to the range [0, 1]
  x /= 100;
  y /= 100;
  z /= 100;
  
  // Apply the XYZ to RGB matrix transformation
  let r = x * 3.2404542 + y * (-1.5371385) + z * (-0.4985314);
  let g = x * (-0.9692660) + y * 1.8760108 + z * 0.0415560;
  let b = x * 0.0556434 + y * (-0.2040259) + z * 1.0572252;
  
  // Apply gamma correction
  r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1 / 2.4) - 0.055) : (r * 12.92);
  g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1 / 2.4) - 0.055) : (g * 12.92);
  b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1 / 2.4) - 0.055) : (b * 12.92);
  
  // Clamp and convert to [0, 255] range
  r = Math.round(Math.max(0, Math.min(255, r * 255)));
  g = Math.round(Math.max(0, Math.min(255, g * 255)));
  b = Math.round(Math.max(0, Math.min(255, b * 255)));
  
  return [r, g, b];
}

// XYZ to LAB conversion
// export function xyzToLab(x, y, z) {
//   const X = x / 95.047;
//   const Y = y / 100.000;
//   const Z = z / 108.883;

//   const fx = X > 0.008856 ? Math.cbrt(X) : (X * 7.787) + (16 / 116);
//   const fy = Y > 0.008856 ? Math.cbrt(Y) : (Y * 7.787) + (16 / 116);
//   const fz = Z > 0.008856 ? Math.cbrt(Z) : (Z * 7.787) + (16 / 116);

//   return [
//       (116 * fy) - 16,
//       500 * (fx - fy),
//       200 * (fy - fz)
//   ];
// }

export function xyzToLab(x, y, z) {
  // Constants for XYZ to Lab conversion
  const REF_X = 95.047;
  const REF_Y = 100.000;
  const REF_Z = 108.883;

  // Function to pivot XYZ to Lab (this is a standard transformation step)
  const pivotXyzToLab = (value) => {
    const epsilon = 0.008856;
    const kappa = 903.3;

    if (value > epsilon) {
        return Math.cbrt(value);
    } else {
        return (value * kappa + 16) / 116;
    }
  }

  // Normalize the XYZ values
  x /= REF_X;
  y /= REF_Y;
  z /= REF_Z;

  // Pivot the normalized values
  x = pivotXyzToLab(x);
  y = pivotXyzToLab(y);
  z = pivotXyzToLab(z);

  // Calculate Lab values
  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);

  // Return Lab values
  return [l, a, b];
}

// LAB to XYZ conversion
export function labToXyz(l, a, b) {
  // Constants for Lab to XYZ conversion
  const REF_X = 95.047;
  const REF_Y = 100.000;
  const REF_Z = 108.883;

  // Function to pivot Lab to XYZ
  const pivotLabToXyz = (value) => {
    const v = Math.pow(value, 3);
    return v > 0.008856 ? v : (value - 16 / 116) / 7.787;
  }

  const labY = (l + 16) / 116;
  const labX = a / 500 + labY;
  const labZ = labY - b / 200;

  const x = REF_X * pivotLabToXyz(labX);
  const y = REF_Y * pivotLabToXyz(labY);
  const z = REF_Z * pivotLabToXyz(labZ);

  return [x, y, z];
}

// RGB to LAB conversion
export function rgbToLab(r, g, b) {
  // Convert RGB to XYZ
  const xyz = rgbToXyz(r, g, b);
  
  // Convert XYZ to Lab
  const lab = xyzToLab(xyz[0], xyz[1], xyz[2]);
  
  return lab;
}


// LAB to RGB conversion
export function labToRgb(l, a, b) {
  // Convert Lab to XYZ
  const xyz = labToXyz(l, a, b);
  
  // Convert XYZ to RGB
  const rgb = xyzToRgb(xyz[0], xyz[1], xyz[2]);
  
  return rgb;
}


// LAB to LCH conversion
export function labToLch(l, a, b) {
  // Calculate chroma from a* and b*
  const c = Math.sqrt(a * a + b * b);

  // Calculate hue in radians, then convert to degrees
  const h = Math.atan2(b, a) * (180 / Math.PI);

  // Ensure hue is between 0 and 360 degrees
  const hue = (h + 360) % 360;

  // Return the LCH values
  return [l, c, hue];
}

// LCH to LAB conversion
export function lchToLab(l, c, h) {
  // Ensure chroma is non-negative
  c = Math.max(c, 0);

  // Convert hue from degrees to radians
  const hr = (h * Math.PI) / 180;

  // Calculate a* and b* from chroma and hue
  const a = c * Math.cos(hr);
  const b = c * Math.sin(hr);

  // Return the Lab values
  return [l, a, b];
}

// Convert RGB to LCH
export function rgbToLch(r, g, b) {
  // Convert RGB to XYZ
  const [x, y, z] = rgbToXyz(r, g, b);

  // Convert XYZ to LAB
  const [l, aLab, bLab] = xyzToLab(x, y, z);

  // Convert LAB to LCH
  return labToLch(l, aLab, bLab);
}


// Convert LCH to RGB
export function lchToRgb(l, c, h) {
  const [a, b] = lchToLab(l, c, h);
  const [x, y, z] = labToXyz(a, b, l);
  return xyzToRgb(x, y, z);
}

export function xyzToLms(x, y, z) {
  console.log('xyzToLms:', x, y, z);
  
  // Normalize XYZ values
  const xN = x / 95.047;
  const yN = y / 100.000;
  const zN = z / 108.883;
  console.log('Normalized XYZ:', xN, yN, zN);

  // Matrix transformation from XYZ to LMS
  const L = 0.4002 * xN + 0.7075 * yN - 0.0808 * zN;
  const M = -0.2263 * xN + 1.1653 * yN + 0.0457 * zN;
  const S = 0.0000 * xN + 0.0000 * yN + 0.9182 * zN;

  console.log('LMS:', L, M, S);

  // Nonlinear transformation
  const nonlinearTransform = (value) => {
    return value > 0.04045 ? 100 * Math.pow(value, 1/3) : 100 * ((value * 7.787) + 0.13793);
  };

  const result = [
    nonlinearTransform(L),
    nonlinearTransform(M),
    nonlinearTransform(S),
  ];

  console.log('Transformed LMS:', result);

  return result;
}

// Example Tests
// const testCases = [
//   { xyz: [41.24, 21.26, 1.93], expectedLMS: [45.85, 26.21, 5.24] },
//   { xyz: [35.76, 71.52, 11.92], expectedLMS: [27.94, 45.85, 10.35] },
//   { xyz: [18.05, 7.22, 95.05], expectedLMS: [27.94, 8.76, 100.00] },
//   { xyz: [95.05, 100.00, 108.90], expectedLMS: [100.00, 100.00, 100.00] },
//   { xyz: [0, 0, 0], expectedLMS: [0, 0, 0] },
//   { xyz: [70.09, 74.19, 79.49], expectedLMS: [73.77, 73.77, 67.54] },
//   { xyz: [32.31, 34.54, 54.68], expectedLMS: [37.46, 36.53, 46.70] }
// ];

// testCases.forEach(({ xyz, expectedLMS }) => {
//   console.log('Testing XYZ to LMS for:', xyz);
//   const result = xyzToLms(...xyz);
//   console.log('Result:', result);
//   console.log('Expected:', expectedLMS);
// });

// export function xyzToLms(x, y, z) {
//   console.log('xyzToLms:', x, y, z);
//   // Normalize XYZ
//   const xN = x / 95.047;
//   const yN = y / 100.000;
//   const zN = z / 108.883;

//   console.log('Normalized XYZ:', xN, yN, zN);

//   // Matrix transformation
//   const L = 0.4002 * xN + 0.7075 * yN - 0.0808 * zN;
//   const M = -0.2263 * xN + 1.1653 * yN + 0.0457 * zN;
//   const S = 0.0000 * xN + 0.0000 * yN + 0.9182 * zN;

//   console.log('LMS:', L, M, S);

//   // Nonlinear transformation
//   const transform = (value) => {
//       if (value > 0.008856) {
//           return 100 * Math.pow(value, 1 / 3);
//       } else {
//           return 100 * (7.787 * value + 0.13793);
//       }
//   };

//   const lLms = transform(L);
//   const mLms = transform(M);
//   const sLms = transform(S);

//   console.log('Transformed LMS:', lLms, mLms, sLms);

//   return [lLms, mLms, sLms];
// }


export function lmsToXyz(l, m, s) {
  console.log('lmsToXyz:', l, m, s);

  // Nonlinear transformation to reverse the previous LMS to XYZ transformation
  const nonlinearTransformInverse = (value) => {
    return value > 10.0 ? Math.pow(value / 100, 3) : (value / 100 - 0.13793) / 7.787;
  };

  // Reverse the nonlinear transformation
  const L = nonlinearTransformInverse(l);
  const M = nonlinearTransformInverse(m);
  const S = nonlinearTransformInverse(s);

  console.log('Nonlinear Transformed LMS:', L, M, S);

  // Matrix transformation from LMS to XYZ
  const x =  0.4002 * L - 0.2263 * M + 0.0000 * S;
  const y =  0.7075 * L + 1.1653 * M + 0.0000 * S;
  const z = -0.0808 * L + 0.0457 * M + 0.9182 * S;

  console.log('XYZ:', x, y, z);

  // Denormalize XYZ values
  return [x * 95.047, y * 100.000, z * 108.883];
}




// export function lmsToXyz(lLms, mLms, sLms) {
//   console.log('lmsToXyz:', lLms, mLms, sLms);
//   const inverseTransform = (value) => {
//     const v = value / 100;
//     return v > 0.04045 ? Math.pow(v, 3) : (v - 0.13793) / 7.787;
//   };

//   const L = inverseTransform(lLms);
//   const M = inverseTransform(mLms);
//   const S = inverseTransform(sLms);


//   console.log("Inverse Transform for L:", L);
//   console.log("Inverse Transform for M:", M);
//   console.log("Inverse Transform for S:", S);

//   const xN = 0.4002 * L + 0.7075 * M - 0.0808 * S;
//   const yN = -0.2263 * L + 1.1653 * M + 0.0457 * S;
//   const zN = 0.0000 * L + 0.0000 * M + 0.9182 * S;

//   console.log("xN (normalized):", xN);
//   console.log("yN (normalized):", yN);
//   console.log("zN (normalized):", zN);

//   const X = xN * 95.047;
//   const Y = yN * 100.000;
//   const Z = zN * 108.883;

//   console.log("X:", X);
//   console.log("Y:", Y);
//   console.log("Z:", Z);

//   return [X, Y, Z];
// }



export function xyzToOklab(x, y, z) {
  // Normalize XYZ values to the reference white D65
  const xN = x / 95.047;
  const yN = y / 100.000;
  const zN = z / 108.883;

  // Convert XYZ to LMS using the D65 to LMS matrix
  const L = 0.4000 * xN + 0.4000 * yN + 0.2000 * zN;
  const M = 0.2500 * xN + 0.4600 * yN + 0.2900 * zN;
  const S = 0.1000 * xN + 0.2500 * yN + 0.4000 * zN;

  // Apply nonlinear transformation to get OKLab values
  const lOk = Math.cbrt(L);
  const mOk = Math.cbrt(M);
  const sOk = Math.cbrt(S);

  // Normalize OKLab to percentage (0-100)
  return [lOk * 100, mOk * 100, sOk * 100];
}

export function oklabToXyz(lOk, mOk, sOk) {
  // Convert OKLab to LMS
  const L = Math.pow(lOk / 100, 3);
  const M = Math.pow(mOk / 100, 3);
  const S = Math.pow(sOk / 100, 3);

  console.log('LMS:', L, M, S);

  // Convert LMS to XYZ using the inverse matrix
  const x = 4.4679 * L - 3.5873 * M + 0.1193 * S;
  const y = -1.2186 * L + 2.3809 * M - 0.1624 * S;
  const z = 0.0497 * L - 0.5473 * M + 1.1636 * S;

  console.log('XYZ (before denormalization):', x, y, z);

  // Denormalize XYZ values to the reference white
  const xyz = [x * 95.047, y * 100.000, z * 108.883];
  console.log('Denormalized XYZ:', xyz);

  return xyz;
}






// export function lmsToRgb(l, m, s) {
//   // Define the LMS to RGB matrix
//   const LMS_TO_RGB_MATRIX = [
//     [ 4.4679, -3.5873,  0.1193 ],
//     [-1.2186,  2.3809, -0.1624 ],
//     [ 0.0497, -0.0540,  1.0083 ]
//   ];

//   // Perform matrix multiplication to convert LMS to RGB
//   const r = LMS_TO_RGB_MATRIX[0][0] * l + LMS_TO_RGB_MATRIX[0][1] * m + LMS_TO_RGB_MATRIX[0][2] * s;
//   const g = LMS_TO_RGB_MATRIX[1][0] * l + LMS_TO_RGB_MATRIX[1][1] * m + LMS_TO_RGB_MATRIX[1][2] * s;
//   const b = LMS_TO_RGB_MATRIX[2][0] * l + LMS_TO_RGB_MATRIX[2][1] * m + LMS_TO_RGB_MATRIX[2][2] * s;

//   // Clip RGB values to the [0, 1] range
//   return [
//     Math.max(0, Math.min(1, r)),
//     Math.max(0, Math.min(1, g)),
//     Math.max(0, Math.min(1, b))
//   ];
// }


// export function lmsToRgb(L, M, S) {
//   // Normalize LMS values
//   const Lnorm = L / 100;
//   const Mnorm = M / 100;
//   const Snorm = S / 100;

//   // Matrix transformation from LMS to RGB
//   const R =  4.4679 * Lnorm - 3.5873 * Mnorm + 0.1193 * Snorm;
//   const G = -1.2186 * Lnorm + 2.3809 * Mnorm - 0.1624 * Snorm;
//   const B =  0.0497 * Lnorm - 0.2439 * Mnorm + 1.2045 * Snorm;

//   // Normalize and clamp to 0-255 range
//   const Rscaled = Math.min(255, Math.max(0, Math.round(R * 255)));
//   const Gscaled = Math.min(255, Math.max(0, Math.round(G * 255)));
//   const Bscaled = Math.min(255, Math.max(0, Math.round(B * 255)));

//   return [Rscaled, Gscaled, Bscaled];
// }

// export function lmsToRgb(L, M, S) {
//   // Normalize LMS values
//   const Lnorm = L / 100;
//   const Mnorm = M / 100;
//   const Snorm = S / 100;

//   // Matrix transformation from LMS to RGB
//   const R =  4.4679 * Lnorm - 3.5873 * Mnorm + 0.1193 * Snorm;
//   const G = -1.2186 * Lnorm + 2.3809 * Mnorm - 0.1624 * Snorm;
//   const B =  0.0497 * Lnorm - 0.2439 * Mnorm + 1.2045 * Snorm;

//   // Ensure the RGB values are within the 0-1 range
//   const Rclamped = Math.max(0, Math.min(1, R));
//   const Gclamped = Math.max(0, Math.min(1, G));
//   const Bclamped = Math.max(0, Math.min(1, B));

//   // Scale to 0-255 range
//   const Rscaled = Math.round(Rclamped * 255);
//   const Gscaled = Math.round(Gclamped * 255);
//   const Bscaled = Math.round(Bclamped * 255);

//   return [Rscaled, Gscaled, Bscaled];
// }



export function lmsToRgb(L, M, S) {
  // Define the transformation matrix for LMS to RGB
  const matrix = [
      [4.4679, -3.5873, 0.1193],
      [-1.2186, 2.3809, -0.1624],
      [0.0497, -0.2439, 1.2045]
  ];

  // Perform matrix multiplication
  const R = matrix[0][0] * L + matrix[0][1] * M + matrix[0][2] * S;
  const G = matrix[1][0] * L + matrix[1][1] * M + matrix[1][2] * S;
  const B = matrix[2][0] * L + matrix[2][1] * M + matrix[2][2] * S;

  // Clamp RGB values to the range [0, 255]
  // const Rclamped = Math.max(0, Math.min(255, Math.round(R)));
  // const Gclamped = Math.max(0, Math.min(255, Math.round(G)));
  // const Bclamped = Math.max(0, Math.min(255, Math.round(B)));

  return [R, G, B];
}
