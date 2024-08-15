export const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  const [r, g, b] = hex.length === 8 
    ? [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)]
    : [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  return [r, g, b];
}
