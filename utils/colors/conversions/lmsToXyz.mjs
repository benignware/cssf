// lmsToXyz.js

// Conversion matrix from LMS to XYZ
const LMS_TO_XYZ_MATRIX = [
  [0.4002, 0.7075, -0.0808],
  [-0.2263, 1.1653, 0.0457],
  [0.0000, 0.0000, 0.9182]
];

// Function to convert LMS to XYZ
export function lmsToXyz(lms) {
  const [L, M, S] = lms;
  const XYZ = [
      LMS_TO_XYZ_MATRIX[0][0] * L + LMS_TO_XYZ_MATRIX[0][1] * M + LMS_TO_XYZ_MATRIX[0][2] * S,
      LMS_TO_XYZ_MATRIX[1][0] * L + LMS_TO_XYZ_MATRIX[1][1] * M + LMS_TO_XYZ_MATRIX[1][2] * S,
      LMS_TO_XYZ_MATRIX[2][0] * L + LMS_TO_XYZ_MATRIX[2][1] * M + LMS_TO_XYZ_MATRIX[2][2] * S
  ];
  return XYZ.map(value => Math.max(0, value));  // Ensure no negative values
}

// Test cases
function testLmsToXyz() {
  console.log("Testing lmsToXyz...");

  // Test cases
  const testCases = [
      { lms: [0.4002, -0.2263, 0.0000], expected: [41.2460, 21.2670, 1.9330] },
      { lms: [0.7075, 1.1653, 0.0000], expected: [35.7560, 71.5120, 11.9180] },
      { lms: [-0.0808, 0.0457, 0.9182], expected: [18.0430, 7.2180, 95.0300] },
      { lms: [1.0000, 1.0000, 1.0000], expected: [95.0470, 100.0000, 108.8830] },
      { lms: [0.0000, 0.0000, 0.0000], expected: [0.0000, 0.0000, 0.0000] },
      { lms: [0.7420, 0.7420, 0.7420], expected: [77.3450, 79.0840, 82.3530] },
      { lms: [0.3800, 0.3800, 0.3800], expected: [10.5400, 10.5740, 10.3500] }
  ];

  testCases.forEach(({ lms, expected }, index) => {
      const result = lmsToXyz(lms);
      console.log(`Test case ${index + 1}:`, JSON.stringify(result) === JSON.stringify(expected) ? 'Pass' : 'Fail');
  });
}

testLmsToXyz();
