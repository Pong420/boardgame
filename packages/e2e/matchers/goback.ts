import { Page } from 'puppeteer';

export async function goBack(
  this: jest.MatcherContext,
  page: Page
): Promise<jest.CustomMatcherResult> {
  try {
    const goback = await page.waitForXPath(
      `//button[.//span[@icon="arrow-left"]]`,
      { timeout: 2000 }
    );
    await goback.focus();
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
