import { xyzD65ToXyzD50, xyzD50ToXyzD65 } from './xyz.mjs';
import { 
  labD50ToLabD65, 
  labD65ToLabD50, 
  labD50ToXyzD50, 
  labD65ToXyzD65, 
  xyzD50ToLabD50, 
  xyzD65ToLabD65 
} from './lab.mjs';



// Convert LCH (D65) to LAB (D65)
export function lchToLab(L, C, H) {
  const radianH = H * (Math.PI / 180);
  const a = C * Math.cos(radianH);
  const b = C * Math.sin(radianH);
  return [L, a, b];
}

// Convert LAB (D65) to LCH (D65)
export function labToLch(L, a, b) {
  const C = Math.sqrt(a * a + b * b);
  let H = C > 0 ? Math.atan2(b, a) * (180 / Math.PI) : 0;
  if (H < 0) {
    H += 360;
  }
  return [L, C, H];
}

export function lchD50ToLchD65(L, C, H) {
  const [L_d50, a_d50, b_d50] = lchToLab(L, C, H);
  const [L_d65, a_d65, b_d65] = labD50ToLabD65(L_d50, a_d50, b_d50);
  return labToLch(L_d65, a_d65, b_d65);
}


// // Convert LCH (D65) to LAB (D50)
// export function lchD65ToLabD50(L, C, H) {
//   // Convert LCH (D65) to LAB (D65)
//   const [L_d65, a_d65, b_d65] = lchToLab(L, C, H);
  
//   // Convert LAB (D65) to LAB (D50)
//   const [L_d50, a_d50, b_d50] = labD65ToLabD50(L_d65, a_d65, b_d65);
  
//   return [L_d50, a_d50, b_d50];
// }

// // Convert LAB (D50) to LCH (D65)
// export function labD50ToLchD65(L, a, b) {
//   // Convert LAB (D50) to LAB (D65)
//   const [L_d65, a_d65, b_d65] = labD50ToLabD65(L, a, b);

//   // Convert LAB (D65) to LCH (D65)
//   return labToLch(L_d65, a_d65, b_d65);
// }

// // Convert LCH (D50) to LCH (D65)
// export function lchD50ToLchD65(L, C, H) {
//   // Convert LCH (D50) to LAB (D50)
//   const [L_d50, a_d50, b_d50] = lchToLab(L, C, H);

//   // Convert LAB (D50) to LAB (D65)
//   const [L_d65, a_d65, b_d65] = labD50ToLabD65(L_d50, a_d50, b_d50);

//   // Convert LAB (D65) to LCH (D65)
//   return labToLch(L_d65, a_d65, b_d65);
// }
