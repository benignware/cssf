import puppeteer from 'puppeteer';

/**
 * Ensures the HTML content has a valid HTML document structure. If not, wraps it in a full HTML page.
 * @param {string} htmlContent - The HTML content to be checked and possibly wrapped.
 * @returns {string} - The complete HTML content with a valid document structure.
 */
function ensureValidHTML(htmlContent) {
  // Check if the HTML content has a valid HTML structure
  if (/^<!DOCTYPE html>/i.test(htmlContent) &&
      /<html/i.test(htmlContent) &&
      /<head/i.test(htmlContent) &&
      /<body/i.test(htmlContent)) {
    // Content already has a valid structure
    return htmlContent;
  }

  // Wrap the content in a full HTML structure
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Test Page</title>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;
}

/**
 * Executes a callback function within a browser context and returns the result.
 * @param {string} htmlContent - The HTML content to be set in the browser.
 * @param {Function} callback - A function that executes within the browser context.
 * @returns {Promise<any>} - The result of the callback function.
 */
export async function runInBrowser(htmlContent, callback) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Ensure the HTML content has a valid structure
    const completeHTML = ensureValidHTML(htmlContent);

    await page.setContent(completeHTML);

    const result = await page.evaluate(callback);

    return result;
  } finally {
    await browser.close();
  }
}
