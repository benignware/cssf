import puppeteer from 'puppeteer';
import { writeFile } from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { type } from 'os';

const __dirname = new URL('.', import.meta.url).pathname;
const SCRIPT_PATH = './collectColorData.mjs';


// Function to format JSON with arrays on a single line
function prettyPrintArray(json) {
  if (typeof json === 'string') {
    json = JSON.parse(json);
  }

  const output = JSON.stringify(json, function(k,v) {
    if(v instanceof Array)
      return JSON.stringify(v);
    return v;
  }, 2).replace(/\\/g, '')
    .replace(/\"\[/g, '[')
    .replace(/\]\"/g,']')
    .replace(/\"\{/g, '{')
    .replace(/\}\"/g,'}');

  return output;
}

export const collectColorData = async (options = {}) => {
  let { json: jsonOptions = false } = options;

  const scriptContent = readFileSync(path.resolve(__dirname, SCRIPT_PATH), 'utf8');
    // Launch a browser instance
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Define your HTML content with an inline module script
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Injected HTML</title>
    </head>
    <body>
        <h1 id="header">Hello, Puppeteer!</h1>
        <p id="content">This content is injected from a string.</p>
        <script type="module">
            ${scriptContent}

            window.COLORS = ${options.colors ? JSON.stringify(options.colors) : '[]'};
            window.COLOR_SPACES = ${options.colorSpaces ? JSON.stringify(options.colorSpaces) : '[]'};

            // Define a function within the module script
            export function test() {
                console.log('This is a test function!');
                return 'Hello from the test function xxx!';
            }
            // Export the function to the window object
            window.__collectColorData = (...args) => {
              try {
                const result = JSON.stringify(collectColorData(...args), 2, null);

                return result;
              } catch(error) {
                return error.message;
              }
            }
        </script>
    </body>
    </html>
    `;

    // Set the page content to the HTML string
    await page.setContent(htmlContent);

    // Wait for the module script to be executed and the function to be available
    await page.waitForFunction(() => typeof window.__collectColorData === 'function');

    // Execute the function defined in the inline module script
    let result = await page.evaluate(() => {
        return window.__collectColorData({ summary: true, colors: window.COLORS, colorSpaces: window.COLOR_SPACES });
    });

    // Close the browser
    await browser.close();

    // Output the result to a local file
    const data = JSON.parse(result);

    if (!jsonOptions) {
      return data;
    }

    jsonOptions = typeof jsonOptions !== 'object' ? {} : jsonOptions;
    
    const { pretty = true, emit = false } = jsonOptions;

    result = JSON.stringify(data, null, 2);
    result = pretty ? prettyPrintArray(result) : result;

    if (emit) {
      const file = typeof emit === 'string' ? emit : 'conversions.json';

      if (!existsSync(path.dirname(file))) {
        mkdirSync(path.dirname(file), { recursive: true });
      }

      await writeFile(file, result);
    }

    return result;
};


