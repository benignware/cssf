import { Builder, By, until } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js';

(async function example() {
    let driver = await new Builder()
        .forBrowser('firefox')
        .usingServer('http://localhost:4444/wd/hub') // Selenium Grid hub URL
        .setFirefoxOptions(new firefox.Options())
        .build();

    try {
        await driver.get('https://www.example.com');

        // Wait until the title is present and assert it
        await driver.wait(until.titleIs('Example Domain'), 10000); // 10 seconds timeout

        let title = await driver.getTitle();
        console.log('Page Title:', title);

        // Find element by tag name
        let header = await driver.findElement(By.tagName('h1'));
        let headerText = await header.getText();
        console.log('Header Text:', headerText);
    } catch (error) {
        console.error('Error during test execution:', error);
    } finally {
        await driver.quit();
    }
})();
