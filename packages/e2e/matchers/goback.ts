import { Page } from 'puppeteer';

export async function goBack(page: Page): Promise<jest.CustomMatcherResult> {
  try {
    const [goback] = await page.$x(`//button[.//span[@icon="arrow-left"]]`);
    await goback.click();
    return {
      message: () => `success`,
      pass: true
    };
  } catch (error) {
    return {
      message: () => error,
      pass: false
    };
  }
}

expect.extend({
  goBack
});
