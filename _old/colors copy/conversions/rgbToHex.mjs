export const rgbToHex = (r, g, b) => {
  // Convert the RGB values to hex
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  
  return `#${hexR}${hexG}${hexB}`;
}