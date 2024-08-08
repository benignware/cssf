import { colorKeys } from "./keyToRgb.mjs";

function calculateDistance(rgb1, rgb2) {
  return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

export function rgbToKey(r, g, b) {
  const rgb = [r, g, b];
  let closestColor = null;
  let minDistance = Infinity;

  for (const [key, colorRgb] of Object.entries(colorKeys)) {
    const distance = calculateDistance(rgb, colorRgb);

    if (distance < minDistance) {
      minDistance = distance;
      closestColor = key;
    }
  }

  return closestColor;
}