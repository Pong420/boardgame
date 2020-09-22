import { Page } from 'puppeteer';

type Callback = (page: Page) => Promise<void>;

export const newPageHelper = (pathname: string) => {
  async function newPage(): Promise<Page>;
  async function newPage(cb: Callback): Promise<undefined>;
  async function newPage(cb?: Callback) {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await expect(page).goto(pathname);

    if (cb) {
      await cb(page);
      await page.close();
      await page.browserContext().close();
    } else {
      return page;
    }
  }
  return newPage;
};
