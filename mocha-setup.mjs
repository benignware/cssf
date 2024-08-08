import * as chai from 'chai';
import { deepCloseTo } from './setup/assert/deepCloseTo.mjs';
import { closeToUnit } from './setup/assert/closeToUnit.mjs';
import { cssEquivalent } from './setup/assert/cssEquivalent.mjs';

import { collectColorData } from './setup/colorCollector.mjs';
import fs from 'fs/promises';
import path from 'path';

global.COLORS = [
  'red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'black', 'white', 'hotpink'
]

global.COLOR_SPACES = [
  'rgb', 'hsl', 'hwb',
  'xyz', 'xyz-d65', 'xyz-d50',
  'lab', 'lch',
  // 'oklab', 'oklch',
  // 'srgb', 'srgb-linear', 'rgb-linear',
  // 'display-p3', 'a98-rgb', 'rec2020', 'prophoto-rgb',
];

const FIXTURES_CONVERSIONS = path.resolve('fixtures/conversions.json');

// Extend Chai with the custom assertion
chai.use(closeToUnit);
chai.use(deepCloseTo);
chai.use(cssEquivalent);

// Export Chai's expect for global use in tests
global.expect = chai.expect;

// Function to run the setup
async function runSetup() {
  try {
      // Check if the fixture file already exists
      await fs.access(FIXTURES_CONVERSIONS);
      console.log('Fixtures file already exists. Skipping data gathering.');
  } catch (err) {
      const colorDataJson = await collectColorData({
          colors: COLORS,
          colorSpaces: COLOR_SPACES,
          json: {
            pretty: true,
          }
      });

      if (colorDataJson) {
          await fs.writeFile(FIXTURES_CONVERSIONS, colorDataJson);
          console.log('Data gathered and saved to fixtures.json.');
      }
      console.log('Data gathered and saved to fixtures.json.');
  }

  // await new Promise(resolve => setTimeout(resolve, 2000)); // Check if tests are blocked until the setup is complete
}

// Run the setup function
await runSetup();