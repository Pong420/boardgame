import { Page } from 'puppeteer';

// export async function goto(page: Page, pathname: string):
export async function goto(
  page: Page,
  pathname: string
): Promise<jest.CustomMatcherResult> {
  try {
    await page.goto(`${testUrl}${pathname}`);
    return {
      message: () => `goto "${pathname}" success`,
      pass: true
    };
  } catch (error) {
    return {
      message: () => `goto "${pathname}" failure`,
      pass: false
    };
  }
}

expect.extend({
  goto
});
