// lchToLab.mjs

export function lchToLab(l, c, h) {
    // Convert hue from [0, 1] to degrees [0, 360]
    const hDegrees = h * 360;
    
    // Convert hue to radians
    const hRadians = (hDegrees / 360) * 2 * Math.PI;
  
    // Calculate a and b
    const a = c * Math.cos(hRadians);
    const b = c * Math.sin(hRadians);
  
    // Normalize values to [0, 1]
    // L ranges from [0, 100], a and b range from [-100, 100]
    const lNormalized = l;  // L is already in [0, 1]
    const aNormalized = (a + 100) / 200; // Normalize a from [-100, 100] to [0, 1]
    const bNormalized = (b + 100) / 200; // Normalize b from [-100, 100] to [0, 1]
  
    return {
      l: lNormalized,
      a: aNormalized,
      b: bNormalized
    };
  }
  