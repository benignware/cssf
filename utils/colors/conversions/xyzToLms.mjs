// xyzToLms.js

// Conversion matrix from XYZ to LMS
const XYZ_TO_LMS_MATRIX = [
  [0.4002, -0.2263, 0.0000],
  [0.7075, 1.1653, 0.0000],
  [-0.0808, 0.0457, 0.9182]
];

// Function to convert XYZ to LMS
export function xyzToLms(xyz) {
  const [X, Y, Z] = xyz;
  const LMS = [
      XYZ_TO_LMS_MATRIX[0][0] * X + XYZ_TO_LMS_MATRIX[0][1] * Y + XYZ_TO_LMS_MATRIX[0][2] * Z,
      XYZ_TO_LMS_MATRIX[1][0] * X + XYZ_TO_LMS_MATRIX[1][1] * Y + XYZ_TO_LMS_MATRIX[1][2] * Z,
      XYZ_TO_LMS_MATRIX[2][0] * X + XYZ_TO_LMS_MATRIX[2][1] * Y + XYZ_TO_LMS_MATRIX[2][2] * Z
  ];
  return LMS.map(value => Math.max(0, value));  // Ensure no negative values
}

// Test cases
function testXyzToLms() {
  console.log("Testing xyzToLms...");

  // Test cases
  const testCases = [
      { xyz: [41.2460, 21.2670, 1.9330], expected: [0.4002, -0.2263, 0.0000] },
      { xyz: [35.7560, 71.5120, 11.9180], expected: [0.7075, 1.1653, 0.0000] },
      { xyz: [18.0430, 7.2180, 95.0300], expected: [-0.0808, 0.0457, 0.9182] },
      { xyz: [95.0470, 100.0000, 108.8830], expected: [1.0000, 1.0000, 1.0000] },
      { xyz: [0.0000, 0.0000, 0.0000], expected: [0.0000, 0.0000, 0.0000] },
      { xyz: [77.3450, 79.0840, 82.3530], expected: [0.7420, 0.7420, 0.7420] },
      { xyz: [10.5400, 10.5740, 10.3500], expected: [0.3800, 0.3800, 0.3800] }
  ];

  testCases.forEach(({ xyz, expected }, index) => {
      const result = xyzToLms(xyz);
      console.log(`Test case ${index + 1}:`, JSON.stringify(result) === JSON.stringify(expected) ? 'Pass' : 'Fail');
  });
}

testXyzToLms();
