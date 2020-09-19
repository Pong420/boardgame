import { Page } from 'puppeteer';

describe('others', () => {
  test('only allow one screen at a time', async () => {
    let count = 0;
    const waitForNavigation = async (page: Page) => {
      try {
        await page.waitForNavigation({
          waitUntil: 'networkidle2',
          timeout: 2000
        });
        count++;
      } catch (error) {
        throw new Error(`waitForNavigation fail at ${count}`);
      }
    };

    await expect(page).goto('/');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await expect(page).isHomePage();

    const newPage = await browser.newPage();
    await expect(newPage).goto('/');
    await Promise.all([
      //
      waitForNavigation(page),
      waitForNavigation(newPage)
    ]);

    await expect(page).isErrorPage();
    await expect(newPage).isHomePage();

    // should not changed
    await page.reload({ waitUntil: 'networkidle2' });
    await expect(page).isErrorPage();
    await expect(newPage).isHomePage();

    // should changed
    await page.bringToFront();
    await expect(page).goBack();
    await Promise.all([
      //
      waitForNavigation(page),
      waitForNavigation(newPage)
    ]);

    await expect(page).isHomePage();
    await expect(newPage).isErrorPage();
  });
});
